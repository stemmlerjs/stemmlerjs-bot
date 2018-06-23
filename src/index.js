
// Init the application
// src/index.js

const LayersConfigYML = require('config-yml');
const Twit = require('./config').twitter;
const Models = require('./models');
const Search = require('./search')({
  models: Models,
  twit: Twit,
  options: LayersConfigYML.layers.search
})

// // const ScheduleLayer = require('./schedule')
// const config = require('./config');

// // Get instance of bot

// const searchLayerInstance = SearchLayer.getInstance();
// // const scheduleLayerInstance = ScheduleLayer.getInstance();

// // function startup () {
// //   config.mongo.init()
// //     .then(run)
// //     .catch(startupError)
// // }

// // function run () {

//   searchLayerInstance.run();
//   scheduleLayerInstance.run();

//   // botInstance.tweetStatus('')
//   // botInstance.mingle();
//   // botInstance.getTweets('Nick Cave')
// }

// function startupError (err) {
//   console.log(err);
// }

// // Start
// startup();

/**
 * search layer
 * - searches for tweets with 
 */
