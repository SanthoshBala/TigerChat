/***********************************************************************
 * This file defines all the functions used in generating a connection 
 * to another user.
 ***********************************************************************/
 
 


/***********************************************************************
 * This function handles all friend requests on both ends. The two
 * clients user and newFriend are connected by connection, and the 
 * fourth argument dictates whether the presence is meant to request a
 * subscription or unsubscription, if it is to respond to a 
 * subscription request, or if it is meant to indicate availability
 **********************************************************************/
function handlePresences(connection, user, newFriend, presType)
{
	// determine what kind of presence is created
	if (user != '' && newFriend != '')	
	{ 
		var sender = user + '@localhost';
		var recipient = newFriend + '@localhost';
		
		var pres_message = $pres({to: recipient, from: sender, type: presType});
	}
	else
	{
		if (presType != '')
		{
			var pres_message = $pres({id: Strophe.getUniqueId, 
				type: presType});
		}
		else
		{
			var pres_message = $pres();
		}			
	}	
	log(pres_message);
	connection.send(pres_message.tree());
	//var recipient_full = newFriend + "@localhost";
	//var reply = $msg( {to: recipient_full, from: sender, type: 'presence' } ).c("body").t('testmsg');
	//connection.send(reply.tree());
	connection.flush();
}


/***********************************************************************
 * This function provides the interface for sending friend requests
 ***********************************************************************/
function sendRequest(connection, user, newFriend)
{
	thistype = "subscribe";
	handlePresences(connection, user, newFriend, thistype);
}

/***********************************************************************
 * This function provides the interface for accepting friend requests
 ***********************************************************************/
function acceptRequest(connection, user, newFriend)
{
	thistype = "subscribed";
	handlePresences(connection, user, newFriend, thistype);
}
 
/***********************************************************************
 * This function provides the interface for sending friend requests
 ***********************************************************************/
function rejectRequest(connection, user, newFriend)
{
	thistype = "unsubscribed";
	handlePresences(connection, user, newFriend, thistype);
}






/************************************************************************
 * IQ message callback function
 ***********************************************************************/
function onIQ(iq) {
	return true;
}



/***********************************************************************
 * This function indicates that the user is now online
 ***********************************************************************/
function onPresence(pres) {
	// first get the message type and sender
	var sender = pres.getAttribute('from');	
	sender = sender.split('@')[0]; 
	var presType = pres.getAttribute('type'); 

	// Now deal with the different types of presences
	
	// if I get a presence from myself, do nothing
	if(sender == my_user_name) return true;
	
	// Null presences signify sender is online
	if (presType == null) {
		
		// Print "user has logged on" if the chatbox is open
		if ($("#chatbox_" + sender).length > 0) {
			if ($('#chatbox_' + sender).dialog('isOpen') == true) {
				var timestamp = getTimeStamp();
				$('#text_area_' + sender).append('<span style = "color:#AAAAAA;" >' + timestamp + '</span> <span style = "color:#AAAAAA;" >' + sender + ' has logged on' + "</span><br/>");
				$('#text_area_' + sender).scrollTop($('#text_area_' + sender)[0].scrollHeight);
			}
		}
		
		// Update the status of the sender
		updateBuddyListStatus(sender, "online"); 
	}
	
	// Deal with unavailable presences
	else if (presType == 'unavailable') {
		
		// print "user has logged of" if the chatbox is closed
		if ($("#chatbox_" + sender).length > 0) {
			if ($('#chatbox_' + sender).dialog('isOpen') == true) {
				var timestamp = getTimeStamp();
				$('#text_area_' + sender).append('<span style = "color:#AAAAAA;" >' + timestamp + '</span> <span style = "color:#AAAAAA;" >' + sender + ' has logged off' + "</span><br/>");
				$('#text_area_' + sender).scrollTop($('#text_area_' + sender)[0].scrollHeight);
			}
		}
		
		updateBuddyListStatus(sender, "offline");	 
	}
	
	// Subscribe message means that we have either gotten a new friend request,
	// or that a requested friend has accepted.
	else if (presType == 'subscribe') {
		handle_subscribe_message(sender);
	}

	else if (presType == 'unsubscribe') { 
	}
	
	else if (presType == 'subscribed') {
		addToBuddyList(sender);
	}
	
	else if (presType == 'unsubscribed') {
	}
	
	else {
	}
		
	return true;			
 }



/***********************************************************************
 * Handle a subscribe message.
 ***********************************************************************/
