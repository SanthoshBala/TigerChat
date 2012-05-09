



function create_pending_requests_dialog() {

	// Create the pending dialog
	$(" <div />" ).attr("id", 'subscribe_dialog')
		.attr("title", "Pending Requests")
		.html('<div class = "subscribe_box" id="subscribe_box">' + 
		
		'<div id="pending_title_friends" class="pending_title_hdr" style="margin-top: 10px; margin-left: 15px; margin-right:15px;"> Friends <hr style="margin: 1px 15px 10px 0px;" > </div>' +
		'<div id="pending_friends_table" style="margin-left: 15px;"><table width="100%" cellpadding="3" cellspacing="3" id="pending-table"></table></div>' +
		
		'<div id="pending_title_chatrooms" class="pending_title_hdr" style="margin-top: 25px; margin-left: 15px; margin-right:15px;""> Chatrooms <hr style="margin: 1px 15px 10px 0px;" > </div>' +
		'<div id="pending_rooms_table" style="margin-left: 15px;"> <table width="100%" cellpadding="3" cellspacing="3" id="pending-table-rooms"></table></div>' +
		
		'</div>')
		.appendTo($( "body" ));
		
	
	$("#subscribe_dialog").dialog({
		autoOpen: false,
		closeOnEscape: true,
		resizable: true,
		minHeight: 250,
		minWidth: 300,
		height: 275,
		width: 325
	});
	
	$("#subscribe_dialog").parent().css({'position' : 'fixed'});

	
	//$("#subscribe_dialog").css({'margin': '15px'});
	


}

/************************************************************************
 * If the pending requests dialog has been created, then just open it.
 * Otherwise, create it, and then open it.
 ***********************************************************************/
function open_pending_requests() {
	
	// If the pending dialog has already been created, then just open and
	// populate it
	if ($("#subscribe_dialog").length > 0) {
		$('#subscribe_dialog').dialog('close');
		$('#subscribe_dialog').dialog('open');
		$.getJSON("/requests/",
			function(data){
				repopulate_pending_requests(data);
				
				$('#subscribe_dialog').dialog('open');
			}
		);
		return;
	}
	
	create_pending_requests_dialog();
	$.getJSON("/requests/",
			function(data){
				repopulate_pending_requests(data);
				
				$('#subscribe_dialog').dialog('open');
			}
	);
}


/************************************************************************
 * Populate the pending requests.
 ***********************************************************************/
function repopulate_pending_requests(data) {
	
	// Parse the JSON
	//data = jQuery.parseJSON(data);
	// clear pending table
	$('#pending-table tr').remove();
	$('#pending-table-rooms tr').remove();
	
	if ($("#subscribe_dialog").length <= 0) {
		create_pending_requests_dialog();
	}
	
	
	if(data.friend_requests.length == 0 && data.room_invites.length == 0) {
		//change image to plain envelope
		$('#pending_requests_img_div').html('<a id="ttip3" rel="tooltip" title="Requests"><img id="pending_requests_img" class="friends_button" src="/static/imgs/pending_envelope.png" height=25px  onclick="open_pending_requests()" style="padding: 2px 5px 2px; position:relative; top:-3px; border: 1px solid #F2F2F2;"></img></a>');
		
		$('#ttip3').tooltip({
			'placement':'top',
			'delay': { 'show': 700, 'hide': 100 }
		});
	
	}
	else {
		// change image to exclamation envelope
		
		$('#pending_requests_img_div').html('<a id="ttip3" rel="tooltip" title="Requests"><img id="pending_requests_img" class="friends_button" src="/static/imgs/pending_envelope_exclamation.png" height=25px  onclick="open_pending_requests()" style="padding: 2px 5px 2px; position:relative; top:-3px; border: 1px solid #F2F2F2;"></img></a>');
	
		$('#ttip3').tooltip({
			'placement':'top',
			'delay': { 'show': 700, 'hide': 100 }
		});
	
	}
	
	
	$('.friends_button').hover(
		function() {
			$(this).addClass('btn');
			$(this).css({'border' : '1px solid #cccccc'});
		},
		function() {
			$(this).removeClass('btn');
			$(this).css({'border' : '1px solid #F2F2F2'});
		}
	);
	
	
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
		$("#pending-table-rooms").append(newrow);
	}

	//$('#subscribe_dialog').dialog('open');	

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
		$("#pending-table-rooms").append(newrow);
	}
	
	// Open the dialog
	$('#subscribe_dialog').dialog('open');	
}



function RejectReceivedChatroomInvite(roomjid) {

	log('ok.');

}

/************************************************************************
 * Accept a received chatroom invitation.
 ***********************************************************************/
function AcceptReceivedChatroomInvite(roomjid) {

	$('#pending-table-rooms tr[pendingname= "' + roomjid + '"]').remove();

	$.getJSON("/room/join", {room_jid: roomjid}, 
		function(data) {
			
			//data = jQuery.parseJSON(data);
			
			roomjid = data.room_jid;
			roomname= data.room_name;
			admin = data.room_admin;
			
			addRoomToBuddyList(roomjid, roomname, admin);
			
			sendChatroomPresence(roomjid);
			
			$.getJSON("/requests/",
					function(data){
						refresh_pending_requests(data);
						//repopulate_pending_requests(data);
						
					}
			);
			}
	);
	

}

function refresh_pending_requests(data) {
	log('refreshing.');
	
	if(data.friend_requests.length == 0 && data.room_invites.length == 0) {		
		log('no more requests!');		
		$('#pending_requests_img_div').html('<a id="ttip3" rel="tooltip" title="Requests"><img id="pending_requests_img" class="friends_button" src="/static/imgs/pending_envelope.png" height=25px  onclick="open_pending_requests()" style="padding: 2px 5px 2px; position:relative; top:-3px; border: 1px solid #F2F2F2;"></img></a>');
		$('#subscribe_dialog').dialog('close');
		
		$('#ttip3').tooltip({
			'placement':'top',
			'delay': { 'show': 700, 'hide': 100 }
		});
			
	}
	else {
		
		repopulate_pending_requests(data);
		
	}
		
}




/************************************************************************
 * Add a friend who has sent you a friend request.
 ***********************************************************************/
function addReceivedFriend(newfriendname) {
	
	$.getJSON("/addfriend/", {jid: newfriendname}, 
		function(data) {
			
			
			var newfriendname = data.jid;

			// send a subscribed message
			acceptRequest(connection, my_user_name, newfriendname);
			// send a subscribe message
			sendRequest(connection, my_user_name, newfriendname);
			
			// Remove from the pending dialog table
			$('#pending-table tr[pendingname= "' + newfriendname + '"]').remove();
			$('#search-table tr[friendname="' + newfriendname + '"] td:eq(2)').replaceWith('<td>' + '<button disabled="disabled" type="button"> Friends </button>' + '</td>');
			$.getJSON("/requests/",
						function(data){
							refresh_pending_requests(data);
						}
					);

	
		
		} 
	);
	

}


/************************************************************************
 * Reject a friend.
 * THIS FUNCTION NEEDS TO BE PROPERLY IMPLEMENTED. #fix
 ***********************************************************************/
function RejectFriend(newfriendname) {
	$.getJSON("/friend/ignore/", {jid: newfriendname});
	$('#pending-table tr[pendingname= "' + newfriendname + '"]').remove();
	
	$.getJSON("/requests/",
			function(data){
				refresh_pending_requests(data);
				
				//$('#subscribe_dialog').dialog('open');
			}
	);
}

