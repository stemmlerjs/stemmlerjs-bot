
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
    
    // Configure logging
    this.logging = layerConfig.logging;

    // Seed accounts that we really like that are related to our interests.
    this.seedAccounts = layerConfig.seed_accounts;

    // Setup the event listeners to perform the stream search by keyword.
    this.initStreams();
  }

  /*
   * initStreams
   * 
   * @return void
   */

  initStreams () {
    let _this = this;

    this.searchKeywords.forEach((keyword) => {
      (function () {
        
        let stream = Twit.stream('statuses/filter', { track: keyword, language: 'en' })
        
        stream.on('tweet', function (t) {
          let text = t.text;
          let createdAt = t.created_at;
          let id = t.id;
          let userId = t.user.id;
          let userScreenName = t.user.screen_name;
          let userFollowers = t.user.followers_count;
          let userFollowing = t.user.friends_count;

          let tweet = new Tweet(text, createdAt, id, userId, userScreenName, userFollowers, userFollowing, keyword);

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
    console.log("Got a tweet to send")
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