if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}


const express= require("express");
const app = express();
const port = 8080;
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Expresserror = require("./utils/Expresserror.js");
const session =require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { url } = require('inspector');

const dbUrl = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("Connection Successfull");})
.catch((err)=>{console.log(err);});
async function main() {
    await  mongoose.connect(dbUrl);
}
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.set(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static(path.join(__dirname, "public"))); 

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
      secret : process.env.SECRET,
    },
    touchAfter :24*3600,
  });

  store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
  });

const sessionOptions = ({
     store,
     secret :  process.env.SECRET,
     resave:false ,
     saveUninitialized: true,
     cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true,
     },
    });


  
// app.get("/",(req,res)=>{
//   res.send("Server running well");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});





app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email : "zainirfan4162@gmail.com",
//     username : "zain-jutt41"
//   });

//  let registeredUser= await User.register(fakeUser,"Hello world");
//  res.send(registeredUser);
// }) 




app.use((req, res, next) => {
  return next(new Expresserror(404, "Request Not Found"));
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Page not found" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});


app.listen(port, ()=>{
    console.log("Port is listening at 8080");
});
