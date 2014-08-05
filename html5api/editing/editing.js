/*
 *  depend on jquery-1.7.2.min.js
 */
$(function() {
	  $(".submit").click(function(){
		  $(".comment-box").html($(".comment-box").html() + "<br>" + $(".bbody").html());
	  });
});

