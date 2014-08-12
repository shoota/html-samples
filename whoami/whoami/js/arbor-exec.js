(function($){

    var Renderer = function(canvas){
        var cnv = $(canvas).get(0);
        var ctx = cnv.getContext("2d");
        var particleSystem;

        var that = {
            init:function(system){
                particleSystem = system;

                particleSystem.screenSize(cnv.width, cnv.height);
                particleSystem.screenPadding(80); // leave an extra 80px of whitespace per side

                // set up some event handlers to allow for node-dragging
                that.initMouseHandling();
            },

            redraw:function(){
                ctx.fillStyle = "white";
                ctx.fillRect(0,0, cnv.width, cnv.height);

                particleSystem.eachEdge(function(edge, pt1, pt2){

                    // draw a line from pt1 to pt2
                    ctx.strokeStyle = "rgba(0,0,0, .333)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(pt1.x, pt1.y);
                    ctx.lineTo(pt2.x, pt2.y);
                    ctx.stroke();
                });

                particleSystem.eachNode(function(node, pt){
                    var w = 10;
                    ctx.fillStyle = (node.data.alone) ? "orange" : "black";
                    ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
                })
            },

            initMouseHandling:function(){
                // no-nonsense drag and drop (thanks springy.js)
                var dragged = null;

                // set up a handler object that will initially listen for mousedowns then
                // for moves and mouseups while dragging
                var handler = {
                    clicked:function(e){
                        var pos = $(cnv).offset();
                        _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
                        dragged = particleSystem.nearest(_mouseP);

                        if (dragged && dragged.node !== null){
                            // while we're dragging, don't let physics move the node
                            dragged.node.fixed = true;
                        }

                        $(cnv).bind('mousemove', handler.dragged);
                        $(window).bind('mouseup', handler.dropped);

                        return false;
                    },
                    dragged:function(e){
                        var pos = $(cnv).offset();
                        var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);

                        if (dragged && dragged.node !== null){
                            var p = particleSystem.fromScreen(s);
                            dragged.node.p = p;
                        }

                        return false;
                    },

                    dropped:function(e){
                        if (dragged===null || dragged.node===undefined) return;
                        if (dragged.node !== null) dragged.node.fixed = false;
                        dragged.node.tempMass = 1000;
                        dragged = null;
                        $(cnv).unbind('mousemove', handler.dragged);
                        $(window).unbind('mouseup', handler.dropped);
                        _mouseP = null;
                        return false;
                    }
                };

                // start listening
                $(cnv).mousedown(handler.clicked);

            }

        };
        return that
    };

    $(document).ready(function(){
        var sys = arbor.ParticleSystem(1000, 600, 0.5); // create the system with sensible repulsion/stiffness/friction
        sys.parameters({gravity:true}); // use center-gravity to make the graph settle nicely (ymmv)
        sys.renderer = Renderer("#viewport"); // our newly created renderer will have its .init() method called shortly by sys...

        // add some nodes to the graph and watch it go...
        sys.addEdge('a','b');
        sys.addEdge('a','c');
        sys.addEdge('a','d');
        sys.addEdge('a','e');
//        sys.addNode(' f', {alone:true, mass:.25});

    })

})(this.jQuery);