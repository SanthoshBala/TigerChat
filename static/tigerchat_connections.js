/***********************************************************************
 * This file defines all the functions used in generating a connection 
 * to another user.
 ***********************************************************************/
/*
 * Upon connecting, send an empty presence to the server. Server then
 * sends a presence 'to' the user's contacts 'from' the user. Also, the
 * server sends a presence 'to' all other resources associated with the
 * user
 * 
 * 
 * For friend requests, have to send a 'subscribe' presence to the other
 * person. Should contain an id. Server repsonds with an iq while waiting,
 * this iq provides information to update the roster list.
 * 
 * Also can unsubscribe, remove friends by sending an 'unsubscribe'
 * presence
 * 
 * If a 'subscribe' presence is received and the other person is on the
 * roster, send back a 'subscribed' presence if contact is desired or an
 * 'unsubscribed' to reject the request. In either case, the server sends
 * an iq containing a roster push to update the roster. In the event that
 * a 'subscribe' is received by a user whose roster does not contain
 * 
 * 
 * CHECK HOW TO DEAL WITH SERVER, WHETHER IT AUTOMATICALLY CHECKS THE ROSTER
 * WHEN SENDING INITIAL PRESENCE
 * */


/***********************************************************************
 * This function handles all friend requests on both ends. The two
 * clients user and newFriend are connected by connection, and the 
 * fourth argument dictates whether the presence is meant to request a
 * subscription or unsubscription, if it is to respond to a 
 * subscription request, or if it is meant to indicate availability
 **********************************************************************/
function handlePresences(connection, user, newFriend, presType)
{
	// determine what kind of presence is created
	if (user != '' && newFriend != '')	
	{ 
		var sender = user + '@localhost';
		var recipient = newFriend + '@localhost';
		
		var pres_message = $pres({to: recipient, from: sender, type: presType});
	}
	else
	{
		if (presType != '')
		{
			var pres_message = $pres({id: Strophe.getUniqueId, 
				type: presType});
		}
		else
		{
			var pres_message = $pres();
		}			
	}	
	connection.send(pres_message.tree());
	//var recipient_full = newFriend + "@localhost";
	//var reply = $msg( {to: recipient_full, from: sender, type: 'presence' } ).c("body").t('testmsg');
	//connection.send(reply.tree());
	connection.flush();
}


/***********************************************************************
 * This function provides the interface for sending friend requests
 ***********************************************************************/
function sendRequest(connection, user, newFriend)
{
	thistype = "subscribe";
	handlePresences(connection, user, newFriend, thistype);
}

/***********************************************************************
 * This function provides the interface for accepting friend requests
 ***********************************************************************/
function acceptRequest(connection, user, newFriend)
{
	thistype = "subscribed";
	handlePresences(connection, user, newFriend, thistype);
}
 
/***********************************************************************
 * This function provides the interface for sending friend requests
 ***********************************************************************/
function rejectRequest(connection, user, newFriend)
{
	thistype = "unsubscribed";
	handlePresences(connection, user, newFriend, thistype);
}
 
/***********************************************************************
 * This function indicates that the user is now online
 ***********************************************************************/
function onLogin(connection)
{
	handlePresences(connection, '', '', '');
}







function sendIQ() {

	var newIQmsg = $iq({type: 'get', id: 'afwyraga42', to: 'localhost'});
	connection.send(newIQmsg);
	return true;
}



function onIQ(iq) {
	
	thistype = iq.getAttribute("type");
	
	
	return true;
}




function sendIQmsg() {

	var newid = connection.getUniqueId();
	var newIQmsg = $iq({type: 'get', id: newid, to: 'localhost'});
	newIQmsg.c('query', {xmlns: 'jabber:iq:register'});
	connection.send(newIQmsg);
	return true;
}








/***********************************************************************
 * This function indicates that the user is now online
 ***********************************************************************/
 function onPresence(pres) {
	 // first get the message attributes
	 var sender = pres.getAttribute('from');	
	 sender = sender.split('@')[0]; 
	 var presType = pres.getAttribute('type'); 
	 
	 // Now deal with the different types of presences

	 if (presType == '') {
		 // if no type attribute, user is online. update roster
		 
	 }
	 else if (presType == 'subscribe') {
		 
		// check to see if we are friends (accepted)
		if( check_if_friends(sender) == true) {
			acceptRequest(connection, my_user_name, sender);
		}
		
		
		// If not, then repopulate pending_friends and display
		else {
			$.get("/requests/",
			function(data){
			repopulate_pending_requests(data);
			});
		}
		
	 }
	 
	 else if (presType == 'unsubscribe') {
		 
	 }
	 else if (presType == 'subscribed') {
		 
		 // no action necessary
		 
	 }
	 else if (presType == 'unsubscribed') {
		 
	 }
	 
	 // If type attribute exists, there are four cases
	 
	 
	 
				
				return true;
				
				
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
	connection.addHandler(onPresence, null, 'presence', null, null, null); 
	connection.addHandler(onIQ, null, 'iq', null, null, null); 
	connection.send($pres().tree());
    }
}




$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);



	getFriendsList();
	
    // Uncomment the following lines to spy on the wire traffic.
    //connection.rawInput = function (data) { log('RECV: ' + data); };
    //connection.rawOutput = function (data) { log('SEND: ' + data); };

    // Uncomment the following line to see all the debug output.
    //Strophe.log = function (level, msg) { log('LOG: ' + msg); };
	
		
	my_user_name = $('#jid').get(0).value;
	my_user_name = my_user_name.split('@')[0];
	my_user_name = $('#this_user_name').get(0).value;
	    

	if( $('#newpersontag').get(0).value == 'True') {
		log('Found new person!');
		var callback = function (status) {
			log('in callback function.');
			log(status);
			if (status === Strophe.Status.REGISTER) {
				log('step 1');
			    connection.register.fields.username = my_user_name;
				connection.register.fields.password = 'pwd';
				connection.register.submit();
		    } 
		    else if (status === Strophe.Status.REGISTERED) {
		        log("registered!");
		        connection.authenticate();
		    } 
		    else if (status === Strophe.Status.CONNECTED) {
		        log("logged in!");
		    }
		    else {
				log(status);
				log("something else");
		        // every other status a connection.connect would receive
		    }
		};
		
		connection.register.connect("localhost", callback, 60, 1);
	}
		
	


    $('#connect').bind('click', function () {
	var button = $('#connect').get(0);
	if (button.value == 'connect') {
	    button.value = 'disconnect';
	    
	    var testingvar = my_user_name + '@localhost';
	    log(testingvar);
		connection.connect(testingvar, 'pwd', onConnect);

	
	
	
	
	} else {
	    button.value = 'connect';
	    connection.disconnect();
	}
    });
    
				 
		 // Create a subscribed dialog
		$(" <div />" ).attr("id", 'subscribe_dialog')
		.attr("title", "Pending Requests")
		.html('<div class = "subscribe_box" id="subscribe_box">' + 
		'<table width="100%" cellpadding="0" cellspacing="0" id="pending-table">' +
		'</div>')
		.appendTo($( "body" ));
	
		$("#subscribe_dialog").dialog({
			autoOpen: false,
			closeOnEscape: true,
			resizable: true
		});
			
    
});







