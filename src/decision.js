

/*
 * src/decision.js
 * 
 * Layer 2
 * 
 * This layer is responsible for deciding if we should perform an action 
 * or not.
 */

const EventEmitter = require('events');
const layerConfig = require('config-yml').layers.decision;

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

    this.followerFollowingRatio = layerConfig.min_following_follower_ratio;

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

  

  }
  
}