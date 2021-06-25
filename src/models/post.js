const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;


const postSchema = new mongoose.Schema({
  
userId: {
    type: ObjectId,
    ref: "User"
  },
 tweetContent : {
      type : String
  },
  tweetLink : {
    type : String
  },
  tweetId : { 
     type : String
  },
  twitterHandle : {
       type : String
  },
   ratings : [{
    type : ObjectId,
    ref  : "Rating"
   }],
  status: {
    type: String,
    default: 'active' //Status to be active for post which are currently screening out inactive which are already done and postpone which needs to be done in future
  },
  result :{
   type : String,
   default: "noStatus"
  }
},{
  timestamps : true,
});


module.exports = mongoose.model("Post", postSchema);