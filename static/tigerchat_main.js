
function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function testhref() {
	log('href test!');
}


function addFriend() {

	sendRequest(connection,  my_user_name, 'p6');
	
}


function fillSearchBox(data) {
		
	//alert(data);
	var newdata = jQuery.parseJSON(data);
	//alert(newdata.length);
		//alert("data = " + data.length);
		 $('#search-table tr').remove();
	for(var i = 0; i < newdata.length; i++) {
		if(typeof newdata[i].class === "undefined") var classyear = '';
		else var classyear = newdata[i].class;

		var newrow = '<tr friendname= "' + newdata[i].username + '">' +
		'<td>' + newdata[i].first_name + ' ' + newdata[i].last_name + '</td>' +
		'<td>' + classyear + '</td>' +
		'<td>' + '<input type="button" value="Add" onclick="addNewFriend(\'' + newdata[i].username + '\')"/>' + '</td>' + 
		'</tr>';
		$("#search-table").append(newrow);
	
	}
	
	// Ask to add 
	//$('#search-table tr').click(function ()
     // {
	//	  addNewFriend($(this).attr("friendname"));
     // });
    
}

function populateSearchBox(searchterm) {
	//var searchterm = "ramasub";
	
	$.get("/search/", {query: searchterm},
   function(data){
	   fillSearchBox(data);
   });
	
}

function openSearchBox() {

	if ($("#search_dialog").length > 0) {
		 $('#search-table tr').remove();
		 $('#search_dialog').dialog('open');
		return;
	}
	$(" <div />" ).attr("id", "search_dialog")
	.attr("title", "Add Friend")
	.html('<div class = "search_box" id="my_search_box" style="height: 100%; margin: auto; position: relative; background-color:white; border-radius: 0px 0px 0px 12px;">' +
			
			'<div class="search_text" id="my_search_text" style="height: 32px; text-align: center; padding-left: 5px; padding-right: 11px; padding-top: 5px;" >' +
			'<input type="text" id="search_textbox" style="width: 100%; border-radius: 0px">' +
			'</div>' + 
			
			'<div class="search_table" id="my_search_table" style="overflow-y: auto; position: absolute; left: 7px; right: 5px; top:32px; bottom: 20px; background: white;">' +
			'<table width="100%" cellpadding="0" cellspacing="0" id="search-table">' +
			'</table>' + 
			'</div>' +	
			
			'</div>')
	.appendTo($( "body" ));	
	
	$('#search_textbox').keypress(function(e)
	{
         if (e.which == 13) //e = 13 is enter
         {
			 searchterm = $('#search_textbox').val();
				$('#search_textbox').val('');
			 populateSearchBox(searchterm);
		 }
	});
	
	$("#search_dialog").dialog({
        autoOpen: true,
        closeOnEscape: true,
        resizable: true
    });
    $("#search_dialog").css({'height' : '200'});
}



// Show the friends list in the UI
function populateFriendsList(data) {
	
	$(" <div />" ).attr("id", "friends_dialog")
	.attr("title", "Buddy List")
	.html('<div class = "friends_list" id = "my_friends_list" style="height: 100%; margin: auto; position: relative; background-color:#EEEEEE; border-radius: 0px 0px 0px 12px;">' + 
	
	'<div class = "friends_header" id = "my_friends_header" style="height: 32px; padding-left: 5px; padding-top: 5px;">' + 
	'<input type="button" onclick="openSearchBox()" value="Search"> ' + 
	'</div>' + 
	
	'<div class = "friends_searchbox" id = "my_friends_searchbox" style="height: 32px; text-align: center; padding-left: 5px; padding-right: 11px;">' + 
	'<input type="text" id="friends_search" class="friends_search" style="width: 100%; border-radius: 0px">' +
	'</div>' + 
	
	'<div class = "friends_table" id = "my_friends_table" style="overflow-y: auto; position: absolute; left: 7px; right: 5px; top:70px; bottom: 20px; background: white;">' +
	'<table width="100%" cellpadding="0" cellspacing="0" id="friend-table">' +
	'<tr friendname= "' + 'a' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Rohan Bansal' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'b' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Santhosh Balasubranium' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'c' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Vyas Ramasubramani' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'd' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Matt Dolan' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'e' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Chiraag Galaiya' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'f' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Adam Kravietz' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'g' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Kashyap Rajagopal' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'h' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Eric Lee' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'i' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Pat Wu' + '</td>' + '</tr>' + 
	'<tr friendname= "' + 'j' + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + 'Aaron Glasserman' + '</td>' + '</tr>' + 
	'</div>' +
	'</table>' + 
	
	
	'<div id="padding"></div>')
	.appendTo($( "body" ));
	
	
	
	for(var i = 0; i < data.length; i++) {
	
		var newrow = '<tr friendname= "' + data[i].username + '">' +
		'<td style="width: 2px;"></td> <td style="width: 20px;"> <img src="/static/imgs/online.png" width="14" height="14" style="" />  </td> ' + '<td>' + data[i].username + '</td>' + '</tr>';
	
		$("#friend-table").append(newrow);
	
	}
	
	 //$('#friend-table td:first-child').hide();
	 
	 $('#friend-table tr').hover(function ()
      {
        $(this).toggleClass('Highlight');
      });
	
	 $('#friend-table tr').click(function ()
      {
		  makeNewChatbox($(this).attr("friendname"));
      });
	
	$("#friends_dialog").dialog({
		position: 'right',
        autoOpen: true,
        closeOnEscape: true,
        resizable: true
    });
    $("#friends_dialog").css({'height' : '250'});
	
  

}

// Send the GET request to get the json friends data
function getFriendsList() {
	$.get("/friends/",
	function(data) {
		populateFriendsList(data);
	}, "json");
}




function testJson() {
	log('hello!');
	var myjid = connection.getBAREJIDFROMJID()
	$.get("/users/", { regex: "test"},
   function(data){
		alert("Data length: " + data.length);
		for(var i = 0; i < data.length; i++)
		log('First one: ' + data[i].username);
	}, "json");

}




function repopulate_pending_requests(data) {

	
	data = jQuery.parseJSON(data);
	
	
	// clear pending
	$('#pending-table tr').remove();
	
	for(var i = 0; i < data.length; i++) {
		var newrow = '<tr pendingname= "' + data[i].creator + '">' +
		'<td>' + data[i].creator + '</td>' +
		'<td>' +  "<input type='button' value='Accept' onclick='addReceivedFriend(\"" + data[i].creator + "\")'/>" + '</td>' +
		'<td>' +  "<input type='button' value='Reject' onclick='RejectFriend(\"" + data[i].creator + "\")'/>" + '</td>' +
		'</tr>';
		$("#pending-table").append(newrow);
	
	}
	
	// populate pending
	$('#subscribe_dialog').dialog('open');	
	
	// Open dialog
	
	
	
}








function addNewFriend(newfriendname) {

	$.get("/addfriend/", {jid: newfriendname} );
	sendRequest(connection, my_user_name, newfriendname);
	
}

function addReceivedFriend(newfriendname) {
	// Add to database
	log('hello');
	log(newfriendname);
	$.get("/addfriend/", {jid: newfriendname} );
	
	// send a subscribed
	acceptRequest(connection, my_user_name, newfriendname);
	// send a subscribe
	sendRequest(connection, my_user_name, newfriendname);
	
}


function RejectFriend(newfriendname) {
	rejectRequest(connection, my_user_name, newfriendname);
}



