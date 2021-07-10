const _ = require("lodash");
const async = require("async");

const User = require("../models/user");
const Post = require("../models/post");
const Rating = require("../models/rating");
const { getState } = require("../interaction/reputations");

module.exports = {
  createPost: async (req, res) => {
    //New
    console.log(req);
    try {
      let obj = JSON.parse(JSON.stringify(req.body));
      console.log(req.body);
      console.log(obj);
      if (obj) {
        let postData = await new Post(obj);
        let savePostData = await postData.save();
        if (savePostData) {
          res.json({
            status: true,
            post: savePostData,
            message: "post created successfully",
          });
        }
      }
    } catch (err) {
      res.json({
        status: false,
        error: err,
      });
    }
  },

  getPostByTweetId: async (req, res) => {
    //new
    try {
      let tweetId = req.params.tweetId;
      let post = await Post.find({
        tweetId: tweetId,
      });
      if (post) {
        return res.json({
          status: true,
          post: post,
        });
      }
    } catch (err) {
      res.json({
        status: false,
        error: err,
      });
    }
  },

  getAllPostsModerator: async (req, res) => {
    try {
      let statusCondition;
      if (req.query.status == "active" || req.query.status == "inactive") {
        statusCondition = {
          status: req.query.status,
        };
      } else {
        statusCondition = {};
      }

      let allPost = await Post.find(statusCondition)
        .sort({ $natural: -1 })
        .populate("ratings");

      return res.json({
        status: true,
        posts: allPost,
      });
    } catch (err) {
      return res.json({
        status: false,
        error: err,
      });
    }
  },

  getAllPostsUser: async (req, res) => {
    try {
      let userId = req.params.userId;
      let allPost;
      if (req.query.all == "true") {
        allPost = await Post.find({ userId: userId });
      } else if (req.query.correct) {
        allPost = await Post.find({
          $and: [{ userId: userId }, { result: "negativeStatus" }]
        });
      } else if (req.query.wrong) {
        allPost = await Post.find({
          $and: [{ userId: userId }, { result: "positiveStatus" }]
        });
      }
     return res.json({
        status: true,
        posts: allPost,
      });
    } catch (err) {
      return res.json({
        status: false,
        error: err,
      });
    }
  },

  getAllPosts : async(req,res) => {
   try {
      let allPosts;
      allPosts = await Post.find({});
      res.json({
        status : true,
        posts :  allPosts
      })
   }catch(err){
      res.json({
        status : false,
        error : err
      })
   }
  },
  getAllPendingPost: async (req, res) => {
    try {
      let allPosts;
      let pendingPost = [];
      console.log(req.query)
      if(req.query.moderator == "true"){
        allPosts = await Post.find({}).sort({"bounty":-1});
       for (let i = 0; i < allPosts.length; i++) {
          let moderators = allPosts[i].moderatedBy;
          console.log(moderators)
          let index = moderators.indexOf(req.query.moderatorId);
          if (index == -1) {
            pendingPost.push(allPosts[i]);
          }
        }
      }
      if(req.query.user == "true"){
        allPosts = await Post.find({userId : req.query.userId}).sort({"bounty":-1});
        for (let i = 0; i < allPosts.length; i++) {
          let moderators = allPosts.moderatedBy;
         
          if (moderators == []) {
            pendingPost.push(allPosts[i]);
          }
        }
      }
     
      res.json({
        status: true,
        pendingPost: pendingPost,
      });
    } catch (err) {
      res.json({ status: false, error: err });
    }
  },

  getHandleReputation : async (req,res) => {
  try{
    let getAllTweets = await Post.find(  {$and: [{ result: "negativeStatus" }, { result: "positiveStatus" }]}).count();
   let getAllHandleNames =  await Post.distinct('twitterHandle');
   let holder = {};
   for(let i=0;i<getAllHandleNames.length;i++){
     let getPositiveTweets = await Post.find(  {$and: [{ twitterHandle: getAllHandleNames[i] }, { result: "positiveStatus" }]}).count();
     let ratio = (getPositiveTweets/getAllTweets)*100;
     if(!holder[getAllHandleNames[i]]){
       holder[getAllHandleNames[i]] = ratio;
     }
   }
   res.json({
     status : true,
     data : holder
   })
  
  }catch(err){
    res.json({
      status : false,
      error : err
    })
  }
  },

  getReputationPointsOfModerator : async (req, res) => {
  try{
     let moderatorId =  req.params.moderatorId;
     let ratings =  await Rating.find({ratedBy :  moderatorId});
     let getPostDetails;
     for(let i=0;i<ratings.length;i++){
       let postDetails =  await Post.find({_id : ratings[i].postId});
       if((ratings[i].ratingType == 'positive' && postDetails[0].result == 'positiveStatus') || (ratings[i].ratingType == 'negative' && postDetails[0].result == 'negativeStatus')){
        getPostDetails.push(postDetails[0]);
       }
     }
     res.json({
       status : true,
       data : getPostDetails
     })
  }catch(err){
    res.json({
      status : false,
      error :err
    })
  }
  },

  createTweetPost: async (req, res) => {
    try {
      let obj = JSON.parse(JSON.stringify(req.body));
      console.log(obj);
      if (obj.tweetLink) {
        let postData = await new Post(obj);

        postData.userId = "5fd5be37f33b95571a905592";
        let savePostData = await postData.save();

        if (savePostData) {
          res.json({
            status: true,
            post: savePostData,
            message: "post created successfully",
          });
        }
      }
    } catch (err) {
      res.json({
        status: false,
        error: err,
      });
    }
  },

  userById: async (req, res) => {
    User.findById(id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }

      req.user = user;
      req.session.user = user;
    });
  },
  getUser: async (req, res) => {
    let user = await User.findById({ _id: req.user._id });

    return res.json(user);
  },
  giveRating: async (req, res) => {
    try {
      console.log(req.body);
      // let ratings = await Rating.findOne({postId : req.body.postId});
      // console.log(ratings);
      // ratings.forEach((item) => {
      //   if(item.ratedBy == req.user._id){
      //     return res.json({
      //       status :  false,
      //       message : "You can't rate this post a you have done earlier"
      //     })
      //   }
      // })
      let ratingData = await new Rating(req.body);
      console.log("ratingData : ", ratingData);
      ratingData.ratedBy = req.query.moderatorId;
      console.log("saving data");
      let saveRating = await ratingData.save();
      console.log("saving data done");
      if (saveRating) {
        console.log("saveRating : ", saveRating);
        var postUpdate = await Post.findOneAndUpdate(
          { _id: req.body.postId },
          { $push: { ratings: saveRating._id, moderatedBy: req.query.moderatorId} },
          console.log(req.body.postId)
        );
        console.log("save rating data : done");
        
      }

      if (saveRating && postUpdate) {
        res.json({
          status: true,
          rating: saveRating,
        });
        
      }
    } catch (err) {
      res.status(400).json({
        status: false,
        error: err,
      });
    }
  },

  getBalance: async(req,res) => {
   try{
      let publicKey =  "zil1wpj09q84qy09jlksvvu4jphwakftlj3nspm5zd";
       let balance = await getState(publicKey);
       res.json({
         status : true,
         balance : balance
       })
   }catch(err){
     res.status(400).json({
       status : false,
       error : err
     })
   }
  }
};
