
function openRoomCreation() {
	$('#room_creation_dialog').dialog('open');	
}


function TestRoomMembers() {

	for(roomjid in instance_chatrooms) {
	
		log(roomjid);
		log('name: ' + instance_chatrooms[roomjid].name);
		for(var i = 0; i < instance_chatrooms[roomjid].occupants.length; i++) {
			log('participant: ');
			log(instance_chatrooms[roomjid].occupants[i]);
		}
	
	}
}


/************************************************************************
 * Open the chatroom management dialog.
 * 
 ***********************************************************************/
function Manage_Chatrooms() {

	// If the chatroom management dialog has already been created, then just open it
	if ($("#room_management_dialog").length > 0) {
		// Clear lines from the table
		$('#chatroom_search-table tr').remove();
		$('#room_management_dialog').dialog('open');
		$('#chatroom_management_selector').html('');
		option = '<option>' + 'Select A Room' + '</option>';
		$('#chatroom_management_selector').append(option);
		for (chatroomname in instance_chatrooms) {
			
			option = '<option>' + chatroomname + '</option>';
			$('#chatroom_management_selector').append(option);
		}
		return;
	}

	
	$(" <div />" ).attr("id", 'room_management_dialog')
		.attr("title", "Manage Room")
		.html('<div class = "room_manage_box" id="room_manage_box" style="height: 100%; margin: auto; position: relative; background-color:white; border-radius: 0px 0px 0px 12px;">' +
			
			'<div class="selector_text" id="my_selector_text" style="height: 80px; text-align: center; padding-left: 5px; padding-right: 11px; padding-top: 5px;" >' +
			'<select id="chatroom_management_selector"></select>' + 
			
			'<div id="room_delete_div">' +
			//'<input id="manage_rooms_delete" type="button" value="Remove" onclick="removeChatroom()"/>' + 
			'</div>' +
			'</div>' + 
			
			
			'<div class="search_text" id="my_search_text" style="height: 32px; text-align: center; padding-left: 5px; padding-right: 11px; padding-top: 5px;" >' +
		
			//'<input type="text" id="chatroom_search_textbox" style="width: 100%; border-radius: 0px">' +
			'</div>' + 
			
			'<div class="chatroom_search_table" id="chatroom_search_table" style="overflow-y: auto; position: absolute; left: 7px; right: 5px; top:120px; bottom: 20px; background: white;">' +
			'<table width="100%" cellpadding="0" cellspacing="0" id="chatroom-search-table">' +
			'</table>' + 
			'</div>' +	
			
			'</div>')
		.appendTo($( "body" ));
	
	
	// Set stuff when an option is selected
	$('#chatroom_management_selector').change(
		function(e){
			
			var roomjid = $("#chatroom_management_selector").val();
			
			//log('changed selection to ' + roomjid);
			if(roomjid == 'Select A Room') {
				$('#room_delete_div').html('');
				$('#my_search_text').html('');
				return;
			}
			
			else if(instance_chatrooms[roomjid].admin == my_user_name) {
				//log(' I am the admin');
				$('#room_delete_div').html('<input id="manage_rooms_delete" type="button" value="Remove" onclick="removeChatroom()"/>');
				$('#my_search_text').html('<input type="text" id="chatroom_search_textbox" style="width: 100%; border-radius: 0px">');

			}
			
			else {
				//log(' I am not the admin');
				$('#room_delete_div').html('<input id="manage_rooms_delete" type="button" value="Remove" onclick="removeChatroom()"/>');
				$('#my_search_text').html('Please ask the administrator to add users');

			}
			
		}
	);
	
	$('#chatroom_search_textbox').keypress(function(e)
	{
		// 13 is enter key
		if (e.which == 13){
			searchterm = $('#chatroom_search_textbox').val();
			$('#chatroom_search_textbox').val('');	// clear the search box
			$('#chatroom-search-table tr').remove();	// clear the table
				
			var roomjid = $("#chatroom_management_selector").val();

			fillRoomSearchBox(searchterm, roomjid);
		}
	});
	
	$("#room_management_dialog").dialog({
		autoOpen: true,
		closeOnEscape: true,
		resizable: true
	});
	
	
    $("#room_management_dialog").css({'height' : '250'});
    $("#room_management_dialog").css({'width' : '300'});


	$('#room_management_dialog').dialog('open');
	$('#chatroom_management_selector').html('');
	option = '<option>' + 'Select A Room' + '</option>';
	$('#chatroom_management_selector').append(option);
	for (chatroomname in instance_chatrooms) {
		
		option = '<option>' + chatroomname + '</option>';
		$('#chatroom_management_selector').append(option);
	}
		
	
}