function handle_subscribe_message(newfriend) {
	

	$.getJSON("/friends/",
		function(data){
			
			//data = jQuery.parseJSON(data);
			// If we are friends, that means a requestee has accepted
			for(var i = 0; i < data.length; i++) {
				if(data[i].username == newfriend) {
					acceptRequest(connection, my_user_name, newfriend);
					return;
				} 
			}
			
			// Otherwise, we have received a request
			$.getJSON("/requests/",
				function(data){
					repopulate_pending_requests(data);
				}
			);
		}
		
	);
}




/************************************************************************
 * Function handle for when a message is received.
 * 
 ***********************************************************************/
function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from'); 
    from = from.split('/')[0];
    from = from.split('@')[0];
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var body = elems[0];
		

	var chatroom_invite = msg.getAttribute('chatroom_invite');
	
	// Handle if we receive a chatroom invitation
	if(chatroom_invite == 'true') {
		// Just repopulate the requests
		var chatroom_newuser = msg.getAttribute('chatroom_newuser');
		var chatroom_jid = msg.getAttribute('chatroom_name');
		if(chatroom_newuser == 'true') {
			
			if ($("#chatbox_" + chatroom_jid).length > 0) {
				if ($('#chatbox_' + chatroom_jid).dialog('isOpen') == true) {
						
					var timestamp = getTimeStamp();
					var personfrom = msg.getAttribute('myname');
					$('#text_area_' + chatroom_jid).append('<span style = "color:#AAAAAA;" >' + timestamp + '</span> <span style = "color:#AAAAAA;" >' +  personfrom + ' has joined the room.' + "</span><br/>");
					$('#text_area_' + chatroom_jid).scrollTop($('#text_area_' + chatroom_jid)[0].scrollHeight);
				}
			}

			instance_chatrooms[chatroom_jid].occupants.push(from);
			
		}
		
		else if(chatroom_newuser == 'leaveroom') {
						
			
			
			for (myroom in instance_chatrooms) {
				for (member in instance_chatrooms[myroom].occupants) {
					var membername = instance_chatrooms[myroom].occupants[member];
					if (membername == from) {
						delete instance_chatrooms[myroom].occupants[member];
					}
				}
			}
			
			
			
			if ($("#chatbox_" + chatroom_jid).length > 0) {
				if ($('#chatbox_' + chatroom_jid).dialog('isOpen') == true) {
					var timestamp = getTimeStamp();
					var personfrom = msg.getAttribute('myname');
					$('#text_area_' + chatroom_jid).append('<span style = "color:#AAAAAA;" >' + timestamp + '</span> <span style = "color:#AAAAAA;" >' +  personfrom + ' has left the room.' + "</span><br/>");
					$('#text_area_' + chatroom_jid).scrollTop($('#text_area_' + chatroom_jid)[0].scrollHeight);
				}
			}
		}
		
		else if(chatroom_newuser == 'deleteroom') {
			
			
			for (myroom in instance_chatrooms) {
				for (member in instance_chatrooms[myroom].occupants) {
					var membername = instance_chatrooms[myroom].occupants[member];
					if (membername == from) {
						delete instance_chatrooms[myroom].occupants[member];
					}
				}
			}
			
			if ($("#chatbox_" + chatroom_jid).length > 0) {
				if ($('#chatbox_' + chatroom_jid).dialog('isOpen') == true) {
					var timestamp = getTimeStamp();
					$('#text_area_' + chatroom_jid).append('<span style = "color:#AAAAAA;" >' + timestamp + '</span> <span style = "color:#AAAAAA;" >' +  'The chatroom has been deleted. The room will be removed from your buddy list after this session is completed.' + "</span><br/>");
					$('#text_area_' + chatroom_jid).scrollTop($('#text_area_' + chatroom_jid)[0].scrollHeight);
				}
			}
		}
	
		else {
			$.getJSON("/requests/",
				function(data){
					repopulate_pending_requests(data);
				}
			);
		}	
	
	}
	
	// Otherwise, we have gotten a chat message
	else if(type == "chat" && elems.length > 0) {
		
	
		
		// Check if this is a chatroom message
		var msgtype = msg.getAttribute('msgtype');
		if(msgtype == 'chatroom') {
			roomname = msg.getAttribute('chatroom_jid');
			var personfrom = msg.getAttribute('myname');
			showChatRoomMessage(roomname, Strophe.getText(body), from, personfrom);
			return true;
		}
		
		// Otherwise, just show a regular message from a user
		showChatMessage(from, Strophe.getText(body));
			
		if(page_has_focus == false) {
			
			$.getJSON('/vcard/', {jid: friend_netid}, 
				function(data) {
					
					
					new_msg_from = data.first_name;
						
					interval_id = setInterval(BlinkMessage, 1500);
				}
			);
		
		//setInterval(BlinkMessage, 3000);
		//
		}
		
    }

    // we must return true to keep the handler alive.  
    // returning false would remove it after it finishes.
    return true;
}





