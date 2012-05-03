


function log(msg) {
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}


$(document).ready(function () {
    connection = new Strophe.Connection('/xmpp-httpbind');

	// Set the global username
	my_user_name = $('#user_name').get(0).value;
	    
		var callback = function (status) {
			if (status === Strophe.Status.REGISTER) {
			    connection.register.fields.username = my_user_name;
				connection.register.fields.password = 'pwd';
				connection.register.submit();
		    } 
		    else if (status === Strophe.Status.REGISTERED) {
		        log("registered!");
		        connection.authenticate();
		    } 
		    else if (status === Strophe.Status.CONNECTED) {
		    }
		    else {
		        // every other status a connection.connect would receive
		    }
		};
		
		connection.register.connect("localhost", callback, 60, 1);

});


function goToTigerchat() {
	  document.location.href= "/tigerchat"
}