function fillRoomSearchBox(searchterm, roomjid) {
	
	
	$.get("/search/", {query: searchterm, room_jid: roomjid},
		function(data){
			populateRoomSearchBox(data);
		}
	);
}

// never returns DNE #fix
function populateRoomSearchBox(data) {
		
	
	var newdata = jQuery.parseJSON(data);
	
	$('#chatroom-search-table tr').remove();
		 
	for(var i = 0; i < newdata.length; i++) {
		if(typeof newdata[i].class === "undefined") var classyear = '';
		else var classyear = newdata[i].class;
		
		var username = newdata[i].username;
		
		var newrow = '<tr friendname= "' + newdata[i].username + '">' +
			'<td>' + newdata[i].first_name + ' ' + newdata[i].last_name + '</td>' +
			'<td>' + classyear + '</td>';
		
		
		// If we have received a friend request from them, have a disabled "accept" button
		if(newdata[i].friendship_status == 'Pending') {
			newrow = 	newrow + 
						'<td>' + '<button disabled="disabled" type="button"> Invited </button>' + '</td>' + 
						'</tr>';
		}
		
		// If we have received a friend request from them, have a disabled "accept" button
		else if(newdata[i].friendship_status == 'Confirmed') {
			newrow = 	newrow + 
						'<td>' + '<button disabled="disabled" type="button"> Member </button>' + '</td>' + 
						'</tr>';
		}
		
		else if(newdata[i].friendship_status == 'DNE') {
			continue;
		}
		
		
		
		// Otherwise, create buttons as usual
		else {
			newrow = newrow +
			'<td>' + '<input type="button" value="Invite" onclick="inviteChatroomFriend(\'' + newdata[i].username + '\')"/>' + '</td>' + 
			'</tr>';
		}
		
		
		$("#chatroom-search-table").append(newrow);
	
	}
	
    
}



function inviteChatroomFriend(friendname) {
	
	var roomname = $("#chatroom_management_selector").val();
	log(roomname  + ' and ' + friendname);
	invite_to_chatroom(friendname, roomname);
	$('#chatroom-search-table tr[friendname="' + friendname + '"] td:eq(2)').replaceWith('<td>' + '<button disabled="disabled" type="button"> Invited </button>' + '</td>');


}





/************************************************************************
 * Creates a chatroom.  Called by the button press on the 
 * BuddyList dialog.
 * 
 ***********************************************************************/
function create_chatroom() {

	var roomname = $('#chatroom_creation_name').val();
	var roomprivacy = $('#chatroom_creation_privacy').val();
	var roomduration = $('#chatroom_creation_duration').val();
	
	room_private_val = true;
	room_persistent = true;
	
	
	// check if jid for chatroom already exists
	if(isLegalRoomName(roomname) == false) {
		log("illegal room name.");
		return;
	}

	if(jQuery.trim(roomname).length <= 0) {
		log('Please enter a room name.');
		return;
	}

	
	// replacing spaces with dots for jid
	var roomjid = roomname.replace(/ /g,"_");
	
	 
	
	// post to database with jid, privacy, room duration, name
	$.getJSON('/room/create/', {name: roomname, jid: roomjid, room_private: room_private_val, persistent: room_persistent}, 
	
		function(data) {
			log('return function after creation.');
			//data = jQuery.parseJSON(data);
			
			if (data.name_conflict == true) {
				log('We have a name conflict.  Please select a new name.');
			}
			else {
				var roomjid = data.room_jid;
				var roomname = data.room_name;
				addRoomToBuddyList(roomjid, roomname, my_user_name);
			}
		}
	);
	
	
}

