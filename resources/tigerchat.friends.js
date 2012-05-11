

/************************************************************************
 *  Initialize the instance friends variable on load.
 ***********************************************************************/
function InitializeFriendsVariable(data) {

	var mydata = jQuery.parseJSON(data);
	
	// Add the data
	// #fix - 
	for(var i = 0; i < mydata.length; i++) {
		var netID = mydata[i].username;
		var new_friend = {};
		new_friend.FirstName = mydata[i].first_name; // #fix
		new_friend.LastName = mydata[i].last_name;  //#fix
		new_friend.status = "offline";
		instance_friends[netID] = new_friend;
	}
	
	// Initialize the chatrooms variable
	$.getJSON('/rooms/', function(data) {InitializeChatroomsVariable(data) });	
}


/************************************************************************
 *  Initialize the instance chatrooms after initializing friends.
 ***********************************************************************/
function InitializeChatroomsVariable(data) {

	//var mydata = jQuery.parseJSON(data);
	mydata = data;
	if(mydata.length == 0) {
		populateFriendsList();

	}
	
	for(var i = 0; i < mydata.length; i++) {
		
		var roomjid = mydata[i].room_jid;
		var new_room = {};
		new_room.occupants = new Array();
		new_room.name = mydata[i].room_name;
		
		new_room.admin = mydata[i].admin[0].jid;
		
		instance_chatrooms[roomjid] = new_room;
		
		// Populate the members of this room
		
		if(i != mydata.length - 1) {
			$.getJSON('/room/members/', {room_jid: roomjid}, 
				function(data) {
					var thisroomjid = data.room_jid;
					
					for(var j=0; j < data.members.length; j++) {
						var user_jid = data.members[j].jid;
						
						instance_chatrooms[thisroomjid].occupants[j] = user_jid;
					}
				}
			);
		}
		
		// If this is the last room to be initialized, then we need to populate the friends list after it
		else {
			$.getJSON('/room/members/', {room_jid: roomjid}, 
				function(data) {
					var thisroomjid = data.room_jid;
					
					for(var j=0; j < data.members.length; j++) {
						var user_jid = data.members[j].jid;
						instance_chatrooms[thisroomjid].occupants[j] = user_jid;
					}
					
					// We populate on the last call
					populateFriendsList();
				}
			);
		}
	}
	
	
	$.getJSON("/requests/",
			function(data){
				repopulate_pending_requests(data);
			}
	);
    
	
	
	
}

/************************************************************************
 *  Create the friends list initially.
 ***********************************************************************/
