




/************************************************************************
 * This function handles when a user presses enter while inside a 
 * chatbox. $chat_with_name is the jid that our user is sending the 
 * message to.
 * *********************************************************************/
function HandleChatboxEnter(chat_with_name) {
	
	// Get the text to send, and replace newlines with <br/>
	var send_text = $('#send_text_' + chat_with_name).val();
	send_text = send_text.replace('\n', '<br/>');
	$('#send_text_' + chat_with_name).val('');	
	
	sender_name = my_user_name + '@localhost/princeton';
	
	// If it is a blank message (only spaces), do nothing, and return
	if(jQuery.trim(send_text).length <= 0) return;
	
	// Get timestamp, append my own message to the chatbox, and scroll to the bottom
	var timestamp = getTimeStamp();
	
	$('#text_area_' + chat_with_name).append('<span class="username" style = "color:#ff6633;" >' + timestamp + my_user_name + ": " + '</span> <span class="maintext" style = "color:#000000;" >' + send_text + "</span><br/>");
	$('#text_area_' + chat_with_name).scrollTop($('#text_area_' + chat_with_name)[0].scrollHeight);
	sendMessage(send_text, sender_name, chat_with_name);
}


/************************************************************************
 * Makes a new chatbox, or reopens one that had already been made.
************************************************************************/
function makeNewChatbox(chat_with_name) {
	
	var new_name = "chatbox_" + chat_with_name;  // Creating the ID (chatbox_name)
	
	if(chat_with_name in instance_chatrooms) {
			//log('opening chatroom box.');
			var fullname = instance_chatrooms[chat_with_name].name;
	}
	else {
		//log('opening friend box.');
		var fullname = instance_friends[chat_with_name].FirstName + ' ' +  instance_friends[chat_with_name].LastName;
	}
	
	// If it has already been created, just open it
	if ($("#" + new_name).length > 0) {
		
		// If it's open
		if ($('#' + new_name).dialog('isOpen') == true) {
			return;
		}
		// if its not open, open it
		else {
			 $('#' + new_name).dialog('open');
			 $('#text_area_' + chat_with_name).scrollTop($('#text_area_' + chat_with_name)[0].scrollHeight);
			 $("#" + new_name).css({'height' : '250'});
			return;
		}
	}
	
	
	// Create the div container for the dialog
	$(" <div />" ).attr("id",new_name)
	.attr("title", fullname)
	.html('<div class = "scrolling_area" id = "text_area_' + chat_with_name + '">  </div> <textarea rows="2" name="send_text_' + chat_with_name + '" id="send_text_' + chat_with_name + '" class="chatbox_text" />')
	.appendTo($( "#boxes" ));
	
	// Set Properties of the dialog
	$("#" + new_name).dialog({
        autoOpen: true,
        closeOnEscape: true,
        resizable: true		
    });
    // Add my class, and set default height
	$("#" + new_name).addClass('chatbox_below_title');
	$("#" + new_name).css({'height' : '250'});
	$("#" + new_name).parent().css({'position' : 'fixed'});
	$("#" + new_name).parent().css({'top' : '200px'});
	$("#" + new_name).parent().css({'left' : '500px'});
	
	// Focus function makes sure that only a single chatbox has the orange header
	$("#" + new_name).parent().focus( 
		function() {
			$('div[id^="chatbox"]').parent().children(":first-child").removeClass('ui-widget-header');
			$('div[id*="chatbox"]').parent().children(":first-child").addClass('ui-widget-header-disabled');
			$(this).children(":first").addClass('ui-widget-header');
			$(this).children(":first").removeClass('ui-widget-header-disabled');
		}
	);
	
	// Set some css for the sent text
	$("#send_text_" + chat_with_name).css({'font-family': 'Tahoma,Arial,sans-serif'}); 
	$("#send_text_" + chat_with_name).css({'font-size': '13px'});
	
	// Bind function for pressing enter on the chatbox
	$('#send_text_' + chat_with_name).keypress(
		function(e) {
			// If we press enter, send
			 if (e.which == 13 && !e.shiftKey) {
				 e.preventDefault();
				 HandleChatboxEnter(chat_with_name);
			 }
			 
			 else if (e.which == 13 && e.shiftKey) { 
			 }
		}
	);
	
	// Allow the chatbox to change focus if the user clicks on the textbox inside it
	$('#send_text_' + chat_with_name).focus(
		function() {
		$('div[id^="chatbox"]').parent().children(":first-child").removeClass('ui-widget-header');
		$('div[id*="chatbox"]').parent().children(":first-child").addClass('ui-widget-header-disabled');
		$(this).parent().parent().children(":first").addClass('ui-widget-header');
		$(this).parent().parent().children(":first").removeClass('ui-widget-header-disabled');		         
		}
	);
	
	
	
}


