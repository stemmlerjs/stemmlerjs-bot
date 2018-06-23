
const Twit = require('twit')
const twitterConfig = {
  consumer_key: process.env.TWITTER_BOT_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_BOT_CONSUMER_SECRET,
  access_token: process.env.TWITTER_BOT_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_BOT_ACCESS_TOKEN_SECRET,
}

module.exports = Twit(twitterConfig);