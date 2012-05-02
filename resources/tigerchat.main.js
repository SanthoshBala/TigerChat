

/**** ALL GLOBAL VARIABLES GO HERE ****/
var connection = null;			// The strophe connection
var my_user_name;				// My user name (jid)
var instance_friends = {};		// An associative array of my friends/information
var instance_chatrooms = {};	// An associative array of my chatroom affiliations


/************************************************************************
 * Log a message onto the screen (debugging function.)
 ***********************************************************************/
function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}


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
		.html('<div class = "room_creation_box" id="room_creation_box">' + 
				'Name: <input type="text" id="chatroom_creation_name" class="" style="width: 50%; border-radius: 0px"/><br/><br/>' + 
				'Public/Private: <input type="text" id="chatroom_creation_privacy" class="friends_search" style="width: 50%; border-radius: 0px"/><br/><br/>' + 
				'Adhoc/Persistent: <input type="text" id="chatroom_creation_duration" class="friends_search" style="width: 50%; border-radius: 0px"/><br/><br/>' +
				 '<input type="button" id="create_chatroom_button" value="Create Room" class="friends_search" onclick="create_chatroom()" style="width: 50%; border-radius: 0px"/><br/><br/>' +
	
		'</div>')
		.appendTo($( "body" ));
	
	$("#room_creation_dialog").dialog({
		autoOpen: false,
		closeOnEscape: true,
		resizable: true
	});
	
	
	
	$(" <div />" ).attr("id", 'room_management_dialog')
		.attr("title", "Manage Room")
		.html('<div class = "room_manage_box" id="room_manage_box">' + 
		'<select id="chatroom_management_selector"></select>' + 
		
		'</div>')
		.appendTo($( "body" ));
	
	$("#room_management_dialog").dialog({
		autoOpen: false,
		closeOnEscape: true,
		resizable: true
	});
	
	//  Figure out exact purpose of this...		
    $(window).resize();
    
    // If we leave the page, disconnect our ejabberd connection
    window.onbeforeunload = function(){
		connection.disconnect();
    };
});


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

