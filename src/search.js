
/*
 * src/search.js
 * 
 * Layer 3
 * 
 * This layer is responsible for finding tweets to like and accounts to follow.
 */

const twit = require('twit');
const config = require('./config');
const Twit = twit(config)
const layerConfig = require('config-yml').layers.search;
const Tweet = require('./tweet')

const DecisionLayer = require('./decision')
const decisionLayerInstance = DecisionLayer.getInstance();

let searchLayerInstance = null;

module.exports = {

  // Static
  getInstance: () => {
    if (!searchLayerInstance) {
      searchLayerInstance = new SearchLayer();
      return searchLayerInstance;
    }

    else {
      return searchLayerInstance;
    }
  }
}

class SearchLayer {

  constructor() {
    // Keywords to search for.
    this.searchKeywords = layerConfig.search_keywords;

    this.streams = [];
    
    // Configure logging
    this.logging = layerConfig.logging;

    // Seed accounts that we really like that are related to our interests.
    this.seedAccounts = layerConfig.seed_accounts;

    
  }

  run () {

    // Setup the event listeners to perform the stream search by keyword.
    this.initStreams();

  }

  /*
   * initStreams
   * 
   * Initializes all of the streams for the search layer.
   * Each stream is an event listener that is placed into the list
   * of streams.
   * 
   * @return void
   */

  initStreams () {
    let _this = this;

    this.searchKeywords.forEach((keyword) => {
      (function () {
        
        let stream = Twit.stream('statuses/filter', { track: keyword, language: 'en' })

        _this.streams.push(stream);
        
        stream.on('tweet', function (t) {
          let text = t.text;
          let createdAt = t.created_at;
          let id = t.id;
          let userId = t.user.id;
          let userScreenName = t.user.screen_name;
          let userFollowers = t.user.followers_count;
          let userFollowing = t.user.friends_count;
          let userProfileDescription = t.user.description ? t.user.description : "";

          let tweet = new Tweet(text, createdAt, id, userId, userScreenName, userFollowers, userFollowing, userProfileDescription, keyword);

          if (_this.logging) _this.printTweet(tweet);
          
          _this.send(tweet);
        })
      }())
      
    })  
  }

  /*
   * send
   * 
   * This function simply sends the tweet that was found in the stream to
   * the decision layer to decide what to do with it.
   * 
   * @param {Tweet} - the tweet that we want to send to the decision layer to make a decision.
   * @return void
   */

  send(tweet) {
    decisionLayerInstance.emit('tweet', tweet);
  }

  /*
   * printTweet
   * 
   * Prints out the tweet.
   * 
   * @param {Tweet} - the tweet to print
   * @return void
   */

  printTweet (tweet) {
    console.log(`[Layer 4]: Tweet from keyword stream found.`)
    tweet.print();
  }
  
}