onmessage = function(evt) {
	//var max = evt.data;
	var value =0;
	for(var i=0;i<1000000000;i++){
		value=value+i;
	}
	postMessage(value.toString());
};
