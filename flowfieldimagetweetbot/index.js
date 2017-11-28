const flowfieldimage = require('./flowfieldimage');
const twitter = require('./twitter');

module.exports = function (context, myTimer) {
    context.log.verbose('Function called');
    flowfieldimage.generate(context.log).
        then(base64content => {
            context.log.verbose('About to tweet');
            twitter.tweetImage(base64content)
                .then(data => {
                    context.log.verbose('Tweeted');
                    context.log.info(data);
                    context.done();
                })
                .catch(error => {
                    context.log.error(error);
                    context.done();
        });
    });
};
