import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/Ekart-YT`);
        console.log("Database connected successfully.");
        
    } catch (error) {
        console.log(`Error connecting database: ${error}`);
    }
}

export default connectDB;