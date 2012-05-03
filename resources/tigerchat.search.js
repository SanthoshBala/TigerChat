
/************************************************************************
 * Open the search box.  If it hasn't been created, this function
 * creates it.  If it has been created, it simply opens it.  It does
 * not fill the search box itself.
 ***********************************************************************/
function openSearchBox() {
	
	// If the search dialog has already been created, then just open it
	if ($("#search_dialog").length > 0) {
		// Clear lines from the table
		$('#search-table tr').remove();
		$('#search_dialog').dialog('open');
		return;
	}
	
	// Otherwise, create the dialog box
	$(" <div />" ).attr("id", "search_dialog")
	.attr("title", "Add Friend")
	.html(	'<div class = "search_box" id="my_search_box" style="height: 100%; margin: auto; position: relative; background-color:white; border-radius: 0px 0px 0px 12px;">' +
			
			'<div class="search_text" id="my_search_text" style="height: 32px; text-align: center; padding-left: 5px; padding-right: 11px; padding-top: 5px;" >' +
			'<input type="text" id="search_textbox" style="width: 100%; border-radius: 0px">' +
			'</div>' + 
			
			'<div class="search_table" id="my_search_table" style="overflow-y: auto; position: absolute; left: 7px; right: 5px; top:32px; bottom: 20px; background: white;">' +
			'<table width="100%" cellpadding="0" cellspacing="0" id="search-table">' +
			'</table>' + 
			'</div>' +	
			
			'</div>')
	.appendTo($( "body" ));	
	
	// Assign enter keypress for the searchbox
	$('#search_textbox').keypress(function(e)
	{
		// 13 is enter key
		if (e.which == 13){
			searchterm = $('#search_textbox').val();
			$('#search_textbox').val('');	// clear the search box
			$('#search-table tr').remove();	// clear the table
			populateSearchBox(searchterm);
		}
	});
	
	// Create the dialog
	$("#search_dialog").dialog({
        autoOpen: true,
        closeOnEscape: true,
        resizable: true
    });
    
    // Set the height of the dialog
    $("#search_dialog").css({'height' : '200'});    
}

/************************************************************************
 * Populate the search box with a given $searchterm.  This
 * calls /search/,
 * ADD LOADING ... HERE (#fix)
 ***********************************************************************/
function populateSearchBox(searchterm) {
	$.get("/search/", {query: searchterm},
		function(data){
			fillSearchBox(data);
		}
   );	
}


/************************************************************************
 * Fill the Search Box dialog with data.  The passed in $data is from
 * a get request to '/search/'.
 ***********************************************************************/
function fillSearchBox(data) {
	
	// Parse data into JSON
	var newdata = jQuery.parseJSON(data);
	
	// Clear the search table rows
	$('#search-table tr').remove();
		 
	// For each result
	for(var i = 0; i < newdata.length; i++) {
		
		//Check the class year
		if(typeof newdata[i].class === "undefined") var classyear = '';
		else var classyear = newdata[i].class;
		
		// Get the username (jid)
		var username = newdata[i].username;
		
		// Create a row in the table
		var newrow = 	'<tr friendname= "' + newdata[i].username + '">' +
						'<td>' + newdata[i].first_name + ' ' + newdata[i].last_name + '</td>' +
						'<td>' + classyear + '</td>';
		
		// If we are already friends, have a disabled "confirmed" button
		if(newdata[i].friendship_status == 'Confirmed') {
			newrow = 	newrow + 
						'<td>' + '<button disabled="disabled" type="button"> Friends </button>' + '</td>' + 
						'</tr>';
		}
		
		// If we have already added the friend, have a disabled "pending" button
		else if(newdata[i].friendship_status == 'Pending') {
			newrow = 	newrow + 
						'<td>' + '<button disabled="disabled" type="button"> Added </button>' + '</td>' + 
						'</tr>';
		}
		
		
		// If we have received a friend request from them, have a disabled "accept" button
		// WE NEED TO UPDATE THIS TO ALLOW AN ACCEPTANCE FROM HERE (#fix)
		else if(newdata[i].friendship_status == 'To_Accept') {
			newrow = 	newrow + 
						'<td>' + '<button disabled="disabled" type="button"> Accept </button>' + '</td>' + 
						'</tr>';
		}
		
		// If friend does not exist in our database, send an email invite
		else if(newdata[i].friendship_status == 'DNE') {
			newrow = 	newrow + 
						'<td>' + '<input type="button" value="Invite" onclick="sendInvite(\'' + newdata[i].username + '\')"/>' + '</td>' + 
						'</tr>';
		}
		
		
		// Otherwise, create buttons as usual
		else {
			newrow = 	newrow +
						'<td>' + '<input type="button" value="Add" onclick="addNewFriend(\'' + newdata[i].username + '\')"/>' + '</td>' + 
						'</tr>';
		}
		
		// Append to search table
		$("#search-table").append(newrow);
	
	}
}


/************************************************************************
 * Send a friend request to $newfriendname.
 ***********************************************************************/
function addNewFriend(newfriendname) {

	$.get("/addfriend/", {jid: newfriendname} );
	sendRequest(connection, my_user_name, newfriendname);
	
	// replace the button with "Added"
	$('#search-table tr[friendname="' + newfriendname + '"] td:eq(2)').replaceWith('<td>' + '<button disabled="disabled" type="button"> Added </button>' + '</td>');
}



/************************************************************************
 * Send an email invitation to $newfriendname.
 * SHOULD NOT BE ABLE TO SEND MULTIPLE INVITES (#fix)
 ***********************************************************************/
function sendInvite(newfriendname) {
	// post to /addfriend/ where database takes care of sending invite
	$.get("/addfriend/", {jid: newfriendname} );
	
	// change search table row to "invited"
	$('#search-table tr[friendname="' + newfriendname + '"] td:eq(2)').replaceWith('<td>' + '<button disabled="disabled" type="button"> Invite Sent </button>' + '</td>');
}



