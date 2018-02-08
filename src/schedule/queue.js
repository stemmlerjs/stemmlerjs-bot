

const Event = require('../models').Event;

class Queue {

  constructor () {

  }

  /*
   * add 
   * 
   * @param {Tweet} meta - the object that we are creating the event from
   */

  async add (meta) {
    const _this = this;
    const count = await _this.size();

    /*
     * Only insert if the queue is less than the max queue size.
     */

    if (count < 30) {
      
      Event.collection.insertOne({
        name: 'STREAM.KEYWORD_FOLLOW',
        state: 'QUEUED',
        meta: meta
      })

      console.log(`Added a STREAM.KEYWORD_FOLLOW event to the queue. Current size = ${count}`)
    }
  }

  /*
   * pop
   * 
   * Get the next item from the queue and set it to
   * left.
   */

  pop () {
    const _this = this;
    return new Promise((resolve, reject) => {
      return Event.find({ state: 'QUEUED' }).sort({ "created_at" : 1 }).limit(1)
        .then((event) => {

          /*
           * Update this event to be leaved.
           */

          console.log("about to leave")

          if (event[0]) {
            _this.leave(event[0].id);
            resolve(event[0]);
          }

          else {
            resolve(null)
          }
          
        })
        .catch((err) => {
          reject(err);
        })
    })

  }
  
  leave (id) {        
    return Event.findByIdAndUpdate(id,
      { $set: 
        { 
          state : 'LEFT'
        } 
      }
    )
  }

  /*
   * Returns the current number of queued items.
   */

  size () {
    return new Promise((resolve, reject) => {
      Event.count({ state: 'QUEUED' }, function (err, count) {
        if (err) {
          reject(err)
        }
        else {
          resolve(count)
        }
      });
    })
  }
  
}

module.exports = Queue;