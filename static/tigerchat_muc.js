
function openRoomCreation() {
	$('#room_creation_dialog').dialog('open');	
}


function InviteSanthosh() {


	invite_to_chatroom('santhosh', 'blah');
}

function InviteVyas() {


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


/************************************************************************
 * Open the chatroom management dialog.
 * 
 ***********************************************************************/
function Manage_Chatrooms() {

	$('#room_management_dialog').dialog('open');	
	searchterm = 
	$.get("/search/", {query: searchterm},
	function(data){
	   fillRoomInvitationBox(data);
	});
}


function fillRoomInvitationBox(data) {
		
	
	var newdata = jQuery.parseJSON(data);
	
	$('#search-table tr').remove();
		 
	for(var i = 0; i < newdata.length; i++) {
		if(typeof newdata[i].class === "undefined") var classyear = '';
		else var classyear = newdata[i].class;
		
		var username = newdata[i].username;
		
		var newrow = '<tr friendname= "' + newdata[i].username + '">' +
			'<td>' + newdata[i].first_name + ' ' + newdata[i].last_name + '</td>' +
			'<td>' + classyear + '</td>';
		
		// If we are already friends, or we have already requested, then we need to remove the ADD FRIEND button
		if(newdata[i].friendship_status == 'Confirmed') {
			//check whether we have added the friend already
			newrow = newrow + 
			'<td>' + '<button disabled="disabled" type="button"> Friends </button>' + '</td>' + 
			'</tr>';
		}
		
		else if(newdata[i].friendship_status == 'Pending') {
			//check whether we have added the friend already
			newrow = newrow + 
			'<td>' + '<button disabled="disabled" type="button"> Added </button>' + '</td>' + 
			'</tr>';
		}
		
		else if(newdata[i].friendship_status == 'To_Accept') {
			//check whether we have added the friend already
			newrow = newrow + 
			'<td>' + '<button disabled="disabled" type="button"> Accept </button>' + '</td>' + 
			'</tr>';
		}
		
		else if(newdata[i].friendship_status == 'DNE') {
			//check whether we have added the friend already
			newrow = newrow + 
			'<td>' + '<input type="button" value="Invite" onclick="sendInvite(\'' + newdata[i].username + '\')"/>' + '</td>' + 
			'</tr>';
		}
		
		
		// Otherwise, create buttons as usual
		else {
			newrow = newrow +
			'<td>' + '<input type="button" value="Add" onclick="addNewFriend(\'' + newdata[i].username + '\')"/>' + '</td>' + 
			'</tr>';
		}
		
		
		$("#search-table").append(newrow);
	
	}
	
	// Ask to add 
	//$('#search-table tr').click(function ()
     // {
	//	  addNewFriend($(this).attr("friendname"));
     // });
    
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
	
	// replacing spaces with dots for jid
	var roomjid = roomname.replace(/ /g,".");
	
	 
	// check if jid for chatroom already exists
	
	// post to database with jid, privacy, room duration, name
	$.get('/room/create/', {name: roomname, jid: roomjid, room_private: room_private_val, persistent: room_persistent});
	
	// if returned "created = false" tell the user that they need to pick another name
	


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
