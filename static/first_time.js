


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
				window.location.replace("/tigerchat/");
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
	  document.location.href= "/tigerchat/"
}


// JavaScript Document

var thislist = new Array();
thislist[0] = 'a';
thislist[1] = 'b';
thislist[2] = 'c';
thislist[3] = 'd';
thislist[4] = 'e';
thislist[5] = 'f';
var counter = 0;

function changeText(){
	document.getElementById('loadingtitles').innerHTML = thislist[counter];
	counter++;
	if(counter < thislist.length)
		setTimeout('changeText()', 100);
}

function setSwitch(){
	setTimeout('changeText()', 1000);
	return false;

}
