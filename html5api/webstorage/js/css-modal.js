/*
 *  depend on jquery-1.7.2.min.js
 */
$(function() {
	/* modalウィンドウ描画 */
    $('.thumb').click(function() {
    	// session storageへのset処理
    	if(!window.sessionStorage){
    		$("'.history-button'").hide();
    		return false;
    	} else {
    		var sesSt = window.sessionStorage;
    	}
    	// 初期動作
    	var keyPreffix = "img-history";
    	var index;
    	if(sesSt.length == 0){
    		index = 0;
    	} else {
    		index = parseInt(sesSt.getItem("index")) + 1;
    	}
    	// 異なる画像がクリックされたら保存
    	if(index == 0 || $(this).attr("src") != sesSt.getItem(keyPreffix+(index - 1))){
    		sesSt.setItem("index", index);
    		sesSt.setItem(keyPreffix+index, $(this).attr("src"));

    		//セットした後のsessionStorageをクリア
    		for(var i= index + 1; sesSt.getItem(keyPreffix+i); i++){
    			sesSt.removeItem(keyPreffix+i);
    		}

    	} else {
    		return false;
    	}
    	// 画像の埋め込み
    	$(".view-img").attr("src", $(this).attr("src"));
    	//表示スタイルセット
        $('.overlay-container').fadeIn(function() {
          window.setTimeout(function(){
            $('.window-container.zoom').addClass('window-container-visible');
          }, 100);
        });

      });

    /* modal のクローズ */
    $('.close').click(function() {
    	$('.overlay-container').fadeOut().end().find('.window-container').removeClass('window-container-visible');
    });

    /* history 表示 */
    $('.history-button').click(function(){
    	var btnType = $(this).attr("id");
    	var sesSt = window.sessionStorage;
    	var index = sesSt.getItem("index");
    	var keyPreffix = "img-history";

    	// 履歴が一つのときは終わり
    	if(btnType == "previous" &&  index != "0") {
    		index--;
    	} else if(btnType == "next" && sesSt.getItem(keyPreffix+(parseInt(index) + 1))) {
    		index++;
    	} else {
    		return false;
    	}

    	sesSt.setItem("index", index);
    	$(".view-img").attr("src", sesSt.getItem(keyPreffix+index));

    });



});

