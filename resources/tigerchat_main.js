

function testFunction() {
	
	updateBuddyListStatus('naacho', 'online')
	
}



function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}


function fillSearchBox(data) {
		
	
	var newdata = jQuery.parseJSON(data);
	
	$('#search-table tr').remove();
		 
	for(var i = 0; i < newdata.length; i++) {
		if(typeof newdata[i].class === "undefined") var classyear = '';
		else var classyear = newdata[i].class;
		
		var username = newdata[i].username;
		
		// If we are already friends, or we have already requested, then we need to remove the ADD FRIEND button
		if(instance_friends[username] != undefined) {
			var newrow = '<tr friendname= "' + newdata[i].username + '">' +
			'<td>' + newdata[i].first_name + ' ' + newdata[i].last_name + '</td>' +
			'<td>' + classyear + '</td>' +
			'<td>' + '<button disabled="disabled" type="button"> Added </button>' + '</td>' + 
			'</tr>';
		}
		
		// Otherwise, create buttons as usual
		else {
			var newrow = '<tr friendname= "' + newdata[i].username + '">' +
			'<td>' + newdata[i].first_name + ' ' + newdata[i].last_name + '</td>' +
			'<td>' + classyear + '</td>' +
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
	
	
	$.get("/requests/",
				function(data){
				repopulate_pending_requests(data);
			});
}


function RejectFriend(newfriendname) {
	rejectRequest(connection, my_user_name, newfriendname);
}



