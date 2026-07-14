import mongoose from 'mongoose';

async function connectDB() {

    try {
        //console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI)

        console.log("Connected to Database")
    }
    catch (err) {
        console.log(err)
    }
}

export default connectDB;