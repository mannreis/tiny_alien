#! /usr/bin/nodejs
console.log('The bot is starting');

var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);


var stream = T.stream('statuses/filter', { follow:['2607163646','2758649640'] })

stream.on('tweet', function (tweet) {
	if(tweet.text.search('RT @') == -1 &&
		tweet.text.search('@_tiny_alien_') == -1){
		console.log('answering')
		tweet.text.replace("@_tiny_alien_", "")
		answer(tweet);
	}
})


function answer(tweet){
	var t = formatText(tweet.text);
	var to = tweet.user.screen_name
	var stat = {
		status: t+'\n@'+to,
		in_reply_to_status_id: tweet.id_str,
		in_reply_to_user_id: tweet.user.id,
		in_reply_to_screen_name: to
		//auto_populate_reply_metatweet: true
	}
	T.post('statuses/update', stat , (err, data, response) => {
		var fs = require('fs');
		var json = JSON.stringify(data, null, 2);
		fs.writeFile("tweet.json",json, function(err) {
	    	if (err) {
	    		console.log('Error');
	    	}
	    });

		if(err){
			console.log(data)
			process.exit(1);
		}else{
			console.log(data.text)
		}
	})
}

function formatText(s) {
	const alien = '👽'
	var indices = [];
	for(i = 1; i < s.length-1; i++) {
	    if (s[i-1] === " " && s[i] === " " && s[i+1] === " ") indices.push(i);
	}
	var index = Math.floor(Math.random() * indices.length+1);
	//console.log(indices, index)
	return s.substr(0,indices[index]-1)+alien+s.substr(indices[index]+1);
}
