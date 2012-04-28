
var instance_friends = {};


function InitializeFriendsVariable(data) {

	var mydata = jQuery.parseJSON(data);

	for(var i = 0; i < mydata.length; i++) {
		
		var netID = mydata[i].username;
		var new_friend = {};
		new_friend.FirstName = "testFirstName";
		new_friend.LastName = "testLastName";
		new_friend.status = "offline";
		instance_friends[netID] = new_friend;
	
	}
	
	
	
	populateFriendsList(mydata);
}




// Show the friends list in the UI
function populateFriendsList(data) {
	
	$(" <div />" ).attr("id", "friends_dialog")
	.attr("title", "Buddy List")
	.html('<div class = "friends_list" id = "my_friends_list" style="height: 100%; margin: auto; position: relative; background-color:#F2F2F2; border-radius: 0px 0px 0px 12px;">' + 
	
	'<div class = "friends_header" id = "my_friends_header" style="height: 32px; padding-left: 5px; padding-top: 5px;">' + 
	'<input type="button" onclick="openSearchBox()" value="Search"> ' + 
	'</div>' + 
	
	'<div class = "friends_searchbox" id = "my_friends_searchbox" style="height: 32px; text-align: center; padding-left: 5px; padding-right: 11px;">' + 
	'<input type="text" id="friends_search" class="friends_search" style="width: 100%; border-radius: 0px">' +
	'</div>' + 
	
	'<div class = "friends_table" id = "my_friends_table" style="overflow-y: auto; position: absolute; left: 7px; right: 5px; top:70px; bottom: 20px; background: white;">' +
	'<table width="100%" cellpadding="0" cellspacing="0" id="friend-table">' +
	//'<tr friendname= "' + 'g' + '">' +
	//	'<td style="width: 20px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Kashyap Rajagopal' + '</td>' + '</tr>' + 
	//'<tr friendname= "' + 'h' + '">' +
	//	'<td style="width: 20px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Eric Lee' + '</td>' + '</tr>' + 
	//'<tr friendname= "' + 'i' + '">' +
	//	'<td style="width: 20px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Pat Wu' + '</td>' + '</tr>' + 
	//'<tr friendname= "' + 'j' + '">' +
	//	'<td style="width: 20px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Aaron Glasserman' + '</td>' + '</tr>' + 
	'</div>' +
	'</table>' + 
	
	
	'<div id="padding"></div>')
	.appendTo($( "body" ));
	
	
	// Sort the list of friends
	var sorted_list_online = [];
	var sorted_list_offline = [];
	for(friend_netid in instance_friends) {
		if(instance_friends.hasOwnProperty(friend_netid)){
			if(instance_friends[friend_netid].status == "online") {
				sorted_list_online.push(friend_netid);
			}
			else {
				sorted_list_offline.push(friend_netid);
			}
        }
	}
    sorted_list_offline.sort();
	sorted_list_online.sort();
	
	
		$("#friend-table").append(newrow);
	
	// Add my online friends to the buddy list
	for(var i = 0; i < sorted_list_online.length; i++) {
		friend_netid = sorted_list_online[i];
		var status = instance_friends[friend_netid].status;
		if(status == "online") var imgurl = "/static/imgs/online.png";
		else if(status == "offline") var imgurl = "/static/imgs/offline.png";
		else var imgurl = "/static/imgs/princeton.png";
		
		var newrow = '<tr friendname= "' + friend_netid + '">' +
			'<td style="width: 15px;"></td> <td style="width: 20px;"> <img src="' + imgurl + '" width="14" height="14" style="" />  </td> ' + '<td>' + friend_netid + '</td>' + '</tr>';	
		$("#friend-table").append(newrow);
	}
	
	// Row for expanding/collapsing offline buddies
	var arrow_img = "/static/imgs/RightTriangle.png";
	var newrow = '<tr friendname= "offline_collapse" status="open">' +
			'<td style="width: 15px;" onclick="handle_offline_friends()"><img src="' + arrow_img + '" width="12" height="12" style="" /> </td>' + '<td colspan="2"> Offline </td>' + '</tr>';
		$("#friend-table").append(newrow);
	
	// Add my offline friends to the buddy list
	for(var i = 0; i < sorted_list_offline.length; i++) {
		friend_netid = sorted_list_offline[i];
		var status = instance_friends[friend_netid].status;
		if(status == "online") var imgurl = "/static/imgs/online.png";
		else if(status == "offline") var imgurl = "/static/imgs/offline.png";
		else var imgurl = "/static/imgs/princeton.png";
		
		var newrow = '<tr friendname= "' + friend_netid + '">' +
			'<td style="width: 15px;"></td> <td style="width: 20px;"> <img src="' + imgurl + '" width="14" height="14" style="" />  </td> ' + '<td>' + friend_netid + '</td>' + '</tr>';
	
		$("#friend-table").append(newrow);
	}
	
	
	
	
	
	 //$('#friend-table td:first-child').hide();
	
	// Highlight function
	 $('#friend-table tr').hover(function ()
      {
        $(this).toggleClass('Highlight');
      });
	
	// Click Function
	 $('#friend-table tr').click(function ()
      {
		  makeNewChatbox($(this).attr("friendname"));
      });
	
	$("#friends_dialog").dialog({
		position: 'right',
        autoOpen: true,
        resizable: true,
		closeOnEscape: false
    });

    
    
    
    // set height
    $("#friends_dialog").css({'height' : '250'});
	
}

function handle_offline_friends() {
	log('In fcn!');
}


function updateBuddyListStatus(sender, status) {

	// return if we're trying to update ourself
	if(sender == my_user_name) return;
	
	// set the appropriate image
	if(status == "online") var imgurl = '/static/imgs/online.png';
	else if(status == "offline") var imgurl = '/static/imgs/offline.png';
	else var imgurl = '/static/imgs/princeton.png';
	
	// edit the row
	$('#friend-table tr[friendname~="' + sender + '"]').replaceWith('<tr friendname= "' + sender + '">' +
																'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="' + 
																imgurl + 
																'" width="14" height="14" style="" />  </td> ' + 
																'<td>' + sender + '</td>');

	$('#friend-table tr[friendname~="' + sender + '"]').hover(function ()
      {
        $(this).toggleClass('Highlight');
      });
    
    $('#friend-table tr[friendname~="' + sender + '"]').click(function ()
      {
		  makeNewChatbox($(this).attr("friendname"));
      });
     

}


function addToBuddyList(friend_netid) {
	
	
	var status = instance_friends[friend_netid].status;
	if(status == "online") var imgurl = "/static/imgs/online.png";
	else if(status == "offline") var imgurl = "/static/imgs/offline.png";
	else var imgurl = "/static/imgs/princeton.png";
	
	var newrow = '<tr friendname= "' + friend_netid + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="' + imgurl + '" width="14" height="14" style="" />  </td> ' + '<td>' + friend_netid + '</td>' + '</tr>';
	
	$("#friend-table").append(newrow);
		
	$('#friend-table tr').hover(function ()
      {
        $(this).toggleClass('Highlight');
      });
	
	// Click Function
	 $('#friend-table tr').click(function ()
      {
		  makeNewChatbox($(this).attr("friendname"));
      });
      
}








