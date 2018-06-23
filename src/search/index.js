
/*
 * src/search.js
 * 
 * Layer 3
 * 
 * This layer is responsible for finding tweets related to our interests.
 */

module.exports = (config) => {

  if (!config) throw new Error('Must provide config for Search Layer.');
  if (!config.hasOwnProperty('twit')) throw new Error('Must provide twit library for Search Layer.');
  if (!config.hasOwnProperty('models')) throw new Error('Must provide models for Search Layer.');

  class SearchLayer {
    constructor (models, twit, options) {
      this.models = models;
      this.twit = twit;
      this.options = options;
      this.keywordStreams = this._initKeywordStreams(this.options.keywords)
    }

    async _handleNewTweet (keyword, t) {
      let text = t.text;
      let createdAt = t.created_at;
      let id = t.id;
      let userId = t.user.id;
      let userScreenName = t.user.screen_name;
      let userFollowers = t.user.followers_count;
      let userFollowing = t.user.friends_count;
      let userProfileDescription = t.user.description ? t.user.description : "";

      let tweet = await this.models.Tweet.create({
        tweet_id: id,
        user_id: userId,
        user_screen_name: userScreenName,
        user_followers: userFollowers,
        user_following: userFollowing,
        user_profile_description: userProfileDescription,
        keyword: keyword,
        tweet_text: text
      });

      this._printTweet(tweet)
    }

    _initKeywordStreams (keywords) {
      let streams = [];
      let stream;

      for (let keyword of keywords) {
        console.log(`> [Search] Stream set up for ${keyword}`)
        stream = this.twit.stream('statuses/filter', { track: keyword, language: 'en' })
        stream.on('tweet', this._handleNewTweet.bind(this, keyword))
        streams.push(stream);
      }
      
      return streams;
    }

    _printTweet (tweet) {
      console.log(">> Saved a new tweet")
      console.log(tweet.dataValues)
    }
  }

  function create(config) {
    // modify the options here if you want
    const { models, twit, options } = config;
    return new SearchLayer(models, twit, options);
  }

  create(config);
}