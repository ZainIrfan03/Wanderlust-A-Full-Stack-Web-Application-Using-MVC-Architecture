const Listing = require("../models/listing");

const makePublicUrl = (rawPath) => {
  if (!rawPath) return null;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  let normalized = rawPath.replace(/\\/g, "/");
  const publicIndex = normalized.lastIndexOf("/public/");
  if (publicIndex !== -1) {
    normalized = normalized.slice(publicIndex + "/public".length);
  }
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }
  return normalized;
};

const normalizeImageData = (file) => {
  if (!file || !file.path) return null;
  const url = makePublicUrl(file.path);
  if (!url) return null;

  return {
    url,
    filename: file.filename || null,
  };
};

const normalizeListingImage = (listing) => {
  if (listing && listing.image && listing.image.url) {
    const normalizedUrl = makePublicUrl(listing.image.url);
    if (normalizedUrl) {
      listing.image.url = normalizedUrl;
    }
  }
};


module.exports.index = async (req,res)=>{
 const allListings= await Listing.find({});
allListings.forEach(normalizeListingImage);
 res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = async (req,res)=>{

 res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  console.log("showListing hit", req.params.id);
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path : "reviews",populate :{path : "author"},
  }).populate("owner");
  
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");  
  }
 normalizeListingImage(listing);
 console.log(listing);
  res.render("listings/show.ejs", { listing });
}

// module.exports.createListing = async (req, res, next) => {
//   let url = req.file.path;
//   let filename = req.file.filename;
//   console.log(url,"..",filename);
//   const newListing = new Listing(req.body.listing); 
//   newListing.owner = req.user._id; 
//   newListing.image = {url,filename};
//   await newListing.save();
//   req.flash("success", "New listing Created !!");
//   res.redirect("/listings");
// }
//controllers/listings.js

module.exports.createListing = async (req, res, next) => {
    try {
        // Non-file data is still accessible via req.body.listing
        if (!req.body || !req.body.listing) {
            req.flash("error", "Listing data is missing. Please fill all required fields.");
            return res.redirect("/listings/new");
        }

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        
        // Set default image if no file uploaded
        if (!req.file) {
            req.flash("error", "Please upload an image for the listing.");
            return res.redirect("/listings/new");
        }

        const imageData = normalizeImageData(req.file);
        if (!imageData) {
            req.flash("error", "Unable to process the uploaded image.");
            return res.redirect("/listings/new");
        }

        newListing.image = imageData;
        
        await newListing.save();
        req.flash("success", "New Listing Created Successfully!");
        res.redirect(`/listings/${newListing._id}`); 
    } catch (err) {
        req.flash("error", "Failed to create listing. Please try again.");
        return res.redirect("/listings/new");
    }
};


module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
const listing=await Listing.findById(id);
 if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");  // <-- return stops further execution
  }

normalizeListingImage(listing);

// Safely handle listings without an image
  let originalImageurl = null;
  if (listing.image && listing.image.url) {
    if (listing.image.url.includes("cloudinary")) {
      originalImageurl = listing.image.url.replace("/upload", "/upload/w_250");
    } else {
      originalImageurl = listing.image.url;
    }
  }
 res.render("listings/edit.ejs",{listing,originalImageurl});
}

module.exports.updateListing = async (req,res)=>{
    try {
        let {id} = req.params;
        
        // Check if listing exists first
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        // Update listing fields
        listing.title = req.body.listing.title;
        listing.description = req.body.listing.description;
        listing.location = req.body.listing.location;
        listing.country = req.body.listing.country;
        listing.price = Number(req.body.listing.price) || 0;

        // Handle image update if a new file is uploaded
        if (req.file) {
            const imageData = normalizeImageData(req.file);
            if (imageData) {
                // Delete old image from Cloudinary if it exists (optional - you can add this later)
                listing.image = imageData;
            } else {
                req.flash("error", "Unable to process the uploaded image.");
                return res.redirect(`/listings/${id}/edit`);
            }
        }
        
        await listing.save();
        req.flash("success", "Listing Updated Successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error", "Failed to update listing. Please try again.");
        if (req.params && req.params.id) {
            return res.redirect(`/listings/${req.params.id}/edit`);
        }
        return res.redirect("/listings");
    }
}

module.exports.destroyListing = async (req,res)=>{
  // if(!req.body.listing){
  //  throw new Expresserror(400, "Send Valid Data For Listing");
  // }
    let{id}=req.params;
  let deletelisting = await  Listing.findByIdAndDelete(id);
  console.log(deletelisting);
  req.flash("success", "listing Deleted !!");
res.redirect("/listings");
}