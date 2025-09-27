const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("Conncetion Successfull");})
.catch((err)=>{console.log(err);});
async function main() {
    await  mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const initDB=async ()=>{
await Listing.deleteMany({});
initData.data = initData.data.map((obj)=>({...obj, owner: new mongoose.Types.ObjectId("68beef9ae289ee8e1f1206a6")   // ✅ proper ObjectId
}));
await Listing.insertMany(initData.data);
console.log("Data was Initilaized");
}


initDB();