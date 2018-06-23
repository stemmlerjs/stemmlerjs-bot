
/*
 * Bot
 */

const twit = require('twit');
const config = require('./config');
const Twit = twit(config)
const Event = require('./models').Event;

let botInstance = null;

module.exports = {

  // Static
  getInstance: () => {
    if (!botInstance) {
      botInstance = new Bot();
      return botInstance;
    }

    else {
      return botInstance;
    }
  }
}

/*
 * Bot class.
 * 
 * This class is responsible for
 * all of the actuation. No logic, no planning, no scheduling,
 * just actuation.
 */

class Bot {
  
  constructor () {
    this.layerConfig = config.actuation;
  }

  // Tweet a new status
  tweetStatus (message) {

    var tweet = {
      status: message
    }

    Twit.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
      if (err) {
        console.log("somehting went wrong")
        console.log(err);
        console.log()

        Event.collection.insertOne({
          name: 'TWEET',
          state: 'QUEUED',
          meta: err
        })
      }

      else {
        console.log("Successfully posted tweet");
        Event.collection.insertOne({
          name: 'TWEET',
          state: 'QUEUED',
          meta: data
        })
      }
    }

  }

  /*
   * follow
   * 
   * Follows a user by handle.
   * 
   * @param {String} - user handle
   */

  follow (handle) {
    var self = this;

    Twit.post('friendships/create', { id: handle }, tweeted)

    function tweeted(err, data, response) {
      if (err) {
          console.log("[FOLLOW]: Failed to follow @" + handle)
          console.log(err);
          console.log()
      }

      else {
        console.log(`[FOLLOW]: Successfully followed @${handle}`);
        console.log("")
      }
    }
  }

  getTweets (query) {
    Twit.get('search/tweets', { q: 'query', count: 1 }, function(err, data, response) {
      console.log(data.statuses[0])
      console.log(data.statuses[0].user)
    })
  }

  /*
   *  unfollow a friend of yours that hasn't followed you back
   */

  prune (callback) {
    var self = this;

    /*
     * Get a list of all my followers
     */
    
    this.twit.get('followers/ids', function (err, reply) {
        if(err) return callback(err);
        
        var followers = reply.ids;
        
        /*
         * Get a list of all the people I follow.
         */

        self.twit.get('friends/ids', function(err, reply) {
            if(err) return callback(err);
            
            var friends = reply.ids
              , pruned = false;
            

            /*
             * Find one person who doesn't follow me back and unfollow them.
             */

            while(!pruned) {
              var target = randIndex(friends);
              
              if(!~followers.indexOf(target)) {
                pruned = true;
                self.twit.post('friendships/destroy', { id: target }, callback);   
              }
            }
        });
    });
  }

  //
  //  choose a random friend of one of your followers, and follow that user
  //

  mingle () {
    var self = this;

    /*
     * Get my followers
     */

    Twit.get('followers/ids', (err, reply) => {
      if(err) { 
        Event.collection.insertOne({
          name: 'MINGLE FOLLOW',
          success: false,
          meta: makeErrorObj(err, "Couldn't get my list of friends")
        })
      }
        
        var followers = reply.ids;
        var randFollower = randIndex(followers);

        /*
         * Get the friends list from a random rollower
         */
          
        Twit.get('friends/ids', { user_id: randFollower }, (err, reply) => {
            if(err) { 
              Event.collection.insertOne({
                name: 'MINGLE FOLLOW',
                success: false,
                meta: makeErrorObj(err, `Couldn't get ${randFollower}'s list of friends`)
              })
            }
            
            var friends = reply.ids
            var target  = randIndex(friends);

            /*
             * Follow one of the random friends that is following
             * my friend.
             */
              
            Twit.post('friendships/create', { id: target }, (err, data, response) => {

              /*
               * Failed to follow a friend of a friend.
               */

              if (err) {
                Event.collection.insertOne({
                  name: 'MINGLE FOLLOW',
                  success: false,
                  meta: makeErrorObj(err, `Couldn't follow ${target}. `)
                })
              }

              else {

                Event.collection.insertOne({
                  name: 'MINGLE FOLLOW',
                  success: true,
                  meta: data
                })

                console.log(`[Mingle Follow]: Followed @${data.screen_name}.`)
              }

            }); 
          })
      })
  }
}

function makeErrorObj (err, message) {
  console.log(message);
  return {
    err: err,
    message: message
  }
}

function randIndex (arr) {
  var index = Math.floor(arr.length*Math.random());
  return arr[index];
};
