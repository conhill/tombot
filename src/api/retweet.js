const Twit = require('twit')
const unique = require('unique-random-array')
const config = require('../config')
// const request = require('request')
var Sentencer = require('sentencer')
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();

const param = config.twitterConfig
// const queryString = unique(param.queryString.split(','))

const bot = new Twit(config.twitterKeys)

const retweet = () => {

    // const query = queryString()


    //var userID = '15251843';

    var userID = '45733259';


    var stream = bot.stream('statuses/filter', { follow: ( userID ) });

    stream.on('tweet', function (tweet) {

        if (tweet.user.id == userID && tweet.in_reply_to_status_id === null && tweet.in_reply_to_status_id_str === null && tweet.in_reply_to_user_id === null && tweet.in_reply_to_user_id_str === null && tweet.in_reply_to_screen_name === null && tweet.text.indexOf('@') === -1) {
            var finalTweet = '';
            var splitTweet = tweet.text.split(' ');
            var adjs = [];
            //The angry bear chased the frightened little squirrel.

            wordpos.getAdjectives(tweet.text).then(function (foundAdj){
                for(var i = 0; i < foundAdj.length; i+=2){
                    var adjSentence = splitTweet.indexOf(foundAdj[i])
                    splitTweet[adjSentence] = "{{ adjective }}"
                }

                wordpos.getNouns(splitTweet.join(" ")).then(function(foundNoun){
                    for(var x = 0; x < foundNoun.length; x+=2){
                        var nounSentence = splitTweet.indexOf(foundNoun[x])
                        splitTweet[nounSentence] = "{{ noun }}"
                    }  

                    finalTweet = Sentencer.make(splitTweet.join(" "));

                     bot.post('statuses/update', { status: finalTweet }, function(err, data, response) {
                         console.log(finalTweet);
                     })
                })
            });

        } else {
            console.log(tweet.user.id + " - " + tweet.user.screen_name)
        }
    });

}

module.exports = retweet
