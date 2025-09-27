  const express = require("express");
  const user = require("../models/user");
  const router = express.Router();
  const User = require("../models/user.js");
  const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.RenderSignupForm)
.post(WrapAsync(userController.signup));

router.route("/login")
.get((userController.RenderLoginForm))
.post(saveRedirectUrl,  passport.authenticate("local"
    ,{failureRedirect:'/login', failureFlash : true }),
    userController.Login
   )


  router.get("/logout",userController.Logout);


     module.exports= router;