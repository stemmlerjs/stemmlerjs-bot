
const Bot = require('./bot');
const SearchLayer = require('./search')
const config = require('./config');

// Get instance of bot
const botInstance = Bot.getInstance();
const searchLayerInstance = SearchLayer.getInstance();

function startup () {
  config.mongo.init()
    .then(run)
    .catch(startupError)
}

function run () {

  // botInstance.tweetStatus('')
  // botInstance.mingle();
  // botInstance.getTweets('Nick Cave')
}

function startupError (err) {
  console.log(err);
}

// Start
startup();
