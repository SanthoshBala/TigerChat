// JavaScript Document

$(window).resize(function(){
	 
	    $('#buttoncenter').css({
	        position:'absolute',
	        left: ($(window).width() - $('#buttoncenter').outerWidth())/2,
	        top: ($(window).height() - $('#buttoncenter').outerHeight())/2
	    });
	 
	});
	
$(document).ready(function() {
		 
	// To initially run the function:
	$(window).resize();
});