function populateFriendsList() {
	
	// Do not want to create multiple times
	if ($("#friends_dialog").length > 0) {
		$("#friends_dialog").dialog('close');
		$("#friends_dialog").dialog('open');
		
		var posx = $(window).width() - 250;
		var posy = 100;
		if($(window).height() < 800){
			
			 var friendheight = $(window).height() - 175;
		 }
		else var friendheight = 600;

			$('#friends_dialog').dialog("option", "position", [posx, posy]);
			$('#friends_dialog').dialog("option", "width", 220);
			$('#friends_dialog').dialog("option", "height", friendheight);
			
		
		
		return;
	}
	
	$(" <div />" ).attr("id", "friends_dialog")
	.attr("title", "Buddy List")
	.html('<div class = "friends_list" id = "my_friends_list" style="height: 100%; margin: auto; position: relative; background-color:#F2F2F2; border-radius: 8px 8px 8px 8px;">' + 
	
	'<div class = "friends_header" id = "my_friends_header" style="height: 42px; padding-left: 5px; padding-bottom: 1px; padding-top: 1px;">' + 
	'<table cellpadding="3" cellspacing="3" >' +
	'<tr>' + 

	'<td class="friends_button_td" width="25px" height="50px" style="text-align:center;padding: 0px 0px 6px 0px;">' +
	'<div><a id="ttip1" rel="tooltip" title="Add a Buddy"><img class="friends_button" src="/static/imgs/add_friend.png" style="height:27px; padding: 2px 5px 2px; border: 1px solid #F2F2F2;" onclick="openSearchBox()"></img></a></div>' +
	'</td>' + 
	/*'<td width="0px"></td>' +*/
	'<td class="friends_button_td" width="70px" height="50px" style="text-align:center; padding: 0px 0px 6px 0px;">' + 
	'<div id="roombutton" class="btn-group"><a class="dropdown-toggle" data-toggle="dropdown" style="box-shadow: none;"><b id="ttip2" rel="tooltip" title="Rooms"><img class="friends_button" src="/static/imgs/add_group.png" style="height:27px; padding: 2px 5px 2px; border: 1px solid #F2F2F2;"></img></b></a>' +
	
	' <ul class="dropdown-menu"><li><a style="cursor: pointer; text-align: left" onclick="openRoomCreation()">Create Room</a></li><li><a style="cursor: pointer; text-align: left" onclick="Manage_Chatrooms()">Manage Rooms</a></li></ul></div>' + 
	'</td>' + 
	/**/
	/*'<td width="0px"></td>' +*/
	'<td class="friends_button_td" width="50px" height="50px" id="pending_requests_img_div" style="text-align:center; padding: 0px 0px 6px 0px;">' + 
	'<div><a id="ttip3" rel="tooltip" title="Requests"><img id="pending_requests_img" class="friends_button" src="/static/imgs/pending_envelope.png" height=25px  onclick="open_pending_requests()" style="padding: 2px 5px 2px; position:relative; top:-3px; border: 1px solid #F2F2F2;"></a></img></div>' + 
	'</td>' + 
	/*'<td width="0px"></td>' +*/
	
	
	
	/*
	'<td>' +
	'<li class="dropdown" id="menu1">' +
	'<a class="dropdown-toggle" data-toggle="dropdown" href="#menu1">' +
	'Dropdown' +
	'<b class="caret"></b>' +
	'</a>' +
	'<ul class="dropdown-menu">' +
	'<li><a href="#">Action</a></li>' +
	'<li><a href="#">Another action</a></li>' +
	'<li><a href="#">Something else here</a></li>' +
	'<li class="divider"></li>' +
	'<li><a href="#">Separated link</a></li>' +
	'</ul>' +
	'</li>' +
	'</td>' +
	*/
	/*
	'<td class="dropdown" id="menu1">' +
	'<a class="dropdown-toggle" data-toggle="dropdown" href="#menu1">' +
	'hello' +
	'<b class="caret"></b>' +
	'</a>' +
	'<ul class="dropdown-menu">' +
	'<li><a href="#">action</a></li>' +
	'<li><a href="#">action2></a></li>' +
	'</ul>' +
	'</td>' +
	*/
	
	
	'</tr>' + 
	'</table>' +
	'</div>' + 
	
	'<div class = "friends_searchbox" id = "my_friends_searchbox" style="height: 32px; text-align: center; padding-left: 5px; padding-right: 15px;">' + 
	
		
	'<input type="text" id="friends_search" class="friends_search" style="border: none; width: 100%; border-radius: 0px; color: #BBBBBB; border: 1px solid #cccccc;" value="Filter friends..." />' + 
	
	
	'</div>' + 
	
	'<div class = "friends_table" id = "my_friends_table" style="overflow-y: auto; position: absolute; left: 5px; right: 5px; top:80px;  border: 1px solid #cccccc; bottom: 20px; background: white;">' +
	'<table width="100%" cellpadding="0" cellspacing="0" id="friend-table">' +
	'</div>' +
	'</table>' + 
	'<div id="padding"></div>')
	
	.appendTo($("body"));
	
	
	
	$('#ttip1').tooltip({
		'placement':'top',
		'delay': { 'show': 700, 'hide': 100 }
,	});
	$('#ttip2').tooltip({
		'placement':'top',
		'delay': { 'show': 700, 'hide': 100 }
	});
	$('#ttip3').tooltip({
		'placement':'top',
		'delay': { 'show': 700, 'hide': 100 }
	});
	
	
	
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
	
	
	
	// This SHOULD populate the table
	repopulateFriendsList();
	
	// Keypress function for search
	$('#friends_search').keyup(function(e) {
		repopulateFriendsList();
	});
	
	$('#friends_search').focus(
		function() {
			$('#friends_search').val('');
			$('#friends_search').css({'color': '#000000'});
			repopulateFriendsList();
		}
	);
	
	
	$('#friends_search').blur(
		function() {
			//$('#friends_search').css({'color': '#BBBBBB'});
			//$('#friends_search').val('Filter friends...');
			//repopulateFriendsList();
		}
	);


	var posx = $(window).width() - 250;
	var posy = 100;
	if($(window).height() < 800){
		
		 var friendheight = $(window).height() - 175;
	 }
	else var friendheight = 600;
	
	$("#friends_dialog").dialog({
		position: [posx, posy],
        autoOpen: true,
        resizable: true,
		closeOnEscape: false,
		height: friendheight,
		width: 220,
		minHeight: 300,
		minWidth: 150
    });
    
	$("#friends_dialog").parent().css({'position' : 'fixed'});
    // set height
    //$("#friends_dialog").css({'height' : '250'});
}


