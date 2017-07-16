const Twit = require('twit')
const unique = require('unique-random-array')
const config = require('../config')
const request = require('request')

const param = config.twitterConfig
const queryString = unique(param.queryString.split(','))

const bot = new Twit(config.twitterKeys)

const retweet = () => {

    const query = queryString()


    var checkTweet = function(nytArt, callback) {

        var options = {
            screen_name: 'ringobot3000',
            count: 15
        };
        bot.get('statuses/user_timeline', options, function(err, data) {
            //For the length of NYT articles, check current tweets
            var found = false;
            for (var i = 0; i < nytArt.length; i++) {
                for (var x = 0; x < data.length; x++) {
                    if (nytArt[i].snippet.slice(0, 40).indexOf(data[x].text.slice(0, 40)) !== -1) {
                        found = true;
                    }
                }
                if(found === false){
                    callback(nytArt[i]);
                    return;
                }
            }
            callback('');
            return;
        })
    }

    var tweetThis = function() {
        request.get({
            url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
            qs: {
                'api-key': "fca6d877b0354be1b1006d1d4091d3d7",
                'q': "trump",
                'sort': "newest",
                'fl': "web_url,snippet"
            },
        }, function(err, response, body) {
            body = JSON.parse(body);
            var tweet = '';

            //use checkTweet to get a tweet against current tweets
            checkTweet(body.response.docs, function(goodTweet) {
                if(goodTweet !== ''){
                    tweet = goodTweet.snippet.slice(0, 80) + '... ' + goodTweet.web_url;

                    if(tweet.length > 140){
                        tweet = goodTweet.snippet.slice(0, 60) + '... ' + goodTweet.web_url;
                    }
                    bot.post('statuses/update', { status: tweet }, function(err, data, response) {
                        console.log(data);
                    })
                }
            });

        })
    }
    tweetThis();
    setInterval(tweetThis, 3600000);
}

module.exports = retweet
