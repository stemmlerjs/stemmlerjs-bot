
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
   * pushes 
   */

  async run () {
    var self = this;
    while (true) {
      await self.generateRandomWaitTime();
      const next = await this.Queue.pop();

      if (next) {
        // Dispatch to actuator

        let screenName = next.meta.userScreenName;
        botInstance.follow(screenName);
      }
    }


  }

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