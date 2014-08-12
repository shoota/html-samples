
$(function(){
    $("header").zuruiBoss('deboss');
    $("h1").zuruiText({bgType: "dark", opacity:0.2, pix:1});
    $("h2").zuruiLine().zuruiText({bgType: "dark", opacity:0.2, pix:1});

    $("#nextButton")
        .zuruiLine('top')
        .zuruiLine('bottom')
        .zuruiLine('left')
        .zuruiLine('right')
        .zuruiRadius(4)
        .zuruiBoss('deboss');

    $('.slideshow').zuruiBoss('deboss');

    $('.cat-block').zuruiBoss("deboss", {"border": "0.15", "shadow":"0.2", "highlight": "0.7"})
});