
var exec = require('child_process').exec;
var colors = require('colors')
var mongoose = require('mongoose')
const config = require('config-yml');

function connectMongooseToMongo () {
  return new Promise ((resolve, reject) => {
    mongoose.connect(config.mongodb.connection_string)

    mongoose.connection.on('connected', () => {  
      console.log('[MongoDB]: Connected. ')
      resolve()
    }); 
    mongoose.connection.on('error', () => {  
      console.log('[MongoDB]: Could not connect. ')
      reject()
    }); 
  })
}

module.exports = {
  init: connectMongooseToMongo
}




