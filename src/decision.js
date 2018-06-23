

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

const ScheduleLayer = require('./schedule')
const scheduleLayerInstance = ScheduleLayer.getInstance();

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
    this.pointsThresh = layerConfig.points_thresh;

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
    points += _this.getProfileKeywordPoints(tweet);    

    console.log(`This tweet was awarded [${points}] points!\n`)

    // Finally, handle what to do with this tweet based on the points awarded.
    _this.makeDecision(tweet, points);

  }

  makeDecision(tweet, points) {

    /*
     * If the tweet is greater than points thresh, we will
     * do an action with it for now.
     */

    if (points >= this.pointsThresh) {
      this.send(tweet)
    }


  }

  /*
   * getProfileKeywordPoints
   */

  getProfileKeywordPoints (tweet) {
    const userProfileDescription = tweet.userProfileDescription;

    let keywordPoints = 0;

    for(var i = 0; i < this.searchKeywords; i++) {
      if (~userProfileDescription
          .toUpperCase()
          .indexOf(
            this.searchKeywords[i]
              .toUpperCase())) keywordPoints = keywordPoints + 1
    }

    return keywordPoints;

  }

  /*
   * getFollowRatioPoints
   * 
   * Awarding based on follow ratio.
   */

  getFollowRatioPoints (tweet) {

    var userFollowers = tweet.userFollowers;
    var userFollowing = tweet.userFollowing;
    const ratio = userFollowing / userFollowers;

    let points = 0;

    /*
     * A: In this case, the user has no followers.
     * There's a good chance that this is a bot or something. 
     * 
     * Let's not award any points for this.
     */
    
    if (ratio == undefined) {
      return points;
    }

    /*
     * B: Good! The user follows more people than they have following them.
     * This means that they're probably someone that will follow us back.
     */

    if (ratio >= this.followerFollowingRatio) {
      points+= Math.round(ratio);
    }    

    console.log("Ratio: ", ratio)

    return points;

  }

  /*
   * getKeywordPoints
   * 
   * Add one point per keyword found.
   */

  getKeywordPoints (tweet) {
    let keywordPoints = 0;

    for(var i = 0; i < this.searchKeywords; i++) {
      if (~tweet.text
        .toUpperCase()
        .indexOf(
          this.searchKeywords[i]
            .toUpperCase())) keywordPoints = keywordPoints + 1;
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
    scheduleLayerInstance.emit('schedule', tweet);
  }
  
}