
const Bot = require('./bot');
const config = require('./config');

// Get instance of bot
const botInstance = Bot.getInstance();

function startup () {
  config.mongo.init()
    .then(run)
    .catch(error)
}

function run () {

  // botInstance.tweetStatus('')
  // botInstance.mingle();
  botInstance.getTweets('The Pop Group')
}

function error (err) {
  console.log(err);
}

// Start
startup();
