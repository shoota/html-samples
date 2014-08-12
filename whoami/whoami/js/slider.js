$(function() {

    var current = 1;
    var images = [
        './img/boys.JPG',
        './img/keigo.JPG',
        './img/masanobu.JPG',
        './img/yome.JPG',
        './img/photo.JPG'
    ];




    setInterval(function(){
        var $viewDom = $('#view');
        var $viewDom2 = $('#view2');

        if(current < 4){
            current++;
        } else {
            current = 0;
        }

        var rightSrc = $viewDom2.attr('src');
        var src = images[current];
        $viewDom.fadeOut(300,function() {
//            $viewDom.hidden();
            $viewDom.attr('src', rightSrc).fadeIn(1200);
        });

        $viewDom2.fadeOut(1000,function() {
//            $viewDom.hidden();
            $viewDom2.attr('src', src).fadeIn(1200);
        });


    }, 5000);


});