const Twit = require('twit');

module.exports.tweetImage = function (base64content) {
    let twit = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        timeout_ms: 60*1000,
    });


    return new Promise((resolve, reject) => {
        // first we must post the media to Twitter
        twit.post('media/upload', { media_data: base64content }, function (err, data, response) {
            if(err) reject(err);
            // now we can assign alt text to the media, for use by screen readers and
            // other text-based presentations and interpreters
            let mediaIdStr = data.media_id_string;
            let altText = 'flow field image';
            let meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

            twit.post('media/metadata/create', meta_params, function (err, data, response) {
                if (err) reject(err);

                let number = Math.random() * 100000;

                // now we can reference the media and post a tweet (media will attach to the tweet)
                let params = { status: `Test image ${number}` , media_ids: [mediaIdStr] };

                twit.post('statuses/update', params, function (err, data, response) {
                    if(err) reject(err);
                    resolve(data);
                })
            })
        });
    });
}