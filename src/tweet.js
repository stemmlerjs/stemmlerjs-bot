
/*
 * 
 */

class Tweet {
  constructor (text, createdAt, id, userId, userScreenName, userFollowers, userFollowing, keyword) {
    this.text = text;
    this.createdAt = createdAt;
    this.id = id;
    this.userId;
    this.userScreenName = userScreenName;
    this.userFollowers = userFollowers;
    this.userFollowing = userFollowing;
    this.keyword = keyword;
  }

  print() {
    console.log(`=> Keyword='${this.keyword}'`)
    console.log(`=> Tweet='${this.text}'`)
    console.log(`=> Userscreen_name='@${this.userScreenName}', userId='@${this.userId}', followers='${this.userFollowers}', following='${this.userFollowing}'`)
    console.log("")
  }
}

module.exports = Tweet;