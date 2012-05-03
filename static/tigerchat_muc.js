
function openRoomCreation() {
	$('#room_creation_dialog').dialog('open');	
}


function PleaseInviteSanthosh() {


	invite_to_chatroom('santhosh', 'blah');
}

function PleaseInviteVyas() {


	invite_to_chatroom('vramasub', 'blah');
}



function TestRoomMembers() {

	for(roomjid in instance_chatrooms) {
	
		log(roomjid);
		for(var i = 0; i < instance_chatrooms[roomjid].occupants.length; i++) {
		
			log('participant: ');
			log(instance_chatrooms[roomjid].occupants[i]);
		}
	
	}
}




function create_chatroom() {

	log("creating a chatroom");
	var roomname = $('#chatroom_creation_name').val();
	var roomprivacy = $('#chatroom_creation_privacy').val();
	var roomduration = $('#chatroom_creation_duration').val();
	
	room_private_val = true;
	room_persistent = true;
	roomname = 'blah';
	
	log(roomname + ' ' + roomprivacy + ' ' + roomduration);
	var roomjid = roomname.replace(/ /g,".");
	log(roomjid);

	// check if jid for chatroom already exists
	
	// post to database with jid, privacy, room duration, name
	$.get('/room/create/', {name: roomname, jid: roomjid, room_private: room_private_val, persistent: room_persistent});
	
	// if returned "created = false" tell the user that they need to pick another name
	


}


function invite_to_chatroom(user, chatroom) {

	log('sending invite to ' + user);
	//check to confirm that I am capable of inviting to a room
	$.get('/room/invite/', {room_jid: chatroom, invitee_jid: user}); 
	sendChatroomInvite(user, chatroom);	
	// send a special message with type = chatroom_invite
	

}
