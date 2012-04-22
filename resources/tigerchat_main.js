
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
		var newrow = '<tr friendname= "' + newdata[i].username + '">' +
		'<td>' + newdata[i].username + '</td>' +
		'</tr>';
		$("#search-table").append(newrow);
	
	}
	
	// Ask to add 
	$('#search-table tr').click(function ()
      {
		  addNewFriend($(this).attr("friendname"));
      });
    
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
	.attr("title", "Search")
	.html('<div class = "search_box" id="my_search_box">' + 
			'<table width="100%" cellpadding="0" cellspacing="0" id="search-table">' +
			'<input type="text" id="search_textbox">' +
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
}



// Show the friends list in the UI
function populateFriendsList(data) {
	
	$(" <div />" ).attr("id", "friends_dialog")
	.attr("title", "Friends")
	.html('<div class = "friends_table" id = "my_friends_table">' +
	'<input type="button" onclick="openSearchBox()" value="Search"> ' + 
	'<table width="100%" cellpadding="0" cellspacing="0" id="friend-table">' +
	'</div>')
	.appendTo($( "body" ));
	
	
	
	for(var i = 0; i < data.length; i++) {
	
		var newrow = '<tr friendname= "' + data[i].username + '">' +
		'<td><a href="javascript:testhref();">http://www.microsoft.com/</a></td>' +
		'<td>' + data[i].username + '</td>' +
		'</tr>';
		$("#friend-table").append(newrow);
	
	}
	
	 $('#friend-table td:first-child').hide();
	 
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



