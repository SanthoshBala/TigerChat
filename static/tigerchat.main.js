

/**** ALL GLOBAL VARIABLES GO HERE ****/
var connection = null;			// The strophe connection
var my_user_name;				// My user name (jid)
var myFirstName;				// My user name (jid)
var myLastName;					// My user name (jid)
var instance_friends = {};		// An associative array of my friends/information
var instance_chatrooms = {};	// An associative array of my chatroom affiliations
var page_has_focus = true;
var new_msg_from = '';
var interval_id = 0;


/************************************************************************
 * Log a message onto the screen (debugging function.)
 ***********************************************************************/
function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

$(window).resize(function(){
	$('.centerimagecontainer').css({
	    position:'absolute',
	    left: ($(window).width() - $('.centerimagecontainer').outerWidth())/2,
	    top: ($(window).height() - $('.centerimagecontainer').outerHeight())/2
	});
	
	//log($(window).width());
	//log($('.centerimagecontainer').outerWidth());
	
	var winwidth = $(window).width();
	var winheight = $(window).height();
	var friendwidth = $('#friends_dialog').dialog("option", "width");
	var friendheight = $('#friends_dialog').dialog("option", "height");
	var friendx = $('#friends_dialog').dialog("option", "position")[0];
	var friendy = $('#friends_dialog').dialog("option", "position")[1];
	
	//log('winheight : ' + winheight);
	
	if( (friendx + friendwidth + 50 > winwidth) ) {
		var newx = winwidth - 51 - friendwidth;
		$('#friends_dialog').dialog("option", "position", [newx, friendy]);
		//log('close to the edge.');
	}
	
	if(friendheight + 175 > winheight && winheight > 600) {
		$('#friends_dialog').dialog("option", "height", winheight-175);
	}
	
	if( (friendy + friendheight + 50 > winheight && winheight > 600) ) {
		var newy = winheight - 51 - friendheight;
		var currx = $('#friends_dialog').dialog("option", "position")[0];
		$('#friends_dialog').dialog("option", "position", [currx, newy]);
		//log('close to the edge.');
	}
	/*
	var curry = $('#friends_dialog').dialog("option", "position")[1];
	var currx = $('#friends_dialog').dialog("option", "position")[0];
	if(curry < 75) 	log('TOO HIGH.'); //$('#friends_dialog').dialog("option", "position", [currx, 75]);
	*/
});




/************************************************************************
 * On page load, execute the following.
 ***********************************************************************/
$(document).ready(function () {
	
	// Create a strophe connection, set the username, and connect
    connection = new Strophe.Connection('/xmpp-httpbind');
	// Set the global username (#fix - this could be hacked)
	
	
	//my_user_name = $('#this_user_name').get(0).value;
	$.getJSON('/profile/', 
		function(data) {
			 my_user_name = data.jid;
			var my_jid = my_user_name + '@localhost/princeton';
			connection.connect(my_jid, 'pwd', onConnect);
			
			$.getJSON('/vcard/', {jid: my_user_name}, 
				function(data) {
					myFirstName = data.first_name; // #fix
					myLastName = data.last_name; //#fix
					
				}
			);
			
			
	
		} 	
	);
	
	
	
	
	
      
	// Initialize the instance friends variable
	$.get('/friends/', function(data) {InitializeFriendsVariable(data)} );
    
    
	//$('.btn').button('reset');
    
    window.onblur = disableStuff;
	window.onfocus = enableStuff;
	
	
	
	
	
    // If we leave the page, disconnect our ejabberd connection
    window.onbeforeunload = function(){
		connection.disconnect();
    };
   
   	$('.centerimagecontainer').css({
	    position:'absolute',
	    left: ($(window).width() - $('.centerimagecontainer').outerWidth())/2,
	    top: ($(window).height() - $('.centerimagecontainer').outerHeight())/2
	}); 
});



function disableStuff() {
	page_has_focus = false;
}
function enableStuff() {
	page_has_focus = true;
	if(new_msg_from != '') {
		clearInterval(interval_id);
		$(document).attr('title', 'TigerChat');
		new_msg_from = '';
	}
}

function BlinkMessage() {
	
	//log(from);
	if(	$(document).attr('title') == 'TigerChat') {
		$(document).attr('title', new_msg_from + ' says...');
	}
	else {
		
		$(document).attr('title', 'TigerChat');
	}
	
}
/************************************************************************
 * Called upon initial connection.
 ***********************************************************************/
function onConnect(status)
{
	
    if (status == Strophe.Status.CONNECTING) {
		//log('Strophe is connecting.');
    } 
    else if (status == Strophe.Status.CONNFAIL) {
		//log('Strophe failed to connect.');
		$('#connect').get(0).value = 'connect';
    } 
    else if (status == Strophe.Status.DISCONNECTING) {
		//log('Strophe is disconnecting.');
    } 
    else if (status == Strophe.Status.DISCONNECTED) {
		//log('Strophe is disconnected.');
		$('#connect').get(0).value = 'connect';
    } 
    else if (status == Strophe.Status.CONNECTED) {
		//slog('Strophe is connected.');
		log('Send a message to ' + connection.jid + 'to talk to me.');
		connection.addHandler(onMessage, null, 'message', null, null,  null); 
		connection.addHandler(onPresence, null, 'presence', null, null, null); 
		connection.addHandler(onIQ, null, 'iq', null, null, null); 
		connection.send($pres().tree());
	}
}



