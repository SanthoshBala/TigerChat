var connection = null;
var chatBoxes = new Array();
var my_user_name;


function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}


function getTimeStamp(){
	//log('hello.');
	var currTime = new Date();
	//log(currTime.getHours());
	//log('bye');
	var timeString = '[' + currTime.getHours() + ":" + currTime.getMinutes() + '] ' ;
	//log(timeString);
	return timeString;
}


/************************************************************************
 * This function handles when a user presses enter while inside a 
 * chatbox. 
 * 
 * Argument: chat_with_name -> name of person that message needs to be
 * 								sent to (without server, i.e. localhost)
 * *********************************************************************/
function HandleChatboxEnter(chat_with_name) {
	var send_text = $('#send_text_' + chat_with_name).val();
	sender_name = my_user_name + '@localhost';
	$('#send_text_' + chat_with_name).val('');
	if(jQuery.trim(send_text).length <= 0) return;
	
	var timestamp = getTimeStamp();

	$('#text_area_' + chat_with_name).append('<span style = "color:#ff6633;" >' + timestamp + sender_name + ": " + '</span> <span style = "color:#000000;" >' + send_text + "</span><br/>");
	$('#text_area_' + chat_with_name).scrollTop($('#text_area_' + chat_with_name)[0].scrollHeight);
	sendMessage(send_text, sender_name, chat_with_name);
}




/************************************************************************
 * Called when a user decides to begin chatting.  
 * 
 * The user to begin chatting with is grabbed from a text box.
 ************************************************************************/
function beginChat() {
	var chat_with_name = document.getElementById('chatbox_id').value;
	makeNewChatbox(chat_with_name);
}


/************************************************************************
 * Makes a new chatbox, or reopens one that had already been made.
 * 
 * Argument: chat_with_name -> name of person to chat with (no server)
 * *********************************************************************/
function makeNewChatbox(chat_with_name) {
	
	
	//var chat_with_name = document.getElementById('chatbox_id').value;  // The name of the person to begin chatting with
	var new_name = "chatbox_" + chat_with_name;  // Creating the ID (chatbox_name)
	
	// If it has already been created
	if ($("#" + new_name).length > 0) {
		// If it's open
		if ($('#' + new_name).dialog('isOpen') == true) {
			return;
		}
		// if its not open, open it
		else {
			 $('#' + new_name).dialog('open');
			 $('#text_area_' + chat_with_name).scrollTop($('#text_area_' + chat_with_name)[0].scrollHeight);
			 $("#" + new_name).css({'height' : '250'});
			return;
		}
	}
	
	
	// Create the div container for the dialog
	$(" <div />" ).attr("id",new_name)
	.attr("title", chat_with_name)
	.html('<div class = "scrolling_area" id = "text_area_' + chat_with_name + '">  </div> <input type="text" name="send_text_' + chat_with_name + '" id="send_text_' + chat_with_name + '" class="chatbox_text" />')
	.appendTo($( "#boxes" ));
	
	// Set Properties of the dialog
	$("#" + new_name).dialog({
        autoOpen: true,
        closeOnEscape: true,
        resizable: true,
        position: [400,400],
		
    });
    // Add my class, and set default height
	$("#" + new_name).addClass('chatbox_below_title');
	$("#" + new_name).css({'height' : '250'});
	$("#" + new_name).parent().css({'position' : 'fixed'});
	/*$("#" + new_name).parent().blur( function() {
												//log('whaaat.');
												$(this).children(":first").addClass('ui-widget-header-disabled');
												$(this).children(":first").removeClass('ui-widget-header');
											}
											);*/
			$("#" + new_name).parent().focus( function() {
												//log('whaaat.');
												$('div[id*="chatbox"]').parent().children(":first").removeClass('ui-widget-header');
												$('div[id*="chatbox"]').parent().children(":first").addClass('ui-widget-header-disabled');
												//$(this).children(":first").removeClass('ui-widget-header-disabled');
												$(this).children(":first").addClass('ui-widget-header');
											}
											);
	$("#send_text_" + chat_with_name).css({'font-family': 'Tahoma,Arial,sans-serif'});
	$("#send_text_" + chat_with_name).css({'font-size': '13px'});
	
	// Bind function for pressing enter
	$('#send_text_' + chat_with_name).keypress(function(e)
	{
         if (e.which == 13) //e = 13 is enter
         {
			 HandleChatboxEnter(chat_with_name);
		 }
	});
	
	// Push name to chatboxes, to store!
	chatBoxes.push(chat_with_name);
	
	
}


/************************************************************************
 * Send a message.
 * 
 * Message from sender, to recipient, and contents = message_to_send
 * *********************************************************************/
function sendMessage(message_to_send, sender, recipient) {
	var recipient_full = recipient + "@localhost";
	var reply = $msg( {to: recipient_full, from: sender, type: 'chat' } ).c("body").t(message_to_send);
	connection.send(reply.tree());
}


/************************************************************************
 * Show a message in the users text area. 
 * 
 * If no open window exists, open (or create).  
 * 
 * Message from 'from', contents = message
 ************************************************************************/
function showChatMessage(from, message) {
	
	makeNewChatbox(from);
	var timestamp = getTimeStamp();
	$('#text_area_' + from).append('<span style = "color:#0033cc;" >' + timestamp + from + ": " + '</span> <span style = "color:#000000;" >' + message + "</span><br/>");
	$('#text_area_' + from).scrollTop($('#text_area_' + from)[0].scrollHeight);
	
}
















