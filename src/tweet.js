
/*
 * 
 */

class Tweet {
  constructor (text, createdAt, id, userId, userScreenName, userFollowers, userFollowing, userProfileDescription, keyword) {
    this.text = text;
    this.createdAt = createdAt;
    this.id = id;
    this.userId = userId;
    this.userScreenName = userScreenName;
    this.userFollowers = userFollowers;
    this.userFollowing = userFollowing;
    this.userProfileDescription = userProfileDescription;
    this.keyword = keyword;
  }

  print() {
    console.log(`=> Keyword='${this.keyword}'`)
    console.log(`=> Tweet='${this.text}'`)
    console.log(`=> Userscreen_name='@${this.userScreenName}', userId='@${this.userId}', followers='${this.userFollowers}', following='${this.userFollowing}'`)
    console.log(`=> User Profile Description='@${this.userProfileDescription}'`)
    console.log("")
  }
}

module.exports = Tweet;