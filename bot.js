
const Twit = require('twit');
const config = require('./config')
const T = new Twit(config)


/*
 * Bot class.
 * 
 * This class is responsible for
 * all of the actuation. No logic, no planning, no scheduling,
 * just actuation.
 * 
 */

class Bot {
  constructor () {
    this.twitter = "yeah"
  }


  // Tweet a new status
  tweetStatus () {
    var self = this;

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

    // var followAction = new FollowAction(T, handle)
    // console.log(followAction)
    T.post('friendships/create', { id: handle },tweeted)

    function tweeted(err, data, response) {
      if (err) {
          console.log("somehting went wrong")
          console.log(err);
          console.log()
      }

      else {
          console.log("success followed")
      }
    }

  }

  /*
   *  unfollow a friend of yours that hasn't followed you back
   */

  prune (callback) {
    var self = this;
    
    this.twit.get('followers/ids', function(err, reply) {
        if(err) return callback(err);
        
        var followers = reply.ids;
        
        self.twit.get('friends/ids', function(err, reply) {
            if(err) return callback(err);
            
            var friends = reply.ids
              , pruned = false;
            
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
  mingle (callback) {
    var self = this;
    
    this.twit.get('followers/ids', function(err, reply) {
        if(err) { return callback(err); }
        
        var followers = reply.ids
          , randFollower  = randIndex(followers);
          
        self.twit.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { return callback(err); }
            
            var friends = reply.ids
              , target  = randIndex(friends);
              
            self.twit.post('friendships/create', { id: target }, callback); 
          })
      })
  }
}

function randIndex (arr) {
  var index = Math.floor(arr.length*Math.random());
  return arr[index];
};
