function check_if_friends(newfriend) {
	log('in function.');
	$.get("/friends/",
	
	
	
			function(data){
				data = jQuery.parseJSON(data);
				
				for(var i = 0; i < data.length; i++) {
					
					
					
					log('checking on data friend ' + data[i].username +' against ' + newfriend);
					if(data[i].username == newfriend) {
						log('FOUND TRUE!');
						log('hello?');
						log('Already friends with ' + newfriend);
						acceptRequest(connection, my_user_name, newfriend);
						return;
					} 
				}
				
				
				log('not friends.');
			
				$.get("/requests/",
				function(data){
				repopulate_pending_requests(data);
			});

			}
			
		);
}
