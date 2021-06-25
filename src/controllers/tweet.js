const _ = require("lodash");
const async = require("async");
const tweetData = require("../../mockData/tweetData");

const Tweet = require("../models/tweet");

module.exports = {
    getTweets: async (req, res) => {
    try {
    
    return res.json({
        status : true,
        tweets : tweetData
    })
    } catch (err) {
      res.json({
        status: false,
        error: err,
      });
    }
  }

};
