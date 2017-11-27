const flowfieldimage = require('./flowfieldimage');
const twitter = require('./twitter');

module.exports = function (context, myTimer) {
    
    flowfieldimage.
        generate().
        then(base64content => {
            twitter
                .tweetImage(base64content)
                .then(data => {
                    context.log.info(data);
                    context.done();
                })
                .catch(error => {
                    context.log.error(error);
                    context.done();
        });
    });
};

