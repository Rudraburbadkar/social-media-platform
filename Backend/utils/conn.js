import mongoose from "mongoose";
const connectDB = async () =>{
    try {
        const conn =await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(` ✅🧑‍💻Mongodb connected to ${conn.connection.host}`);
        
    } catch (error) {
        console.log(error,"Mongodb connection error");
        process.exit(1);
        
    }
}

export default connectDB;