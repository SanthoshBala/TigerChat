function check_if_friends(newfriend) {
	$.get("/friends/",
			function(data){
				data = jQuery.parseJSON(data);
				for(var i = 0; i < data.length; i++) {
					if(data[i].username == 'my_user_name') return true; 
				}
				return false;	

			});
}
