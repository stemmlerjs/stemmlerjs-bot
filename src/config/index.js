

const db = require('./db');
const twitter = require('./twitter')


module.exports = {
  twitter: twitter,
  dbConnection: db
}