const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;


const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({

  firstName : {
    type : String
  },
  lastName : {
    type : String
  },
  address :{
    type : String
  },
  city : {
    type : String
  },
  country : {
    type : String
  },
  postalCode :{
    type : String
  },
  aboutMe :{
    type : String
  },
  email: {
    type: String,
    trim: true,
  },
  role : {
    type : String,
    default : 'user'
  },
 twitterUserId : {
    type : String
  },
  twitterHandleName : {
  type : String
  },
  // publicKey : {
  //   type : String,
  //   required : true
  // },
  reputationPoints : {
      type : Number,
      default : 0
  },
 status: {
    type: Number,
    default: 1
  },
  
  created: {
    type: Date,
    default: Date.now
  },
 updated: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function(next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    }
    next();
  } catch (error) {
    next(error);
  }
});

//methods
userSchema.methods = {
  authenticate: function(password, hashed_password) {
    return bcrypt.compareSync(password, hashed_password);
  }
};

module.exports = mongoose.model("User", userSchema);
