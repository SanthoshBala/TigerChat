

/**** ALL GLOBAL VARIABLES GO HERE ****/
var connection = null;			// The strophe connection
var my_user_name;				// My user name (jid)
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
	
	var winwidth = $(window).width();
	var winheight = $(window).height();
	var friendwidth = $('#friends_dialog').dialog("option", "width");
	var friendx = $('#friends_dialog').dialog("option", "position")[0];
	var friendy = $('#friends_dialog').dialog("option", "position")[1];
	
	if( (friendx + friendwidth + 50 > winwidth) ) {
		var newx = winwidth - 51 - friendwidth;
		$('#friends_dialog').dialog("option", "position", [newx, friendy]);
		//log('close to the edge.');
	}
	
	
	
});


/************************************************************************
 * On page load, execute the following.
 ***********************************************************************/
$(document).ready(function () {
	
	// Create a strophe connection, set the username, and connect
    connection = new Strophe.Connection('/xmpp-httpbind');
	// Set the global username (#fix - this could be hacked)
	my_user_name = $('#this_user_name').get(0).value;
	
	var my_jid = my_user_name + '@localhost/princeton';
	connection.connect(my_jid, 'pwd', onConnect);

      
	// Initialize the instance friends variable
	$.get('/friends/', function(data) {InitializeFriendsVariable(data)} );

    
  
  
	
	$(" <div />" ).attr("id", 'room_creation_dialog')
		.attr("title", "Create A Room")
		.html('<div class = "room_creation_box" id="room_creation_box" style="height: 100%; margin: auto; position: relative; background-color:white; border-radius: 0px 0px 8px 8px;">' +
			
			'<div class="roomcreation_toptext" id="my_roomcreation_toptext"> ' +
			'<table width="100%" cellpadding="10" cellspacing="10" id="roomcreation_toptext_table">' + 
			'<tr> <td width="50px"> <img src="/static/imgs/small_add_group.png"/> </td> <td> Enter the name of the room you wish to create.  </td> </tr> </table>' +
			'</div>' +
			
			'<div class="search_text" id="chatroom_creation_name_div" style="height: 32px; text-align: center; padding-left: 18px; padding-right: 40px; padding-top: 5px;" >' +
			'<table id="room_creation_table" style="width:100%;"> <tr> <td> ' +
			'<input type="text" id="chatroom_creation_name" style="width: 100%; border-radius: 0px"> </td>' + 
				'<td style="width: 10px;"><a id="create_chatroom_button" class="btn btn-success" style="width: 100%;">  <i class="icon-plus icon-white"></i> </a></td></tr></table>' +

			'</div>')
		.appendTo($( "body" ));
		
		$('#create_chatroom_button').click( 
			function() {
				create_chatroom();
			}
		);
		
	$("#room_creation_dialog").dialog({
		autoOpen: false,
		closeOnEscape: true,
		resizable: true,
		minWidth: 300,
		minHeight: 200,
		height: 210,
		width: 310
	});
	
	/*
	$(window).resize();*/
	
	// start the dropdowns
	//$('.dropdown-toggle').dropdown();
    
    
	$('.btn').button('reset');
    
    window.onblur = disableStuff;
	window.onfocus = enableStuff;
	$('#mybtn').button();
	$('#mybtn').click(
		function() {
			$('#mybtn').button('loading');
			window.setTimeout('timestuff()', 1000);
		}
	);
	
	
	
	
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



