

/*
 * src/decision.js
 * 
 * Layer 2
 * 
 * This layer is responsible for deciding if we should perform an action 
 * or not.
 */

const EventEmitter = require('events');
const config = require('config-yml');
const layerConfig = config.layers.decision;
const searchKeywords = config.layers.search.search_keywords

let decisionLayerInstance = null;

module.exports = {

  // Static
  getInstance: () => {
    if (!decisionLayerInstance) {
      decisionLayerInstance = new DecisionLayer();
      return decisionLayerInstance;
    }

    else {
      return decisionLayerInstance;
    }
  }
}

class DecisionLayer extends EventEmitter {

  constructor () {
    super();

    // The minimum optional ratio of followers vs following 
    this.followerFollowingRatio = layerConfig.min_following_follower_ratio;
    this.badWordsFilter = layerConfig.bad_words_filter;
    this.searchKeywords = searchKeywords;

    // When a tweet comes in, handle that event.
    this.on('tweet', this.onTweet);
  }

  /*
   * onTweet
   * 
   * Event listener callback to handle the 'tweet' event emitted from
   * the search layer.
   * 
   * Entry point to start making decisions on what to do with a particular tweet.
   * 
   * @param {Tweet}
   * @return void
   */

  onTweet (tweet) {

    let _this = this;

    console.log("OK, let's make a decision on this tweet")

    let points = 0;

    // Prefilter: Are there any bad words? (if yes, ditch it)
    if(_this.hasBadWords(tweet)) return;

    // A: How many words from our list does it contain? More is more points.
    points += _this.getKeywordPoints(tweet);

    // B: Check the follow / following ratio
    points += _this.getFollowRatioPoints(tweet);

    // C: Does the user have any of the keywords in his account? (big points if so)
    

    // D: 

  }



  getFollowRatioPoints (tweet) {

    var userFollowers = tweet.userFollowers;
    var userFollowing = tweet.userFollowing;

    const ratio = userFollowing / userFollowers;

    console.log("Ratio: ", ratio)

    return ratio

  }

  /*
   * getKeywordPoints
   * 
   * Add one point per keyword found.
   */

  getKeywordPoints (tweet) {
    let keywordPoints = 0;

    for(var i = 0; i < this.searchKeywords; i++) {
      if (!tweet.text.indexOf(this.searchKeywords[i])) keywordPoints++;
    }

    return keywordPoints;
  }

  /*
   * hasBadWords
   * 
   * @return {Boolean} returns false if no bad words found, true if found.
   */

  hasBadWords (tweet) {
    for (var i = 0; i < this.badWordsFilter.length; i++) {
      if (~tweet.text.indexOf(this.badWordsFilter[i])) {
        return true;
      }
    }

    return false;
  }
  
}