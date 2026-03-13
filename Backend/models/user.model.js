import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
        required: false,
        default: null

    },
    verifyCodeExpiry: {
        type: Date,
        required: false,
        default: null
    },
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        url: String, // secure_url to show image 
        publicId: String  // publlic_id to delete image
    },
    refreshToken:{
      type: String
    },
    tempPassword: {
        type: String
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]

}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hash(this.password, 10);
        next();
    }
    next();

})

userSchema.methods.comparePassword = async function (password) {
 if(!password) throw new Error("Password is required");
 
 const isMatch = await bcrypt.compare(password, this.password);
 return isMatch
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"})
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,

    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
}

export const User = mongoose.model("User", userSchema);