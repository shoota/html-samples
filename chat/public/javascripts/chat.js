// need jQuery

$(function() {
	var socket = io.connect('http://pc-f3613-1311-1.nikonoa.net');
	socket.on('connect', function() {
		console.log('connected');
	});
	
	// sent message
	$('#btn').click(function() {

		var message = $('#message');
		socket.emit('msg send', message.val());
		message.val('');
	});

	// receive message
	socket.on('msg push', function (msg) {
		var now = new Date();
		var hr  = ('0'+now.getHours()).slice(-2);
		var min = ('0'+now.getMinutes()).slice(-2);
		var date = hr+':'+min;
		$('#list').prepend($('<span>' + date + '</span><pre class="message">' + msg + '</pre>'));
	});
	
	socket.on('msg updateDB', function(msg){
		console.log(msg);
	});
});