const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

require("dotenv").config();

const User = require("../models/user");
const oauthCallback=process.env.FRONTEND_URL || 'https://quick-panther-11.loca.lt';
const oauth = require('../lib/oauth-promise')(oauthCallback);
const COOKIE_NAME = 'oauth_token';
let tokens = {};


module.exports = {
  signup: async (req, res) => {
    console.log("user sign up api");
    const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(403).json({
                error: "Email is taken"
            })
        }
        
        const user = await new User(req.body);
        await user.save();
 
    return res.status(200).json({ message: "Signup success. Please login" });
  },
  signin: async (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    
    User.findOne(
      {
        email: req.body.email
      },
      async (err, user) => {
        //if err or no user
       
        //if user is found, make sure that email and password match
        //create authenticate method in model and use here
        console.log(user);
        
        if (user) {
          if (!user.authenticate(req.body.password, user.password)) {
            return res.status(401).json({
              error: "Email and password do not match"
            });
          }

        }
        

        //generate a token with user_id and secret
        var token = null;
        if (user) {
          token = jwt.sign({ _id: user._id,role : user.role }, process.env.JWT_SECRET);
        }
       

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
       

        //return response with user and token to frontend client
        if (user) {
          const { _id, fullName, role } = user;
          return res.json({ token, user: { _id, fullName, role} });
        }
       
      }
    );
  },
  
  signout: (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "Signout success" });
  },

  // requireSignin: expressJwt({
  //   secret: process.env.JWT_SECRET
  // },{

  // })

  getTwitterRequestOathToken: async (req,res) =>{
    console.log("hey");
    const {oauth_token, oauth_token_secret} = await oauth.getOAuthRequestToken();
    console.log(oauth_token_secret, "88")
    
  console.log("hey dere");
  console.log(oauth_token, "90")

    res.cookie(COOKIE_NAME, oauth_token , {
      maxAge: 15 * 60 * 1000, // 15 minutes
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    
    tokens[oauth_token] = { oauth_token_secret };
    res.json({ oauth_token });
  },

  getTwitterAccessOathToken: async (req,res)=>{
 
    console.log(req.body, "104")
    console.log(req.cookies[COOKIE_NAME], "105")
    console.log(tokens, "106")

    try {
      const {oauth_token, oauth_verifier} = req.body;
      // const oauth_token = req.cookies[COOKIE_NAME];
      // console.log(req.cookies[COOKIE_NAME])
      const oauth_token_secret = tokens[oauth_token].oauth_token_secret;
      console.log(oauth_token,oauth_token_secret,oauth_verifier, "112")
      // if (oauth_token !== req_oauth_token) {
      //   res.status(403).json({message: "Request tokens do not match"});
      //   return;
      // }
      const {oauth_access_token, oauth_access_token_secret} = await oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier);
      tokens[oauth_token] = { ...tokens[oauth_token], oauth_access_token, oauth_access_token_secret };
      res.json({success: true});
      
    } catch(error) {
      res.status(403).json({message: "Missing access token"});
    } 
  },

  getTwitterUserProfileBanner : async (req,res) => {
    try {
      // const oauth_token = req.cookies[COOKIE_NAME];
      const oauth_token = req.query.oauth_token;
      const { oauth_access_token, oauth_access_token_secret } = tokens[oauth_token]; 
      const response = await oauth.getProtectedResource("https://api.twitter.com/1.1/account/verify_credentials.json", "GET", oauth_access_token, oauth_access_token_secret);
       let twitterData = JSON.parse(response.data);
      if(twitterData){
         let user = await User.findOne({twitterUserId : twitterData.id_str});
         console.log(user)
         if(!user){
           let object = {};
           object.firstName = twitterData.name.split(" ")[0];
           object.lastName =  twitterData.name.split(" ")[1];
           object.twitterHandleName = twitterData.screen_name;
           object.twitterUserId = twitterData.id_str;
           let userInfo = await new User(object);
           let getUser = await userInfo.save();
           console.log(getUser);
           return res.json({
             getUser
           })
         
         }else{
           return res.json({
             user
           })
         }

       }
    //  res.json(JSON.parse(response.data));
    } catch(error) {
      res.status(403).json({message: "Missing, invalid, or expired tokens"});
    } 
  },

  logoutFromTwitter : async (req,res) => {
    try {
      const oauth_token = req.cookies[COOKIE_NAME];
      delete tokens[oauth_token];
      res.cookie(COOKIE_NAME, {}, {maxAge: -1});
      res.json({success: true});
    } catch(error) {
      res.status(403).json({message: "Missing, invalid, or expired tokens"});
    } 
  },

   requireSignin : (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            console.log(user);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
};
