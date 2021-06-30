const express = require("express");

const postController = require("../controllers/post");
const { requireSignin } = require('../controllers/auth');

const router = express.Router();

router.post("/createPost" , postController.createPost);  //New
router.get("/getPostByTwitterId/:tweetId",postController.getPostByTweetId); //New
router.get("/getAllPostsModerator",postController.getAllPostsModerator); //New
router.get("/getAllPostsUser/:userId",postController.getAllPostsUser); //New
router.get("/dashboardPostPending",postController.getAllPendingPost); // New
router.get("/getHandleReputation",postController.getHandleReputation); //New
router.get("/getReputationPointsOfModerator/:moderatorId",postController.getReputationPointsOfModerator);
router.post("/createPostTweet" , postController.createTweetPost);
router.get("/getUser",requireSignin,postController.getUser);
router.post("/giveRating",requireSignin,postController.giveRating);





module.exports = router;