/************************************************************************
 *  repopulate the friends list, possibly after entering a search,
 *  or after updating instance variables.
 ***********************************************************************/
function repopulateFriendsList() {

	if ($("#friends_dialog").length <= 0) {
		populateFriendsList();
		return;
	}
	
	var filter_key = $('#friends_search').val();
	if(filter_key == 'Filter friends...') filter_key = '';
	// Sort the list of friends
	var sorted_list_online = [];
	var sorted_list_offline = [];
	var sorted_list_rooms = [];
	
	
	for(chatroom_name in instance_chatrooms) {
		// skip if doesnt match filter
		if ( chatroom_name.search(filter_key) == -1 ) {
			continue;
		}
		sorted_list_rooms.push(chatroom_name);	
	}
	
	for(friend_netid in instance_friends) {
		
		// skip if doesnt match filter
		if (  	(friend_netid.search(filter_key) == -1 ) &&  
				(instance_friends[friend_netid].FirstName.search(filter_key) == -1 ) && 
				(instance_friends[friend_netid].LastName.search(filter_key) == -1 ) ) {
			continue;
		}
		
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
	sorted_list_rooms.sort();
	
	
	// clear the list
	$('#friend-table tr').remove();	
	
	
	// Row for expanding/collapsing chatrooms
	var arrow_img = "/static/imgs/DownTriangle.png";
	var newrow = '<tr friendname = "NONE" id= "chatrooms_collapse" status="open">' +
			'<td style="width: 15px;" onclick="collapse_grouping(\'chatrooms\')"><img src="' + arrow_img + '" width="12" height="12" style="padding-left: 2px;" /> </td>' + '<td colspan="2"> Chatrooms </td>' + '</tr>';
		$("#friend-table").append(newrow);
		
	for(var i = 0; i < sorted_list_rooms.length; i++) {
		chatroom_name = sorted_list_rooms[i];
		var imgurl = "/static/imgs/princeton.png";
		var roomname = instance_chatrooms[chatroom_name].name;
		
		var newrow = '<tr friendname= "' + chatroom_name + '" grouping="chatrooms">' +
			'<td style="width: 15px;"></td> <td style="width: 20px;"> <img src="' + imgurl + '" width="14" height="14" style="" />  </td> ' + '<td>' + roomname + '</td>' + '</tr>';	
		$("#friend-table").append(newrow);
	}
	
	
	// Row for expanding/collapsing online buddies
	var arrow_img = "/static/imgs/DownTriangle.png";
	var newrow = '<tr friendname = "NONE" id= "online_collapse" status="open">' +
			'<td style="width: 15px;" onclick="collapse_grouping(\'online\')"><img src="' + arrow_img + '" width="12" height="12" style="padding-left: 2px;" /> </td>' + '<td colspan="2"> Online </td>' + '</tr>';
		$("#friend-table").append(newrow);
		
		
		
	// Add my online friends to the buddy list
	for(var i = 0; i < sorted_list_online.length; i++) {
		friend_netid = sorted_list_online[i];
		var status = instance_friends[friend_netid].status;
		var firstname = instance_friends[friend_netid].FirstName;
		var lastname = instance_friends[friend_netid].LastName;
		if(status == "online") var imgurl = "/static/imgs/bullet_ball_glass_green.png";
		else if(status == "offline") var imgurl = "/static/imgs/bullet_ball_glass_red.png";
		else var imgurl = "/static/imgs/princeton.png";
		
		var newrow = '<tr friendname= "' + friend_netid + '" grouping="online">' +
			'<td style="width: 15px;"></td> <td style="width: 20px;"> <img src="' + imgurl + '" width="14" height="14" style="" />  </td> ' + '<td>' + firstname + ' ' + lastname + '</td>' + '</tr>';	
		$("#friend-table").append(newrow);
	}
	
	
	
	// Row for expanding/collapsing offline buddies
	var arrow_img = "/static/imgs/DownTriangle.png";
	var newrow = '<tr friendname = "NONE" id= "offline_collapse" status="open">' +
			'<td style="width: 15px;" onclick="collapse_grouping(\'offline\')"><img src="' + arrow_img + '" width="12" height="12" style="padding-left: 2px" /> </td>' + '<td colspan="2"> Offline </td>' + '</tr>';
		$("#friend-table").append(newrow);
	
	// Add my offline friends to the buddy list
	for(var i = 0; i < sorted_list_offline.length; i++) {
		friend_netid = sorted_list_offline[i];
		var status = instance_friends[friend_netid].status;
		var firstname = instance_friends[friend_netid].FirstName;
		var lastname = instance_friends[friend_netid].LastName;
		if(status == "online") var imgurl = "/static/imgs/bullet_ball_glass_green.png";
		else if(status == "offline") var imgurl = "/static/imgs/bullet_ball_glass_red.png";
		else var imgurl = "/static/imgs/princeton.png";
		
		var newrow = '<tr friendname= "' + friend_netid + '" grouping="offline">' +
			'<td style="width: 15px;"></td> <td style="width: 20px;"> <img src="' + imgurl + '" width="14" height="14" style="" />  </td> ' + '<td>' + firstname + ' ' + lastname + '</td>' + '</tr>';
	
		$("#friend-table").append(newrow);
	}
	
	// Highlight function for friends
	$('#friend-table tr[friendname!="NONE"]').hover(
		function () {
			$(this).toggleClass('Highlight');
		}
	);
	
	// Click function for friends
	$('#friend-table tr[friendname!="NONE"]').click(
		function () {
			var newname = $(this).attr("friendname");
			if ($("#" + newname).length > 0) {
				// If it's open
				if ($('#' + new_name).dialog('isOpen') == true) {
					 $('#' + new_name).dialog('close');
					 $('#' + new_name).dialog('open');
				}
			}
			makeNewChatbox($(this).attr("friendname"));
		}
	);
	
}



/************************************************************************
 *  Collapses a given grouping
 ***********************************************************************/
function collapse_grouping(grouping) {
	var tr_name = grouping + "_collapse";

	// Get the status
	var status = $('#' + tr_name).attr('status');
	
	// Close or open appropriately
	if(status == 'open') {
		$('#friend-table tr[grouping="' + grouping + '"]').css({'display' : 'none'});
		var totalhtml = $('#' + tr_name).html();
		totalhtml = totalhtml.replace('DownTriangle', 'RightTriangle');
		$('#' + tr_name).html(totalhtml);
		$('#' + tr_name).attr('status', 'closed');
	}
	
	if(status == 'closed') {
		$('#friend-table tr[grouping="' + grouping + '"]').css({'display' : ''});
		var totalhtml = $('#' + tr_name).html();
		totalhtml = totalhtml.replace('RightTriangle', 'DownTriangle');
		$('#' + tr_name).html(totalhtml);
		$('#' + tr_name).attr('status', 'open');
	}	
}




/************************************************************************
 *  Updates a buddy's status.  This changes the instance variable,
 * as well as repopulating the friends list.
 ***********************************************************************/
function updateBuddyListStatus(sender, status) {
	// return if we're trying to update ourself
	if(sender == my_user_name) return;
	
	if(instance_friends[sender] != undefined) {
		instance_friends[sender].status = status;
	}
	repopulateFriendsList();
}


/************************************************************************
 *  This adds a buddy to our buddy list.
 ***********************************************************************/
function addToBuddyList(friend_netid) {
	
	var newfriend = {};
	$.getJSON('/vcard/', {jid: friend_netid}, 
		function(data) {
			
			//data = jQuery.parseJSON(data);
			
			newfriend.FirstName = data.first_name; // #fix
			newfriend.LastName = data.last_name; //#fix
			newfriend.status = "online"; //#fix - we assume the buddy is online
			instance_friends[friend_netid] = newfriend;
				 
			var status = instance_friends[friend_netid].status;
			if(status == "online") var imgurl = "/static/imgs/bullet_ball_glass_green.png";
			else if(status == "offline") var imgurl = "/static/imgs/bullet_ball_glass_red.png";
			else var imgurl = "/static/imgs/princeton.png"; //#fix - we should have a different default
			
			repopulateFriendsList();
		}
	);
	
	
	
      
}