function isLegalRoomName(roomname) {
	var iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?_";
	for (var i = 0; i < roomname.length; i++) {
		if (iChars.indexOf(roomname.charAt(i)) != -1) {
			return false;
		}
	}
	return true;
}

function addRoomToBuddyList(roomjid, roomname, admin) {
	log('adding a room ' + roomjid + ' to my buddy list.');

	var new_room = {};
	new_room.occupants = new Array();
	new_room.occupants[0] = my_user_name;
	new_room.name = roomname;
	new_room.admin = admin;
	instance_chatrooms[roomjid] = new_room;
	
	$.getJSON('/room/members/', {room_jid: roomjid}, 
				function(data) {
					var thisroomjid = data.room_jid;
					
					for(var j=0; j < data.members.length; j++) {
						var user_jid = data.members[j].jid;
						instance_chatrooms[thisroomjid].occupants[j] = user_jid;
					}
					
					repopulateFriendsList();

				}
			);
	
}


function removeChatroom() {


	var roomjid = $("#chatroom_management_selector").val();
	
	if(instance_chatrooms[roomjid].admin == my_user_name) {
		sendChatroomDeletion(roomjid);
		// send message saying the room has been destroyed
		delete instance_chatrooms[roomjid];
		repopulateFriendsList();
		$('#room_delete_div').html('');
		$('#my_search_text').html('');	
		Manage_Chatrooms();
	}
	
	else {
		sendChatroomLeave(roomjid);
		delete instance_chatrooms[roomjid];
		repopulateFriendsList();
		$('#room_delete_div').html('');
		$('#my_search_text').html('');
		Manage_Chatrooms();
	}

	

}





function sendChatroomDeletion(roomjid) {

		
	$.getJSON('/room/members/', {room_jid: roomjid}, 
				function(data) {
					var thisroomjid = data.room_jid;
					
					for(var j=0; j < data.members.length; j++) {
						var user_jid = data.members[j].jid;
						if(user_jid == my_user_name) continue;
						var recipient_full = user_jid + "@localhost";
						var sender = my_user_name + '@localhost/princeton';
						var reply = $msg( {to: recipient_full, from: sender, type: 'chat', chatroom_invite:'true', chatroom_name:thisroomjid, chatroom_newuser: 'deleteroom' } ).c("body").t("chatroom invite.");
						connection.send(reply.tree());
						
					}
					
					repopulateFriendsList();
					
					$.getJSON('/room/destroy/', {room_jid: roomjid});
				}
			);


}
function sendChatroomLeave(roomjid) {

		
	$.getJSON('/room/members/', {room_jid: roomjid}, 
				function(data) {
					var thisroomjid = data.room_jid;
					
					for(var j=0; j < data.members.length; j++) {
						var user_jid = data.members[j].jid;
						if(user_jid == my_user_name) continue;
						var recipient_full = user_jid + "@localhost";
						var sender = my_user_name + '@localhost/princeton';
						var reply = $msg( {to: recipient_full, from: sender, type: 'chat', chatroom_invite:'true', chatroom_name:thisroomjid, chatroom_newuser: 'leaveroom' } ).c("body").t("chatroom invite.");
						connection.send(reply.tree());
						
					}
					
					repopulateFriendsList();

					$.getJSON('/room/leave/', {room_jid: roomjid});		// /room/leave/
				}
			);


}
/************************************************************************
 * Invite /user/ to /chatroom/.   
 ***********************************************************************/
function invite_to_chatroom(user, chatroom) {

	//check to confirm that I am capable of inviting to a room
	$.get('/room/invite/', {room_jid: chatroom, invitee_jid: user}); 
	
	// send special message
	sendChatroomInvite(user, chatroom);	
	

}
