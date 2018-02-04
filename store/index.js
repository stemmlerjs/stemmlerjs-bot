
/*
 * /store/index.js
 * 
 * The store.json file will hold all of the links that we want to do 
 * actions on. It recieves links from the main class running in the GATHER
 * state.
 * 
 * The purpose of files and functions within this directory is to read and write
 * information to and from the JSON file.
 */

const jsonfile = require('jsonfile')
const storeFilePath = 'store/store.json'

jsonfile.spaces = 2

module.exports = {

  links: {

  /*
   * addLink
   * 
   * @param {String} profileUrl - unique url identifying the link
   * @param {Object} value - containing metadata about the link
   */

  addLink: (profileUrl, object) => {

    let currentStore = jsonfile.readFileSync(storeFilePath)

    currentStore.links[profileUrl] = object;
    jsonfile.writeFileSync(storeFilePath, currentStore);

  },

  /*
   * getLink
   * 
   * @param {String} url - unique url identifying the link object
   * @return {Object} linkObject - containing metadata about the link, perhaps which profile it maps to
   */

    getLink: (url) => {

      const currentStore = jsonfile.readFileSync(storeFilePath)

      if (currentStore.links[url] == undefined) {
        return null
      }

      else return currentStore.links[url]

    },

   /*
    * getAllLinks
    * 
    * @return {Array} linksArray - returns all links
    */

    getAllLinks: () => {
      return jsonfile.readFileSync(storeFilePath).links
    },

   /*
    * getTotalNumLinks
    * 
    * @return {Number} total number of links
    */

    getTotalNumLinks: () => {
      return Object.keys(jsonfile.readFileSync(storeFilePath).links).length
    },

    hasLiked : (profileUrl, linkUrl) => {

    }

  },

  profiles: {

   /*
    * addProfile
    * 
    * @param {String} key - unique url identifying the profile
    * @return {Object} value - containing metadata about the profile
    */

    addProfile: (key, value) => {

      let currentStore = jsonfile.readFileSync(storeFilePath)
      
      /*
       * We'll only put the profile if it hasn't been added before.
       * If it's not there, we'll add it then return truthy success.
       */

      if (currentStore.profiles[key] === undefined) {
         currentStore.profiles[key] = value;
         jsonfile.writeFileSync(storeFilePath, currentStore);
         return true;
      }

      /*
       * Profile has already been added, return falsey success.
       */

      else { 
         return false;
      }
    },

   /*
    * getProfile
    * 
    * @param {String} url - unique url identifying the profile
    * @return {Object} profileObject - containing metadata about the profile
    */

    getProfile: (url) => {

      const currentStore = jsonfile.readFileSync(storeFilePath)

      if (currentStore.profiles[url] == undefined) {
        return null
      }

      else return currentStore.profiles[url]

    },

   /*
    * getAllProfiles
    * 
    * @return {Array} profilesArray - returns all profiles
    */

    getAllProfiles: () => {
      return jsonfile.readFileSync(storeFilePath).profiles
    },

   /*
    * getTotalNumProfiles
    * 
    * @return {Number} total number of profiles
    */

    getTotalNumProfiles: () => {
      return Object.keys(jsonfile.readFileSync(storeFilePath).profiles).length
    },

    setFollowed: (url) => {
      let currentStore = jsonfile.readFileSync(storeFilePath);

      currentStore.profiles[url].following = true;
      jsonfile.writeFileSync(storeFilePath, currentStore);
      console.log(`[STORE]: Followed user=${url}`)

    }

  }
  

}
