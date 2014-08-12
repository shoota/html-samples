
$(function(){
    var createMapCtrl = function(text, onClick){
        var controlDiv = document.createElement('DIV');

        controlDiv.style.padding = '5px';

        var controlUI = document.createElement('DIV');
        controlUI.style.cursor = 'pointer';
        controlUI.title = 'Click to set the map to Home';
        controlDiv.appendChild(controlUI);

        var controlText = document.createElement('DIV');
        $(controlText).attr('class', 'mapCtl');
        controlText.innerHTML = text;

        controlUI.appendChild(controlText);

        google.maps.event.addDomListener(controlUI, 'click', onClick);
        controlDiv.index = 1;
        return controlDiv
    };

    // generate map
    var element = $('#gmap').get(0);
    var bornLatLng = new google.maps.LatLng(40.6827208759455,141.36383056640625);
    var collegeLatLng = new google.maps.LatLng(37.44433544620035,138.834228515625);
    var comLatLng = new google.maps.LatLng(35.60134598984655,139.721417427063);

    var map = new google.maps.Map(element, {
        zoom: 6,
        minZoom: 4,
        maxzoom: 19,
        center: bornLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // map bottom
    var onClickCtrlHandler = function(latlng){
        return function(){map.panTo(latlng);}
    };
    var bornCtrl = createMapCtrl('地元', onClickCtrlHandler(bornLatLng) );
    var collegeCtrl = createMapCtrl('大学', onClickCtrlHandler(collegeLatLng));
    var comCtrl = createMapCtrl('現在', onClickCtrlHandler(comLatLng));
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(comCtrl);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(collegeCtrl);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(bornCtrl);

    // generate marker
    var born = new google.maps.Marker({
        position: bornLatLng,
        map: map,
        draggable:false,
        flat: true
    });

    var college = new google.maps.Marker({
        position: collegeLatLng,
        map: map,
        draggable:false,
        flat: true
    });

    var com = new google.maps.Marker({
        position: comLatLng,
        map: map,
        draggable:false,
        flat: true
    });
});