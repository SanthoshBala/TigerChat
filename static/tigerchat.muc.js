
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


function change_selected_room(room_name) {
	$('#curr_selected_room').html(room_name);
	
	
	
	roomjid = room_name;
			
			//log('changed selection to ' + roomjid);
			if(roomjid == 'Select A Room') {
				$('#room_manage_additions').css({'visibility': 'hidden'});
				return;
			}
			
			else if(instance_chatrooms[roomjid].admin == my_user_name) {
				//log(' I am the admin');
				$('#room_manage_additions').css({'visibility': ''});
				
				

			}
			
			else {
				//log(' I am not the admin');
				
				$('#room_manage_additions').css({'visibility': ''});

			}
			
	
}

/************************************************************************
 * Open the chatroom management dialog.
 * 
 ***********************************************************************/
function Manage_Chatrooms() {

	// If the chatroom management dialog has already been created, then just open it
	if ($("#room_management_dialog").length > 0) {
		$('.room_selection_item').remove();
		$('#room_management_dialog').dialog('open');
		change_selected_room('Select A Room');
		for (chatroomname in instance_chatrooms) {
			
			var listitem = '<li class="room_selection_item" onclick="change_selected_room(\'' + chatroomname + '\')"><a>' + chatroomname + '</a></li>';
			$('#list_of_rooms').append(listitem);
		}
		return;
	}

	
	$(" <div />" ).attr("id", 'room_management_dialog')
		.attr("title", "Manage Room")
		.html('<div class = "room_manage_box" id="room_manage_box" style="height: 100%; margin: auto; position: relative; background-color:white; border-radius: 0px 0px 0px 12px;">' +
			
			
			
			//'<table id="manage_overall_table" style="width: 100%; height: 100%"> <tr> <td style="margin: 5px; vertical-align: top;">' +
			'<div id="wrapmydiv" style="height: 100%;">' +
			
			'<div class = "room_manage_rooms" id="room_manage_rooms" style=" height:  50px; margin: auto; position: absolute; top: 5px; left: 5px; right: 5px; background-color:white; border-radius: 0px 0px 8px 8px;">' +
			
			
			'<div class="room_manage_rooms_toptext" id="my_room_manage_rooms_toptext"> ' +
			'<table width="100%" cellpadding="10" cellspacing="10" id="room_manage_rooms_toptext_table">' + 
			'<tr> <td width="50px"> <img src="/static/imgs/rsz_picture3.png"/> </td> <td> Select your room below.  </td> </tr> </table>' +
			'</div>' +
			
			'<div style="padding-left: 10px; padding-right: 16px;">' +
			'<table style="width: 95%"><tr><td>' +	
			'<div class="btn-group">' +
			'<button data-toggle="dropdown" class="btn btn-primary dropdown-toggle" style="width: 100%"><span id="curr_selected_room">Select A Fucking Room</span><span class="caret"></span></button>' +
			'<ul id="list_of_rooms" class="dropdown-menu">' +
			'</ul>' +
			'</div>' +
			'</td><td style="width: 30px;"><a id="roomdeletebutton" class="btn btn-danger" style="width: 100%;">  <i class="icon-minus icon-white"></i> </a></td></tr></table>' +
			'</div>' +
			
			'</div>' +
			
			//'</td></tr> <tr><td style="vertical-align: top;"> ' +
			

			'<div class = "room_manage_additions" id="room_manage_additions" style="visibility: hidden; position: absolute; left: 5px; right: 5px; top: 105px; bottom: 5px; background-color:white; border-radius: 0px 0px 8px 8px;">' +
			
			'<div class="room_manage_additions_toptext" id="my_room_manage_additions_toptext"> ' +
			'<table width="100%" cellpadding="10" cellspacing="10" id="room_manage_additions_toptext_table">' + 
			'<tr> <td width="50px"> <img src="/static/imgs/rsz_picture3.png"/> </td> <td> Enter a user\'s name or netid in the search box below.  </td> </tr> </table>' +
			'</div>' +
			
			'<div class="room_search_text" id="my_room_search_text" style="height: 32px; text-align: center; padding-left: 18px; padding-right: 40px; padding-top: 5px;" >' +
			'<table style="width:100%;"> <tr> <td> ' +
			'<input type="text" id="chatroom_search_textbox" style="width: 100%; border-radius: 0px"> </td>' + 
				'<td style="width: 30px;"><a id="room_searchbutton" class="btn btn-primary" style="width: 100%;">  <i class="icon-search icon-white"></i> </a></td></tr></table>' +
			'</div>' + 
			
			'<div class="chatroom_search_table" id="chatroom_search_table_div" style="overflow-y: auto; position: absolute; left: 15px; right: 20px; top:100px; bottom: 20px; background: white;">' +
			'<table width=100% cellpadding="3" cellspacing="3" id="chatroom-search-table">' +
			'</table>' + 
			'</div>' +	
			
			'</div>' +
			
			//'</td></tr></table>' +
			'</div>' +
			'</div>'
			
			
			)
		.appendTo($( "body" ));
	
	
	$('#roomdeletebutton').click(
		function() {
			removeChatroom();
		}
	);
	
	
	
	$('#chatroom_search_textbox').keypress(function(e)
	{
		// 13 is enter key
		if (e.which == 13){
			log('pressed enter.');
			searchterm = $('#chatroom_search_textbox').val();
			$('#chatroom_search_textbox').val('');	// clear the search box
			$('#chatroom-search-table tr').remove();	// clear the table
				
			//var roomjid = $("#chatroom_management_selector").val();
			roomjid = $('#curr_selected_room').html();
			fillRoomSearchBox(searchterm, roomjid);
		}
	});

	
	
	
	
	
	
	$("#room_management_dialog").dialog({
		autoOpen: true,
		closeOnEscape: true,
		resizable: true,
		minHeight: 300,
		minWidth: 400,
		height: 350,
		width: 450
	});
	
	$("#room_management_dialog").parent().css({'position': 'absolute'});
	
	
	
    
    
    
	$('.room_selection_item').remove();
	$('#room_management_dialog').dialog('open');
	
	for (chatroomname in instance_chatrooms) {
		
			var listitem = '<li class="room_selection_item" onclick="change_selected_room(\'' + chatroomname + '\')"><a>' + chatroomname + '</a></li>';
		$('#list_of_rooms').append(listitem);
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
			newrow = 	newrow + 
						'<td>' + '<button disabled="disabled" type="button"> Member </button>' + '</td>' + 
						'</tr>';
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
	

	roomname = $('#curr_selected_room').html();
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
	
	$('#room_creation_error_msg').remove();
	// check if jid for chatroom already exists
	if(isLegalRoomName(roomname) == false) {
		newrow = '<tr id="room_creation_error_msg"><td colspan="2" style="text-align: center; color: red;"> Room names may only contain alphanumeric characters and spaces. </td></tr>';
		$('#room_creation_table').append(newrow);
		return;
	}

	if(jQuery.trim(roomname).length <= 0) {
		newrow = '<tr id="room_creation_error_msg"><td colspan="2" style="text-align: center; color: red;"> Please enter a room name. </td></tr>';
		$('#room_creation_table').append(newrow);
		return;
	}

	
	// replacing spaces with dots for jid
	var roomjid = roomname.replace(/ /g,"_");
	
	 
	
	// post to database with jid, privacy, room duration, name
	$.getJSON('/room/create/', {name: roomname, jid: roomjid, room_private: room_private_val, persistent: room_persistent}, 
	
		function(data) {
			//data = jQuery.parseJSON(data);
			
			if (data.name_conflict == true) {
				newrow = '<tr id="room_creation_error_msg"><td colspan="2" style="text-align: center; color: red;"> Room already exists. Select a new name. </td></tr>';
				$('#room_creation_table').append(newrow);
			}
			else {
				newrow = '<tr id="room_creation_error_msg"><td colspan="2" style="text-align: center; color: green;"> Room successfully created! </td></tr>';
				$('#room_creation_table').append(newrow);
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
	//log('adding a room ' + roomjid + ' to my buddy list.');

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


	
	roomjid = $('#curr_selected_room').html();
	
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
