const express = require("express");

const postController = require("../controllers/post");
const { requireSignin } = require('../controllers/auth');

const router = express.Router();

router.post("/createPost" , postController.createPost);  //New t
router.get("/getPostByTwitterId/:tweetId",postController.getPostByTweetId); //New t
router.get("/getAllPostsModerator",postController.getAllPostsModerator); //New t
router.get("/getAllPostsUser/:userId",postController.getAllPostsUser); //New t
router.get("/dashboardPostPending",postController.getAllPendingPost); // New t
router.get("/getHandleReputation",postController.getHandleReputation); //New
router.get("/getReputationPointsOfModerator/:moderatorId",postController.getReputationPointsOfModerator); //New
router.post("/createPostTweet" , postController.createTweetPost);
router.get("/getUser",requireSignin,postController.getUser);
router.post("/giveRating",requireSignin,postController.giveRating);//New





module.exports = router;
