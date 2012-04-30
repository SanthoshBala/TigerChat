

function openRoomCreation() {
	$('#room_creation_dialog').dialog('open');	
}

function create_chatroom() {

	var roomname = $('#chatroom_creation_name').val();
	var roomprivacy = $('#chatroom_creation_privacy').val();
	var roomduration = $('#chatroom_creation_duration').val();
	
	log(roomname + ' ' + roomprivacy + ' ' + roomduration);
	var jid = roomname.replace(/ /g,".");
	log(jid);
		
	$.get("/room/create", {name: roomname, jid:jid, room_private: true, persistent: true }, 
				function(data) {
					log('Room creation: ' + data);
					var mydata = jQuery.parseJSON(data);
					// If the room hasn't been created, then make it
					if(data == 'false') {
						var sender = my_user_name + '@localhost';
						var recipient = roomjid + '@localhost/' + my_user_name;
						var presmsg = $pres( {from: sender, to: recipient}).c('x', {xmlns: 'http://jabber.org/protocol/muc'});
						connection.send(presmsg.tree());
					}
				} 
		 );

	

}




function TestRoom() {


	log('testing the room.');
	var sender = my_user_name + '@localhost';
	var recipient = 'naacho' + '@localhost';
		
	var pres_message = $build('iq', {from: sender, to: 'localhost', type: 'get', }).c('query', {xmlns:'http://jabber.org/protocol/disco#items'});
	var pres_message2 = $pres({from: sender, to: 'newchatroom@conference.localhost/testing'}).c('x', {xmlns: 'http://jabber.org/protocol/muc'});
	var pres_message3 = $iq({from: sender, to: 'conference.localhost', type:'get'}).c('x', {xmlns: 'http://jabber.org/protocol/disco#items'});
	log('done creating message.');
	log(pres_message2);
	
	var mymsg = "<iq from='bansal@localhost' to='localhost' type='get'><query xmlns='jabber:iq:roster'/></iq>";
	connection.send(pres_message2.tree());
	
	
	//log('using previous function.');
	//handlePresences(connection, my_user_name, 'naacho', 'subscribe');
	
	
	//var recipient_full = newFriend + "@localhost";
	//var reply = $msg( {to: recipient_full, from: sender, type: 'presence' } ).c("body").t('testmsg');
	//connection.send(reply.tree());
	connection.flush();

}


function TestLookup() {


	log('testing the room.');
	var sender = my_user_name + '@localhost';
	var recipient = 'naacho' + '@localhost';
		
	var pres_message = $build('iq', {from: sender, to: 'localhost', type: 'get', }).c('query', {xmlns:'http://jabber.org/protocol/disco#items'});
	var pres_message2 = $pres({from: sender, to: 'tigerchatdevelopers@conference.localhost/testing'}).c('x', {xmlns: 'http://jabber.org/protocol/muc'});
	var pres_message3 = $iq({from: sender, to: 'conference.localhost', type:'get'}).c('x', {xmlns: 'http://jabber.org/protocol/disco#items'});
	log('done creating message.');
	log(pres_message3);
	
	var mymsg = "<iq from='bansal@localhost' to='localhost' type='get'><query xmlns='jabber:iq:roster'/></iq>";
	connection.send(pres_message3.tree());
	
	
	//log('using previous function.');
	//handlePresences(connection, my_user_name, 'naacho', 'subscribe');
	
	
	//var recipient_full = newFriend + "@localhost";
	//var reply = $msg( {to: recipient_full, from: sender, type: 'presence' } ).c("body").t('testmsg');
	//connection.send(reply.tree());
	connection.flush();

}
