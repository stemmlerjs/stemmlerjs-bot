
const Sequelize = require('sequelize');
const fs = require('fs');
const dbPath = './db.sqlite';

// If db doesn't exist, create it.
if (!fs.existsSync(dbPath)) {
  fs.closeSync(fs.openSync(dbPath, 'w'));
}

const sequelize = new Sequelize('twitter_db', null, null, {
  dialect: "sqlite",
  storage: dbPath,
  logging: false
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('[MYSQL]: Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('[MYSQL]: Unable to connect to the database:', err);
  });

module.exports = sequelize