const Listing = require("./models/listing");
const Review = require("./models/review");
const Expresserror = require("./utils/Expresserror.js");
const { listingSchema,reviewSchema }=require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
  req.flash("error","You must need to logged in to create Listing!!");
  return res.redirect("/login");
}
next();
 }

 module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
 };


  module.exports.isOwner =async  (req,res,next)=>{
    try {
        let {id}=req.params;
        let listing = await Listing.findById(id);
        
        if(!listing) {
            req.flash("error","Listing not found");
            return res.redirect("/listings");
        }
        
        if(!listing.owner || !listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","You are not the owner of the listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        req.flash("error","Error checking ownership");
        return res.redirect("/listings");
    }
  }

//  module.exports.validateListing=(req,res,next)=>{
// let {error}= listingSchema.validate(req.body);

// if(error){
  
//   let errMsg=error.details.map((el)=>el.message).join(",");
//   throw new Expresserror(400,errMsg); 
// }else{
//   next();
// }
// };

// middleware.js

module.exports.validateListing = (req, res, next) => {
    try {
        // ✅ FIX: Handle multipart form data - multer processes files but body parser handles form fields
        // Check if req.body exists and has listing data
        if (!req.body || !req.body.listing) {
            // This handles cases where the form data is missing or malformed
            req.flash("error", "Listing data is missing. Please ensure all required fields are submitted.");
            if (req.params && req.params.id) {
                return res.redirect(`/listings/${req.params.id}/edit`);
            }
            return res.redirect("/listings/new");
        }

        // Validate the nested object (req.body.listing)
        // Note: image field is optional in validation since it comes from multer (req.file)
        let { error } = listingSchema.validate(req.body); 

        if (error) {
            let errMsg = error.details.map((el) => el.message).join(", ");
            req.flash("error", errMsg);
            if (req.params && req.params.id) {
                return res.redirect(`/listings/${req.params.id}/edit`);
            }
            return res.redirect("/listings/new");
        } else {
            next();
        }
    } catch (err) {
        req.flash("error", "Validation error occurred. Please check your input.");
        if (req.params && req.params.id) {
            return res.redirect(`/listings/${req.params.id}/edit`);
        }
        return res.redirect("/listings/new");
    }
};

module.exports.validateReview = (req, res, next) => {
   if (!req.body.review) {
     throw new Expresserror(400, "Review data is required");
   }
   
   let { error } = reviewSchema.validate(req.body);
   
   if (error) {
     let errMsg = error.details.map((el) => el.message).join(",");
     throw new Expresserror(400, errMsg);
   } else {
     next();
   }
 };

 module.exports.isReviewAuthor = async  (req,res,next)=>{
    let {id,reviewId}=req.params;
     let review = await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not the author of this review");
     return res.redirect(`/listings/${id}`);
     }
     next();
  }