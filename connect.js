const mongoose=require('mongoose');

async function connectToMongoDb(url){
try {
    await mongoose.connect(url);
    console.log("Connected to mongoDb")

    
} catch (error) {
    console.error("Error connecting to mongoDb:",error.message);
    throw error;
}

}
module.exports={
    connectToMongoDb,
}