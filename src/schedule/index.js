
const EventEmitter = require('events');
const Queue = require('./queue')
const Bot = require('../bot');
const botInstance = Bot.getInstance();


let scheduleInstance = null;

module.exports = {

  // Static
  getInstance: () => {
    if (!scheduleInstance) {
      scheduleInstance = new Scheduler();
      return scheduleInstance;
    }

    else {
      return scheduleInstance;
    }
  }
}

class Scheduler extends EventEmitter {
  
  constructor () {
    super();

    // When a schedule request comes in, handle that event.
    this.on('schedule', this.onScheduleRequest);
    this.Queue = new Queue();

  }

  onScheduleRequest (tweet) {
    // Add tweet to queue
    this.Queue.add(tweet);
    console.log("SCHEDULED ACTION FOR DISPATCH.")
  }

  /*
   * run
   * 
   * This method uses the mongodb database queue and randomly
   * pushes tweet objects to the dispatcher.
   */

  async run () {
    var self = this;

    /*
     * Run forever
     */

    while (true) {
      // Wait a little bit
      await self.generateRandomWaitTime();

      // Get the next item off the queue.
      const next = await this.Queue.pop();

      // If there exists an item, dispatch it to the actuator.
      if (next) {

        // TODO: If the points were above a certain threshold, we should
        // not only follow the user, but also favourite the tweet that the
        // user posted.

        let screenName = next.meta.userScreenName;
        botInstance.follow(screenName);
      }
    }
  }

  /*
   * generateRandomWaitTime
   * 
   * Generates a random wait time so that we can dispatch actions
   * within a normal distribution.
   */

  generateRandomWaitTime () {
    var time = (Math.random() * 30) * 1000;

    console.log(`[WAITING]: ${time / 1000} seconds.`)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time)
    })
  }


}