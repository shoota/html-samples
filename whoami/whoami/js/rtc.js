$(function(){
    // Assign the <video> element to a variable
    var video = $('video')[0];

    // Replace the source of the video element with the stream from the camera
    navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia;
    if(!!navigator.getUserMedia_ !== false) {
    try {
    navigator.getUserMedia_({"video": true, toString: function(){return "video"}}, successCallback, errorCallback);
} catch(e) {
    console.log(e);
    }

function successCallback(stream) {
    video.src = window.webkitURL ?
        window.webkitURL.createObjectURL(stream) :
        stream;
    }
function errorCallback(error) {
    console.error('An error occurred: [CODE ' + error.code + ']');
    return;
    }
} else {
    console.log('Native web camera streaming (getUserMedia) is not supported in this browser.');
    $('output').html('Sorry, your browser doesn\'t support getUserMedia. ')
    .append('<p>Try Chrome canary or dev channel ')
    .append('with enabling MediaStream at chrome://flags ')
    .append('(To be sure that it is now experimental ')
    .append("and don't forget to set --enable-media-stream ")
    .append("as a execute parameter)")
    .append('</p>')

    return;
    }


$('#shot').click(function(){
    var video = $('video')[0];
    var canvas = $('canvas')[0];
    var ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    $('#previeJpg').attr('src', canvas.toDataURL("image/jpeg"));

    });

});