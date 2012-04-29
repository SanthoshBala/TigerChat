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






function handle_subscribe_message(newfriend) {
	//log('in function.');
	$.get("/friends/",
			function(data){
				data = jQuery.parseJSON(data);
				
				for(var i = 0; i < data.length; i++) {
					//log('checking on data friend ' + data[i].username +' against ' + newfriend);
					if(data[i].username == newfriend) {
						//log('FOUND TRUE!');
						//log('hello?');
						//log('Already friends with ' + newfriend);
						acceptRequest(connection, my_user_name, newfriend);
						return;
					} 
				}
				
				
				//log('not friends.');
			
				$.get("/requests/",
				function(data){
				repopulate_pending_requests(data);
			});

			}
			
		);
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
	//log('got a presence from ' + sender + ' of type = ' + presType);
	if(sender == my_user_name) return true;
	 // Set sender to be online
	if (presType == null) {
		 // if no type attribute, user is online. update roster
		 if(instance_friends[sender] != undefined) instance_friends[sender].status = "online";
		 if ($("#chatbox_" + sender).length > 0) {
			if ($('#chatbox_' + sender).dialog('isOpen') == true) {
				var timestamp = getTimeStamp();
				$('#text_area_' + sender).append('<span style = "color:#AAAAAA;" >' + timestamp + '</span> <span style = "color:#AAAAAA;" >' + sender + ' has logged on' + "</span><br/>");
				$('#text_area_' + sender).scrollTop($('#text_area_' + sender)[0].scrollHeight);
	
			}
		}
		 updateBuddyListStatus(sender, "online");
	}
	 
	 // Set sender to be offline
	else if (presType == 'unavailable') {
		if(instance_friends[sender] != undefined) instance_friends[sender].status = "offline";
		if ($("#chatbox_" + sender).length > 0) {
			if ($('#chatbox_' + sender).dialog('isOpen') == true) {
				var timestamp = getTimeStamp();
				$('#text_area_' + sender).append('<span style = "color:#AAAAAA;" >' + timestamp + '</span> <span style = "color:#AAAAAA;" >' + sender + ' has logged off' + "</span><br/>");
				$('#text_area_' + sender).scrollTop($('#text_area_' + sender)[0].scrollHeight);
	
			}
		}
		
		 
		updateBuddyListStatus(sender, "offline");
	 
	 }
	 
	 else if (presType == 'subscribe') {
		// check to see if we are friends (accepted)
		var friends_bool;
		
		friends_bool = handle_subscribe_message(sender);
			
		
	 }
	 
	 else if (presType == 'unsubscribe') {
		 
	 }
	 else if (presType == 'subscribed') {
		// log("got a subscribed message from " + sender);
		 
		 var newfriend = {};
		 newfriend.FirstName = "testFirst";
		 newfriend.LastName = "testLast";
		 newfriend.status = "online";
		 instance_friends[sender] = newfriend;
		 
		// log("adding to buddy list.");
		 
		 addToBuddyList(sender);
		 // no action necessary
		 
	 }
	 else if (presType == 'unsubscribed') {
		 
	 }
	 
	 else {
	 
		
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
	//log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	//log('Strophe failed to connect.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	//log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	log('Strophe is disconnected.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
	//slog('Strophe is connected.');
	log('ECHOBOT: Send a message to ' + connection.jid + 
	    ' to talk to me.');
	
	connection.addHandler(onMessage, null, 'message', null, null,  null); 
	connection.addHandler(onPresence, null, 'presence', null, null, null); 
	connection.addHandler(onIQ, null, 'iq', null, null, null); 
	connection.send($pres().tree());
    }
}




$(document).ready(function () {
    connection = new Strophe.Connection('/xmpp-httpbind');


	// Set the global username
	my_user_name = $('#this_user_name').get(0).value;
	
	var testingvar = my_user_name + '@localhost/princeton';
	
	
	connection.connect(testingvar, 'pwd', onConnect);


		
		


    $('#disconnect').bind('click', function () {
	    connection.disconnect();
    });
    
    
	// Initialize the instance friends variable
	$.get('/friends/', function(data) {InitializeFriendsVariable(data)} );

    
    
    
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
			
    $(window).resize();
    
    window.onbeforeunload = function(){
		connection.disconnect();
    };
});





