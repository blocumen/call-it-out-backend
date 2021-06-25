const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;


const ratingSchema = new mongoose.Schema({
  
 
  ratedBy : {
    type: ObjectId,
    ref: "User" 
  },
  postId : { 
      type : ObjectId,
      ref : 'Post'
  },
  ratingType : {
      type : String,
      default : null
  },
  status: {
    type: String,
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Rating", ratingSchema);