/************************************************************************
 * Send a message.
 * 
 * Message from sender, to recipient, and contents = message_to_send
 * *********************************************************************/
function sendMessage(message_to_send, sender, recipient) {
	
	// Check against our instance chatrooms, and if the recipient
	// is one of them, handle the send as a chatroom send message
	if(recipient in instance_chatrooms) {
		var chatroom_name = recipient;
		var occupants = instance_chatrooms[chatroom_name].occupants;
		//send to each recipient
		for(var i = 0; i < occupants.length; i++) {
			if(occupants[i] == my_user_name) continue;
			var recipient_full = occupants[i] + "@localhost";
			var reply = $msg( {to: recipient_full, from: sender, type: 'chat', msgtype: 'chatroom', chatroom_jid: chatroom_name } ).c("body").t(message_to_send);
			connection.send(reply.tree());
		}
		return;
	}
	
	var recipient_full = recipient + "@localhost";
	var reply = $msg( {to: recipient_full, from: sender, type: 'chat' } ).c("body").t(message_to_send);
	connection.send(reply.tree());
}



/************************************************************************
 * Send a invite to chatroom message.
 * 
 * Message from sender, to recipient, and contents = message_to_send
 * *********************************************************************/
function sendChatroomInvite(recipient, room_name) {
	var recipient_full = recipient + "@localhost";
	var sender = my_user_name + '@localhost/princeton';
	var reply = $msg( {to: recipient_full, from: sender, type: 'chat', chatroom_invite:'true', chatroom_name:room_name } ).c("body").t("chatroom invite.");
	connection.send(reply.tree());
}

function sendChatroomPresence(roomjid) {

		
	$.getJSON('/room/members/', {room_jid: roomjid}, 
				function(data) {
					var thisroomjid = data.room_jid;
					
					for(var j=0; j < data.members.length; j++) {
						var user_jid = data.members[j].jid;
						var recipient_full = user_jid + "@localhost";
						var sender = my_user_name + '@localhost/princeton';
						var reply = $msg( {to: recipient_full, from: sender, type: 'chat', chatroom_invite:'true', chatroom_name:thisroomjid, chatroom_newuser: 'true' } ).c("body").t("chatroom invite.");
						connection.send(reply.tree());
						
					}
					
					repopulateFriendsList();

				}
			);


}


/************************************************************************
 * Show a message in the users text area. 
 * 
 * If no open window exists, open (or create).  
 ************************************************************************/
function showChatMessage(from, message) {
	makeNewChatbox(from);
	var timestamp = getTimeStamp();
	$('#text_area_' + from).append('<span class="contactname" style = "color:#0033cc;" >' + timestamp + from + ": " + '</span> <span class="maintext" style = "color:#000000;" >' + message + "</span><br/>");
	$('#text_area_' + from).scrollTop($('#text_area_' + from)[0].scrollHeight);
	
}

/************************************************************************
 * Show a chatroom message in the users text area. 
 * 
 * If no open window exists, open (or create).
 ************************************************************************/
function showChatRoomMessage(from, message, sender) {
	makeNewChatbox(from);
	var timestamp = getTimeStamp();
	$('#text_area_' + from).append('<span class="contactname" style = "color:#0033cc;" >' + timestamp + sender + ": " + '</span> <span class="maintext" style = "color:#000000;" >' + message + "</span><br/>");
	$('#text_area_' + from).scrollTop($('#text_area_' + from)[0].scrollHeight);
}


/************************************************************************
 * Returns a properly formatted time stamp.
 * *********************************************************************/
function getTimeStamp(){
	var currTime = new Date();
	var hours = currTime.getHours();
	var minutes = currTime.getMinutes();
	if(hours > 12) hours = hours - 12;
	if(hours < 10) hours = '0' + hours;
	if(minutes < 10) minutes = '0' + minutes;
	var timeString = '[' + hours + ":" + minutes + '] ' ;
	return timeString;
}

