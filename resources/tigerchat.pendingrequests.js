


/************************************************************************
 * If the pending requests dialog has been created, then just open it.
 * Otherwise, create it, and then open it.
 ***********************************************************************/
function open_pending_requests() {
	
	// If the pending dialog has already been created, then just open and
	// populate it
	if ($("#subscribe_dialog").length > 0) {
		$('#search_dialog').dialog('open');
		
		$.get("/requests/",
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
		'<table width="100%" cellpadding="0" cellspacing="0" id="pending-table">' +
		'</div>')
		.appendTo($( "body" ));
	
	$("#subscribe_dialog").dialog({
		autoOpen: true,
		closeOnEscape: true,
		resizable: true
	});
	
	$.get("/requests/",
		function(data){
			repopulate_pending_requests(data);
		}
	);
}


/************************************************************************
 * Populate the pending requests.
 ***********************************************************************/
function repopulate_pending_requests(data) {
	
	// Parse the JSON
	data = jQuery.parseJSON(data);
	
	// clear pending table
	$('#pending-table tr').remove();
	
	// For every request, create a row
	for(var i = 0; i < data.length; i++) {
		var newrow = '<tr pendingname= "' + data[i].creator + '">' +
		'<td>' + data[i].creator + '</td>' +
		'<td>' +  "<input type='button' value='Accept' onclick='addReceivedFriend(\"" + data[i].creator + "\")'/>" + '</td>' +
		'<td>' +  "<input type='button' value='Reject' onclick='RejectFriend(\"" + data[i].creator + "\")'/>" + '</td>' +
		'</tr>';
		$("#pending-table").append(newrow);
	}

	// Add room requests to the pending table
	$.get('/room/requests/', function(data) {addPendingChatroomInvites(data) });
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


	$.getJSON("/room/join", {room_jid: roomjid}, 
		function(data) {
			
			//data = jQuery.parseJSON(data);
			
			roomjid = data.room_jid;
			roomname= data.room_name;
			
			addRoomToBuddyList(roomjid, roomname);
			
			sendChatroomPresence(roomjid);
			
		}
	);
	

}


function sendChatroomPresence(roomjid) {

	//send a special chat message to all the people in this chatroom saying i have joined
	

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
	
}


/************************************************************************
 * Reject a friend.
 * THIS FUNCTION NEEDS TO BE PROPERLY IMPLEMENTED. #fix
 ***********************************************************************/
function RejectFriend(newfriendname) {
	rejectRequest(connection, my_user_name, newfriendname);
}
