var EventModel = Backbone.Model.extend({
    //started_at: Date,
    //ended_at: Date
});

var EventCollection = Backbone.Collection.extend({
    model: EventModel
});


var EventView = Backbone.View.extend({
    tagName: 'div',
    className:'event',

    initialize: function(){
        var events = {
            //'click .detail': '_onShowDetail',
            'click .toMap' : '_toGoogleMapView'
        };
        this.delegateEvents(events);
    },

    /*
    _onShowDetail: function() {
        this.$el.find('.description').show();
    },
    */

    template:_.template(
        '<div class="title"><%= title %></div> <a target="_blank" href="<%= event_url %>">このイベントのページへ移動</a>' +
            //'<button class="detail">詳細を表示</button>' +
            //'<div class="description"><%= description %></div>' +
            '<div class="summary">' +
            '開催日時 <%= started_at %><br>' +
            '終了日時 <%= ended_at %><br>' +
            '場所 <%= address %><%= place %> <button class="toMap">GoogleMapで表示</button><br>' +
            '</div>'
    ),

    _toGoogleMapView: function() {

        var searchData = this.model;
        var lat = searchData.get('lat');
        var lon = searchData.get('lon');

        if(!this.makeMapElement(lat,lon)){
            alert('このイベントには位置情報が含まれていません');
            return;
        }

        var centerLatLon = new google.maps.LatLng(lat,lon);

        // TODO map再作成ではなく、アニメーション移動
        var mv = new MapView();
        mv.setViewCenter(centerLatLon);
        mv.createMap();

        var marker = new MarkerModel({map:mv.map, lat: lat, lon: lon});
        //mv.markers.add(marker);

    },

    makeMapElement: function(lat, lon) {
        if(_.isEmpty(lat)|| _.isEmpty(lon)) {
            $('#mapArea').empty();
            return false;
        }else{
            $('#mapArea').append('<div id="map"></div>');
            return true;
        }

    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this.el;
    }
});

var SabotenModel = Backbone.Model.extend({

    defaults: {
        resultCounts: 0
    },

    initialize: function(){
        this.searchEvents = new EventCollection();
    }
});


var SearchModel = Backbone.Model.extend({
    validate: function(attrs){
        if(attrs.keyword.match(/&|\?|<|>|=/i)) {
            return '検索キーワード';
        }
    }
});

var SearchView = Backbone.View.extend({
    el: '#searchInput',

    events: {
        'click #search': '_onSearch'
    },

    _onSearch: function() {
        var mdl = this.model;

        if(!mdl.searchEvents.isEmpty()){
            //DOM初期化
            mdl.searchEvents.reset();
        }

        // validation
        var searchMdl = new SearchModel();
        searchMdl.on('error', function(model, error){
            alert(error+ 'に禁止文字が含まれています');
            // TODO 画面に出したい
        });

        var keyword = $('#keyword').val();

        if(searchMdl.set({keyword: keyword})) {
            var data = {
                keyword: keyword,
                //keyword: '東京',
                //keyword: encodeURI('東京')
                format: 'jsonp'

            };
            var jqxhr = $.ajax({
                dataType: "jsonp",
                url: "http://api.atnd.org/eventatnd/event/", //SearchModel.CONSTANCE
                data: data,
                //data: { q: encodeURI( $( "#searchTxt" ).val() ) },
                jsonp: 'callback',
                success: function(data){
                    var list = mdl.searchEvents;
                    var resultCounts = data.results_available;
                    mdl.set('resultCounts', resultCounts);

                    if(resultCounts == 0){
                        mdl.trigger('notFound');
                    }else{
                        var result = data.events[0].event;
                        for(var i=0; i<result.length; i++) {
                            list.add(new EventModel(result[i]));
                        }
                    }
                }
            });
        }

    }

});

var ResultView = Backbone.View.extend({
    el: '#result',

    // model(SabotenModel)のイベントハンドラ
    initialize: function(){
        this.model.searchEvents.bind('add', this.addEvent, this);
        this.model.searchEvents.bind('reset', this.resetAllDocument, this);
        this.model.bind('notFound', this.noEvent, this);
    },

    addEvent: function(evMdl){
        var evView = new EventView({model:evMdl});
        this.render(evView);
    },

    noEvent: function() {
        this.$el.html('NOT FOUND ANY RESULTS');
    },


    resetAllDocument: function() {
        this.$el.children('.event').remove();
        $('#mapArea').empty();

      /*
        $('.event').fadeOut("slow",
            function(){
                $('#result').children('.event').remove();
                $('#mapArea').empty();
            });
            */
    },

    numberFormatter: function(str) {
    var num = new String(str).replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return num;
    },

    render: function(evView) {

        // やることが混んできたらSabotenModelをtoJsonしておこう
        var count = this.model.get('resultCounts');
        this.$el.children('#resultsCount').html(this.numberFormatter(count)+' HIT');

        this.$el.append(evView.render());

    }

});

var MarkerModel = Backbone.Model.extend({

    initialize: function() {
        var lat = this.get('lat');
        var lon = this.get('lon');

        // Image of Marker
        /*
        var markerImg = new google.maps.MarkerImage({
            url:'',
            size: '',
            //origin: // if use css sprite, to set
            anchor: ''
            //scaledSize:''
        });
        */

        var shadow  ='';


        this.googleMarker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lon),
            map: this.get('map')
            //icon: markerImg
            //shadow: shadow,
            /* not in use
            draggable:true,
            raiseOnDrag: true
            */
        });

    }

});

var MarkerCollection = Backbone.Collection.extend({
    model: MarkerModel
});

var MapView = Backbone.View.extend({
    el: '#map',

    initialize: function(){
        var mapTarget = this.$el;

        this.mapOptions = {
            zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.HYBRID,google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.SATELLITE,google.maps.MapTypeId.TERRAIN]
            },
            panControl:true,
                streetViewControl: false,
                zoomControl:true,
                zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE
            }
        };

        /*
        this.map = new google.maps.Map(this.$el, this.mapOptions);
         */

        this.markers = new MarkerCollection();
        this.markers.bind('add', this._onAddMarker, this);

    },

    setViewCenter: function(latLon){
        this.mapOptions.center = latLon;
    },

    createMap: function() {
        this.map = new google.maps.Map(this.$el[0], this.mapOptions);
    },

    _onAddMarker: function(mkMdl){
        // マーカーが表示されたときの処理。いまのところなし。
    }

});

$(function(){
    var apMdl = new SabotenModel();
    var searchView = new SearchView({model: apMdl});
    var apView = new ResultView({model: apMdl});
});