var BOSH_SERVICE = '/xmpp-httpbind';
var connection = null;
var chatBoxes = new Array();

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
	var sender_name = document.getElementById('jid').value;
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
		}
	}
	
	
	// Create the div container for the dialog
	$(" <div />" ).attr("id",new_name)
	.attr("title", chat_with_name)
	.html('<div class = "scrolling_area" id = "text_area_' + chat_with_name + '">  </div> <input type="text" name="send_text_' + chat_with_name + '" id="send_text_' + chat_with_name + '" class="chatbox_text" />')
	.appendTo($( "body" ));
	
	// Set Properties of the dialog
	$("#" + new_name).dialog({
        autoOpen: true,
        closeOnEscape: true,
        resizable: true
    });
    // Add my class, and set default height
	$("#" + new_name).addClass('chatbox_below_title');
	$("#" + new_name).css({'height' : '250'});
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

/************************************************************************
 * Function handle for when a message is received.
 * 
 ***********************************************************************/
function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from'); 
    from = from.split('/')[0];
    from = from.split('@')[0];
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
		var body = elems[0];
		
		showChatMessage(from, Strophe.getText(body));
    }

    // we must return true to keep the handler alive.  
    // returning false would remove it after it finishes.
    return true;
}











function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
	log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	log('Strophe failed to connect.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	log('Strophe is disconnected.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
	log('Strophe is connected.');
	log('ECHOBOT: Send a message to ' + connection.jid + 
	    ' to talk to me.');

	connection.addHandler(onMessage, null, 'message', null, null,  null); 
	connection.send($pres().tree());
    }
}


$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);

    // Uncomment the following lines to spy on the wire traffic.
    //connection.rawInput = function (data) { log('RECV: ' + data); };
    //connection.rawOutput = function (data) { log('SEND: ' + data); };

    // Uncomment the following line to see all the debug output.
    //Strophe.log = function (level, msg) { log('LOG: ' + msg); };


    $('#connect').bind('click', function () {
	var button = $('#connect').get(0);
	if (button.value == 'connect') {
	    button.value = 'disconnect';

	    connection.connect($('#jid').get(0).value,
			       $('#pass').get(0).value,
			       onConnect);
	} else {
	    button.value = 'connect';
	    connection.disconnect();
	}
    });
});
