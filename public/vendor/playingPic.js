(function() {
	var img_url = ["senior","college"];
	var i = 0;
	setInterval(function(){
		$('#playing-img').animate('fadeOutIn', 1000);
		setTimeout(function(){
			$('#playing-img').attr('src','/blog/album/'+img_url[i++]+'/1.jpg');
			if(i == img_url.length)
				i = 0;
		},500);
	},5000);
})();
