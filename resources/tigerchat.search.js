
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
		$('#search_dialog').dialog('close');
		$('#search_dialog').dialog('open');    
		return;
	}
	
	// Otherwise, create the dialog box
	$(" <div />" ).attr("id", "search_dialog")
	.attr("title", "Add Buddy")
	.html(	'<div class = "search_box" id="my_search_box" style="height: 100%; margin: auto; position: relative; background-color:white; border-radius: 0px 0px 8px 8px;">' +
			
			'<div class="search_toptext" id="my_search_toptext"> ' +
			'<table width="100%" cellpadding="10" cellspacing="10" id="search_toptext_table">' + 
			'<tr> <td width="50px"> <img src="/static/imgs/rsz_picture3.png"/> </td> <td> Enter a friend\'s name in the search box below.  </td> </tr> </table>' +
			'</div>' +
			
			'<div class="search_text" id="my_search_text" style="height: 32px; text-align: center; padding-left: 18px; padding-right: 40px; padding-top: 5px;" >' +
			'<table style="width:100%;"> <tr> <td> ' +
			'<input type="text" id="search_textbox" style="width: 100%; border-radius: 0px"> </td>' + 
				'<td style="width: 30px;"><a id="searchbutton" class="btn btn-primary" style="width: 100%;">  <i class="icon-search icon-white"></i> </a></td></tr></table>' +
			'</div>' + 
			
			'<div class="search_table" id="my_search_table" style="overflow-y: auto; position: absolute; left: 15px; right: 20px; top:100px; bottom: 20px; background: white;">' +
			'<table width="100%" cellpadding="3" cellspacing="3" id="search-table">' +
			'</table>' + 
			'</div>' +	
			'</div>' +
			
			'</div>')
	.appendTo($( "body" ));	
	
	$('#searchbutton').click(
		function() {
			searchterm = $('#search_textbox').val();
			$('#search_textbox').val('');	// clear the search box
			$('#search-table tr').remove();	// clear the table
			populateSearchBox(searchterm);
		}
	);
	
	
	
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
        resizable: true,
        minHeight: 200,
        minWidth: 300,
        height: 250,
        width: 310
    });
    
	$("#search_dialog").parent().css({'position' : 'fixed'});
    
    // Set the height of the dialog
    //$("#search_dialog").parent().css({'height' : '250'});
    //$("#search_dialog").parent().css({'width' : '310'});
    //$("#search_dialog").css({'height' : '250'});
    //$("#search_dialog").css({'width' : '310'});
}

/************************************************************************
 * Populate the search box with a given $searchterm.  This
 * calls /search/,
 * ADD LOADING ... HERE (#fix)
 ***********************************************************************/
function populateSearchBox(searchterm) {
	
	var newrow = '<tr ><td id="loading_dots_text" style="text-align: right;" width="60%"></td><td id="loading_dots" style="text-align:left;"></td></tr>';
	$('#search-table').append(newrow);	
	
	dots_id = setInterval(animateDots, 500);

	
	
	
	$.get("/search/", {query: searchterm},
		function(data){

			clearInterval(dots_id);
			fillSearchBox(data);
		}
   );	
}


function animateDots() {
	var dotvals = $('#loading_dots').html();
	numdots = dotvals.length;
	if(numdots == 0) {
		$('#loading_dots_text').append('Loading Results');
		$('#loading_dots').append('.');
		return;
	}
	if(numdots < 3) $('#loading_dots').append('.');
	else $('#loading_dots').html('.');
	
	
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
		 
		 
	if(newdata.length == 0) {
		var newrow = '<tr ><td style="text-align: center;" > No results found. </td> </tr>';
		$('#search-table').append(newrow);		
	}
	// For each result
	for(var i = 0; i < newdata.length; i++) {
		
		//Check the class year
		if(typeof newdata[i].class === "undefined") var classyear = '';
		else var classyear = newdata[i].class;
		
		// Get the username (jid)
		var username = newdata[i].username;
		
		if (username == my_user_name) continue;
		
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
		
		
		// If we have received a friend request from them, have an "accept" button
		else if(newdata[i].friendship_status == 'To_Accept') {
			newrow = 	newrow + 
						'<td>' + '<input type="button" value="Accept" onclick="addReceivedFriend(\'' + newdata[i].username + '\')"/>' + '</td>' + 
						'</tr>';

		}
		
		// If we have received a friend request from them, have a disabled "accept" button
		else if(newdata[i].friendship_status == 'Invited') {
			newrow = 	newrow + 
						'<td>' + '<button disabled="disabled" type="button"> Invited </button>' + '</td>' + 
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
	
	
	$(" <div />" ).attr("id",'confirm_invitation')
	.attr("title", 'Confirm Invitation')
	.html(
		'<div id="myconfirmationinvitation">' + 
		'<table width=100%> <tr style="text-align: center;"><td colspan="2" style="height: 50px;">' +
		'Do you want to send an invitation email? </td></tr>' +
		'<tr style="text-align: center;">' +
		'<td style="width: 100px;"> <a id="sendInvitebutton" class="btn btn-success" style="width: 60px;">  <i class="icon-ok icon-white"></i></a> </td>' +
		'<td style="width: 100px"> <a id="nosendInvitebutton" class="btn btn-danger" style="width: 60px;">  <i class="icon-remove icon-white"></i></a></td> ' +
		'</tr></table></div>'
		
	)
	.appendTo($( "#boxes" ));

	$('#sendInvitebutton').click(
		function() {
			invite(newfriendname);
			$('#confirm_invitation').dialog('destroy').remove()
		}
	);
	$('#nosendInvitebutton').click(
		function() {
			$('#confirm_invitation').dialog('destroy').remove()
		}
	);
	
	$('#confirm_invitation').dialog( {
        autoOpen: true,
        modal: true
    });
}

function invite(newfriendname) {
	$.get("/addfriend/", {jid: newfriendname} );
	
	// change search table row to "invited"
	$('#search-table tr[friendname="' + newfriendname + '"] td:eq(2)').replaceWith('<td>' + '<button disabled="disabled" type="button"> Invite Sent </button>' + '</td>');

}

