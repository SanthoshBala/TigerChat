
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
			
			'<div class="selector_text" id="my_selector_text" style="height: 32px; text-align: center; padding-left: 5px; padding-right: 11px; padding-top: 5px;" >' +
			'<select id="chatroom_management_selector"></select>' + 
			'</div>' + 
			
			'<div class="search_text" id="my_search_text" style="height: 32px; text-align: center; padding-left: 5px; padding-right: 11px; padding-top: 5px;" >' +
		
			'<input type="text" id="chatroom_search_textbox" style="width: 100%; border-radius: 0px">' +
			'</div>' + 
			
			'<div class="chatroom_search_table" id="chatroom_search_table" style="overflow-y: auto; position: absolute; left: 7px; right: 5px; top:65px; bottom: 20px; background: white;">' +
			'<table width="100%" cellpadding="0" cellspacing="0" id="chatroom-search-table">' +
			'</table>' + 
			'</div>' +	
			
			'</div>')
		.appendTo($( "body" ));
	
	$('#chatroom_search_textbox').keypress(function(e)
	{
		// 13 is enter key
		if (e.which == 13){
			searchterm = $('#chatroom_search_textbox').val();
			$('#chatroom_search_textbox').val('');	// clear the search box
			$('#chatroom-search-table tr').remove();	// clear the table
			fillRoomSearchBox(searchterm);
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

function fillRoomSearchBox(searchterm) {
	
	$.get("/search/", {query: searchterm},
	function(data){
	   populateRoomSearchBox(data);
	});
}


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
		
		if(newdata[i].friendship_status == 'DNE') {
			//check whether we have added the friend already
			newrow = newrow + 
			'<td>' + '<input type="button" value="sendEmail" onclick="sendInvite(\'' + newdata[i].username + '\')"/>' + '</td>' + 
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
	
	// Ask to add 
	//$('#search-table tr').click(function ()
     // {
	//	  addNewFriend($(this).attr("friendname"));
     // });
    
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
