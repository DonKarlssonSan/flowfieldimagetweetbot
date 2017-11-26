const Twit = require('twit')
const fs = require('fs');

module.exports = function (context, myTimer) {
    
    let twit = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
      timeout_ms: 60*1000,
    });

    let number = Math.random() * 100000;
    twit.post('statuses/update', { status: `Hello! ${number}` }, function(err, data, response) {
        context.log(data);
        context.log.error(err);
        //console.log(err, data, response);
        context.done();
    });
};

