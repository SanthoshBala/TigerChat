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
		
		var pres_message = $pres({to: recipient, from: sender, 
			id: Strophe.getUniqueId, type: prestype});
	}
	else
	{
		if (presType != '')
		{
			var pres_message = $pres({id: Strophe.getUniqueId, 
				type: prestype});
		}
		else
		{
			var pres_message = $pres();
		}			
	}	
	connection.sendMessage(pres_message.tree());
}


/***********************************************************************
 * This function provides the interface for sending friend requests
 ***********************************************************************/
function sendRequest(connection, user, newFriend)
{
	thistype = "\'subscribe\'";
	handlePresences(connection, user, newFriend, thistype);
}

/***********************************************************************
 * This function provides the interface for accepting friend requests
 ***********************************************************************/
function acceptRequest(connection, user, newFriend)
{
	thistype = "\'subscribed\'";
	handlePresences(connection, user, newFriend, thistype);
}
 
/***********************************************************************
 * This function provides the interface for sending friend requests
 ***********************************************************************/
function rejectRequest(connection, user, newFriend)
{
	thistype = "\'unsubscribed\'";
	handlePresences(connection, user, newFriend, thistype);
}
 
/***********************************************************************
 * This function indicates that the user is now online
 ***********************************************************************/
function onLogin(connection)
{
	handlePresences(connection, '', '', '');
}













