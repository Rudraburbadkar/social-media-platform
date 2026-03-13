import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWt = async (req, res,next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");

        if(!token) {
            throw new Error(401 ,"Unauthorized request");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id)
        .select("-password -verifyCode -verifyCodeExpiry -refreshToken");

        if(!user){
            return res.status(401).json({message: "User not found"});
        }
        req.user = user; //create user object in req object
        next();

    } catch (error) {
        throw new Error(error, 401, "Unauthorized request");
    }
} 