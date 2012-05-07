


/************************************************************************
 * If the pending requests dialog has been created, then just open it.
 * Otherwise, create it, and then open it.
 ***********************************************************************/
function open_pending_requests() {
	
	log('opening pending requests.');
	// If the pending dialog has already been created, then just open and
	// populate it
	if ($("#subscribe_dialog").length > 0) {
		$('#search_dialog').dialog('open');
		$.getJSON("/requests/",
			function(data){
				repopulate_pending_requests(data);
			}
		);
		return;
	}
	
	// Create the pending dialog
	$(" <div />" ).attr("id", 'subscribe_dialog')
		.attr("title", "Pending Requests")
		.html('<div class = "subscribe_box" id="subscribe_box">' + 
		'<div id="pending_title_friends" class="pending_title_hdr"> Friends <hr style="margin: 1px 15px 10px 0px;" > </div>' +
		'<table width="100%" cellpadding="3" cellspacing="3" id="pending-table"></table>' +
		'<div id="pending_title_chatrooms" class="pending_title_hdr" style="margin-top: 25px;"> Chatrooms <hr style="margin: 1px 15px 10px 0px;" > </div>' +
		'<table width="100%" cellpadding="3" cellspacing="3" id="pending-table-rooms"></table>' +
		'</div>')
		.appendTo($( "body" ));
		
	$("#subscribe_dialog").css({'margin': '15px'});
	
	$("#subscribe_dialog").dialog({
		autoOpen: true,
		closeOnEscape: true,
		resizable: true
	});
	
	$("#subscribe_dialog").css({'height': '200px'});
	
	$.getJSON("/requests/",
		function(data){
			repopulate_pending_requests(data);
		}
	);
}


/************************************************************************
 * Populate the pending requests.
 ***********************************************************************/
function repopulate_pending_requests(data) {
	log(data);
	// Parse the JSON
	//data = jQuery.parseJSON(data);
	
	// clear pending table
	$('#pending-table tr').remove();
	
	// For every request, create a row
	log(data.friend_requests);
	for(var i = 0; i < data.friend_requests.length; i++) {
		
		var sender_jid = data.friend_requests[i].creator;
		
		$.getJSON('/vcard/', {jid: sender_jid}, 
			function(data) {
							
				FirstName = data.first_name;
				LastName = data.last_name; 
				var newrow = '<tr pendingname= "' + sender_jid + '">' +
				'<td>' + FirstName + ' ' + LastName + '</td>' +
				'<td>' +  "<input type='button' value='Accept' onclick='addReceivedFriend(\"" + sender_jid + "\")'/>" + '</td>' +
				'<td>' +  "<input type='button' value='Reject' onclick='RejectFriend(\"" + sender_jid + "\")'/>" + '</td>' +
				'</tr>';
				$("#pending-table").append(newrow);
				
			}
		);
		
		
		
	}
	
	for(var i = 0; i < data.room_invites.length; i++) {
		var newrow = '<tr pendingname= "' + data.room_invites[i].room_name + '">' +
		'<td>' + data.room_invites[i].room_name + ' room</td>' +
		'<td>' +  "<input type='button' value='Accept' onclick='AcceptReceivedChatroomInvite(\"" + data.room_invites[i].room_jid + "\")'/>" + '</td>' +
		'<td>' +  "<input type='button' value='Reject' onclick='RejectReceivedChatroomInvite(\"" + data.room_invites[i].room_jid + "\")'/>" + '</td>' +
		'</tr>';
		$("#pending-table").append(newrow);
	}

	$('#subscribe_dialog').dialog('open');	

	// Add room requests to the pending table
	//$.get('/room/requests/', function(data) {addPendingChatroomInvites(data) });
}


/************************************************************************
 * Add the pending chatroom invitations to the pending dialog.
 ***********************************************************************/
function addPendingChatroomInvites(data) {

	// Parse the JSON
	data = jQuery.parseJSON(data);
	
	// For every invitation, create a row
	for(var i = 0; i < data.length; i++) {
		var newrow = '<tr pendingname= "' + data[i].room_name + '">' +
		'<td>' + data[i].room_name + ' room</td>' +
		'<td>' +  "<input type='button' value='Accept' onclick='AcceptReceivedChatroomInvite(\"" + data[i].room_jid + "\")'/>" + '</td>' +
		'<td>' +  "<input type='button' value='Reject' onclick='RejectReceivedChatroomInvite(\"" + data[i].room_jid + "\")'/>" + '</td>' +
		'</tr>';
		$("#pending-table").append(newrow);
	}
	
	// Open the dialog
	$('#subscribe_dialog').dialog('open');	
}


/************************************************************************
 * Accept a received chatroom invitation.
 ***********************************************************************/
function AcceptReceivedChatroomInvite(roomjid) {

	$('#pending-table tr[pendingname= "' + roomjid + '"]').remove();

	$.getJSON("/room/join", {room_jid: roomjid}, 
		function(data) {
			
			//data = jQuery.parseJSON(data);
			
			roomjid = data.room_jid;
			roomname= data.room_name;
			admin = data.room_admin;
			
			addRoomToBuddyList(roomjid, roomname, admin);
			
			sendChatroomPresence(roomjid);
			
		}
	);
	

}




/************************************************************************
 * Add a friend who has sent you a friend request.
 ***********************************************************************/
function addReceivedFriend(newfriendname) {
	
	$.get("/addfriend/", {jid: newfriendname} );
	
	// send a subscribed message
	acceptRequest(connection, my_user_name, newfriendname);
	// send a subscribe message
	sendRequest(connection, my_user_name, newfriendname);
	
	// Remove from the pending dialog table
	$('#pending-table tr[pendingname= "' + newfriendname + '"]').remove();
	$('#search-table tr[friendname="' + newfriendname + '"] td:eq(2)').replaceWith('<td>' + '<button disabled="disabled" type="button"> Friends </button>' + '</td>');
	
}


/************************************************************************
 * Reject a friend.
 * THIS FUNCTION NEEDS TO BE PROPERLY IMPLEMENTED. #fix
 ***********************************************************************/
function RejectFriend(newfriendname) {
	$.getJSON("/friend/ignore/", {jid: newfriendname});
	$('#pending-table tr[pendingname= "' + newfriendname + '"]').remove();
}

