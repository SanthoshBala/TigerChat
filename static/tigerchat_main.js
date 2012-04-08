var BOSH_SERVICE = '/xmpp-httpbind';
var connection = null;
var chatBoxes = new Array();

function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function makeNewChatbox() {
	
	var chat_with_name = document.getElementById('chatbox_id').value;  // The name of the person to begin chatting with
	var new_name = "chatbox_" + chat_with_name;  // Creating the ID (chatbox_name)
	
	// If it has already been created
	if ($("#" + new_name).length > 0) {
		// If it's open
		if ($('#' + new_name).dialog('isOpen') == true) {
			$('#' + new_name).append('tried to close.');
			return;
		}
		// if its not open, open it
		else {
			 $('#' + new_name).dialog('open');
		}
	}
	
	
	
	$(" <div />" ).attr("id",new_name)
	.attr("title", chat_with_name)
	.html('<div style = "background-color: #ddd;"> <div id = "text_area_' + chat_with_name + '">  chat area! </div> <input type="text" name="send_text_' + chat_with_name + '" id="send_text_' + chat_with_name + '" /></div>')
	.appendTo($( "body" ));
	
	$("#" + new_name).dialog({
        autoOpen: true,
        buttons: { 'Close button': function() { $(this).dialog('close'); } },
        closeOnEscape: true,
        resizable: true
    });
	
	chatBoxes.push(chat_with_name);
	
	
}

function mysendmessage() {
	var chat_msg = document.getElementById('message_to_send').value;
		
	var recipient = document.getElementById('chat_recipient').value;
	var callee = document.getElementById('jid').value;
		
	var reply = $msg({to: recipient, from: callee, type: 'chat'})
            .c("body").t(chat_msg);//(Strophe.copyElement(body));

	connection.send(reply.tree());

	log(callee + ': ' + chat_msg);
   
	
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

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
	var body = elems[0];

	log(from + ': ' + Strophe.getText(body));
    
    //log('Rohan');
    //log('From: ' + from);
    //log('To: ' + to);
    //log('Checking dynamic nature.');
    
    var to2 = 'rohan2@localhost';
	var from2 = 'rohan@localhost';
	
	var reply = $msg({to: to2, from: from2, type: 'chat'}).c("body").t('Test Message!');//(Strophe.copyElement(body));

	//connection.send(reply.tree());

	//log('ECHOBOT: I sent ' + from + ': ' + Strophe.getText(body));
    }

    // we must return true to keep the handler alive.  
    // returning false would remove it after it finishes.
    return true;
}





$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);

    // Uncomment the following lines to spy on the wire traffic.
    //connection.rawInput = function (data) { log('RECV: ' + data); };
    //connection.rawOutput = function (data) { log('SEND: ' + data); };

    // Uncomment the following line to see all the debug output.
    //Strophe.log = function (level, msg) { log('LOG: ' + msg); };

	var $dialog = $('<div></div>')
		.html('This dialog will show every time!')
		.dialog({
			autoOpen: false,
			title: 'Basic Dialog'
		});

	$('#opener').click(function() {
		$dialog.dialog('open');
		// prevent the default action, e.g., following a link
		return false;
	});
	



	$('#dialog4').dialog({
        autoOpen: false,
        show: 'slide', // bounce//explode//clip//fold//highlight//pulsate//puff//scale//shake//slide//blind
        hide: 'explode',
        buttons: { 'Close': function() { $(this).dialog('close'); } },
        closeOnEscape: true,
        resizable: false
    });
    $('#toggle4').click(function() {
        if ($('#dialog4').dialog('isOpen') == true)
            $('#dialog4').dialog('close');
        else
            $('#dialog4').dialog('open');
        return false;
    });
    



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
