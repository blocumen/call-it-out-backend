const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;


const tweetSchema = new mongoose.Schema({
  
 
  
  tweetLink : {
      type : String,
      default : null
  },
  ratings : [{
    type : ObjectId,
    ref  : "Rating"
  }],
  status: {
    type: String,
    default: 'active'
  },
 result :{
   type : String,
   default: "noStatus"
 }
 
},{
  timestamps : true,
});


module.exports = mongoose.model("Tweet", tweetSchema);