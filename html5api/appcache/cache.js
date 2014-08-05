function init() {
    setInterval(function() {
	applicationCache.update();
    }, 5000);
    applicationCache.addEventListener("updateready", function() {
	if (confirm("アップデートを利用できます。アップデートしますか？")) {
	    applicationCache.swapCache();
	    location.href = location.href;
	}
    }, true);
}
/**
*/