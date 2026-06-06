const express = require("express");
const router = express.Router();
const WrapAsync=require("../utils/WrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage });


//newroute
router.get("/new", isLoggedIn,WrapAsync(listingController.renderNewForm));

//index+create route
router.route ("/")
.get(WrapAsync(listingController.index))
.post(
  isLoggedIn,

   upload.single('image'),
    validateListing,
  WrapAsync(listingController.createListing)) 

  


// 🔍 Step 3 — Search Route
router.get("/search", WrapAsync(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.redirect("/listings");

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
    ],
  });

  res.render("listings/searchResults", { listings, searchQuery: q });
}));

//show+update+delete
router.route("/:id")
.get( WrapAsync(listingController.showListing))

.put(isLoggedIn,isOwner,
  upload.single('image'), 
   validateListing,
  WrapAsync(listingController.updateListing))
  
.delete(isLoggedIn,isOwner,  WrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  WrapAsync(listingController.renderEditForm));


module.exports = router; 