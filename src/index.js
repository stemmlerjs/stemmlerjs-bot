

const SearchLayer = require('./search')
const ScheduleLayer = require('./schedule')
const config = require('./config');

// Get instance of bot

const searchLayerInstance = SearchLayer.getInstance();
const scheduleLayerInstance = ScheduleLayer.getInstance();

function startup () {
  config.mongo.init()
    .then(run)
    .catch(startupError)
}

function run () {

  searchLayerInstance.run();
  scheduleLayerInstance.run();

  // botInstance.tweetStatus('')
  // botInstance.mingle();
  // botInstance.getTweets('Nick Cave')
}

function startupError (err) {
  console.log(err);
}

// Start
startup();
