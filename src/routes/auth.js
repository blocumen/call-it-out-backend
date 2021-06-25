const express = require("express");

const authController = require("../controllers/auth");
const tweetController = require("../controllers/tweet");

const router = express.Router();

router.post("/userSignUp", authController.signup);
router.post('/userSignin', authController.signin);
router.get('/getTweetData',tweetController.getTweets);
router.post('/twitter/oauth/request_token',authController.getTwitterRequestOathToken);
router.post('/twitter/oauth/access_token',authController.getTwitterAccessOathToken);
router.get("/twitter/users/profile_banner",authController.getTwitterUserProfileBanner);
router.post("/twitter/logout",authController.logoutFromTwitter);

module.exports = router;
