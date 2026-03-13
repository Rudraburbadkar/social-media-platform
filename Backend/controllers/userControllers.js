import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { generateVerifyCode, getExpiryDate } from "../utils/generateCode.js";
import { sendVerifyEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import Post from "../models/post.model.js";


const generateAccessAndRefreshToekn = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error, "generate access and refresh token error");

    }
}
const registerUser = async (req, res) => {
    try {
        const { username, email, password,name } = req.body;
        if (!username || !email || !password || !name) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const code = generateVerifyCode();
        const expiryDate = getExpiryDate();
        const newUser = await User.create({
            username,
            email,
            name,
            password: hashedPassword,
            verifyCode: code,
            verifyCodeExpiry: expiryDate
        });

        //send verification email
        sendVerifyEmail(email, code);
        return res.status(201).json({
            message: "User registered successfully. check your email for verification",
            email: newUser.email,

        }

        );

    } catch (error) {
        console.log(error, "user register error");
        console.error("registration error:", error);
        res.status(401).json({ message: "User registration failed" });
    }
}


//Verify email 
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!(email && code)) {
            return res.status(400).json({ message: "Please fill all the fields", success: false });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }
        if (user.verifyCodeExpiry < new Date()) {
            return res.status(400).json({ message: "Verification code expired" });
        }
        if (user.verifyCode !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        user.isVerified = true;
        user.verifyCode = null;
        user.verifyCodeExpiry = null;
        await user.save();

        return res.status(200).json({
            message: "User verified successfully",
            user
        });
    } catch (error) {
        console.log(error, "Verify email error");

    }
}


//Resend verifucation code

const resendVerificationCode = async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        const code = generateVerifyCode();
        const expiryDate = getExpiryDate();

        user.verifyCode = code;
        user.verifyCodeExpiry = expiryDate;
        await user.save();

        sendVerifyEmail(email, code);

        return res.status(200).json({ message: "Verification code resent successfully" });
    } catch (error) {
        console.log(error, " resend verification code error");

    }

}

//login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: "User not verified" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToekn(user._id);

        const loggedInUser = await User.findById(user._id)
            .select("-password -verifyCode -verifyCodeExpiry -refreshToken");
         
        const myPosts = await Post.find({ author: user._id })
        
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",

        }
        return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "User logged in successfully",
                user: loggedInUser,
                posts: myPosts,
                success: true,
                

            })

    } catch (error) {
        console.log(error, "login error");

    }
}

//Logout user 
const logoutUser = async (req, res) => {
    try {
        User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            }, {
            new: true
        }
        )
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",

        }
        return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        console.log(error, "logout error");

    }
}

//Refresh token 
const refreshToken = async (req, res) => {
    const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshtoken) {
        return res.status(400).json({ message: "Unauthorized request" });
    }
    try {
        const decoded = jwt.verify(incomingRefreshtoken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded?._id);
        if (!user) {
            return res.status(400).json({ message: "Unauthorized request" });
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToekn(user._id);
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",

        }
        return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "Token generated successfully"
            })

    } catch (error) {
        console.log(error, "refresh token error");

    }
}

//Get User profile
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
            .populate({ path: "posts", createdAt: -1 })
            .populate({ path: "following", select: "username profilepic", options: { sort: { createdAt: -1 }, limit: 10 } })
            .populate({ path: "followers", select: "username profilepic", options: { sort: { createdAt: -1 }, limit: 10 } })
            .populate({ path: "bookmarks", options: { sort: { createdAt: -1 } } })
            .lean();

        return res.status(200).json(
            {
                message: "User profile fetched successfully", user,
                followingCount: user.following.length,
                followersCount: user.followers.length,
                success: true
            }
        )
    } catch (error) {
        console.log(error, "get profile error");

    }
}

//edit profile
const editProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, bio } = req.body;
        let profilePic;

        if (req.file?.path) {
            const profileimg = await uploadOnCloudinary(req.file?.path);

            if (!profileimg) {
                return res.status(400).json({ message: "Profile picture upload failed", success: false });
            }
            console.log("profile img", profileimg);

            profilePic = {
                url: profileimg?.secure_url,
                publicId: profileimg?.public_id
            };
        }
        // prepare the update object
        const updateFields = {};
        if (name) updateFields.name = name;
        if (bio) updateFields.bio = bio;
        if (profilePic) updateFields.profilePic = profilePic;

        //update only if at least one field is present
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update", success: false });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: updateFields

            },
            {
                new: true
            }
        ).select("-password -verifyCode -verifyCodeExpiry -refreshToken");

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        })

    } catch (error) {
        console.log("edit profile error", error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}

// suggested Users
const suggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.user._id } }).select("-verifyCode -verifyCodeExpiry -refreshToken -password").limit(6).sort({ createdAt: -1 });

        if (!suggestedUsers) {
            return res.status(400).json({ message: "No suggested users found" });
        }
        return res.status(200).json({
            message: "Suggested users fetched successfully",
            suggestedUsers,
            success: true

        });


    } catch (error) {
        console.log(error, "suggested users error");
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

//followOrUnfollowUser
const followOrUnfollowUser = async (req, res) => {
    try {
        const followkarnewala = req.user._id;
        const jiskoFollowKarega = req.params.id;

        if (followkarnewala === jiskoFollowKarega) {
            return res.status(400).json({
                message: "You cannot follow yourself",
                success: false
            });
        }
        const user = await User.findById(followkarnewala);
        const targetUser = await User.findById(jiskoFollowKarega);

        if (!targetUser || !user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const isFollowing = user.following.includes(jiskoFollowKarega);
        if (isFollowing) {
            //unfollow user 
            await Promise.all([ // promise.all() is used when we have to do multiple tasks at once
                user.updateOne({ _id: followkarnewala }, {
                    $pull:
                        { following: jiskoFollowKarega }
                }),
                targetUser.updateOne({ _id: jiskoFollowKarega }, {
                    $pull: {
                        followers: followkarnewala
                    }
                })
            ])
            return res.status(200).json({
                message: "User unfollowed successfully",
                success: true
            });
        } else {
            //follow user 
            await Promise.all([
                user.updateOne({ _id: followkarnewala }, {
                    $push: {
                        following: jiskoFollowKarega
                    }
                }),
                targetUser.updateOne({ _id: jiskoFollowKarega }, {
                    $push: {
                        followers: followkarnewala
                    }
                })
            ])
            return res.status(200).json({
                message: "User followed successfully",
                success: true
            });
        }
    } catch (error) {
        console.error("follow or unfollow user error", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

//Todo 
//blockUser
//unblockUser
//reportuser

//change password
const changeCurrentPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, conformPassword } = req.body;

        if (!(oldPassword && newPassword && conformPassword)) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect", success: false });
        }

        if (newPassword !== conformPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match", success: false });

        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false })

        return res.status(200).json({ message: "Password changed successfully", success: true });
    } catch (error) {
        console.log(error, "change password error");

    }
}

//resetPasswort
const resetPassword = async (req, res) => {
    const { email, newPassword, conformPassword } = req.body;
    try {
        if (!(email && newPassword && conformPassword)) {
            return res.status(400).json({ message: "Please fill all the fields", success: false });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User does not exist", success: false });

        }
        if (newPassword !== conformPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match", success: false });
        }
         const code = generateVerifyCode();
         const expiryDate = getExpiryDate();
         const hashedCode = await bcrypt.hash(code , 10);
         const hashedPassword = await bcrypt.hash(newPassword, 10);
         user.verifyCode = hashedCode;
         user.verifyCodeExpiry = expiryDate;
         user.tempPassword  = newPassword;
         await user.save({ validateBeforeSave: false});

         sendVerifyEmail(email,code);
         return res.status(200).json({ message: "Password reset link sent successfully", success: true });

        } catch (error) {
            console.log(error, "reset password error");
            
           return res.status(500).json({ message: "Internal server error", success: false });
        }
    }

  //verifyCodeAndResetPassword
    const verifyCodeAndResetPassword = async (req, res) => {
        try {
            const {email,code} = req.body;
            if (!(email && code)) {
                return res.status(400).json({ message: "Please fill all the fields", success: false });
            }
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "User does not exist", success: false });
            }
            const hashedCode = user.verifyCode;
            const isMatch = await bcrypt.compare(code, hashedCode);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid verification code", success: false });
            }
            if (user.verifyCodeExpiry < new Date()){
                return res.status(400).json({ message: "Verification code expired", success: false });
            }

            user.password = user.tempPassword;
            user.tempPassword = null;
            user.verifyCode = null;
            user.verifyCodeExpiry = null;
            await user.save({ validateBeforeSave: false });
            return res.status(200).json({ message: "Password reset successfully", success: true });
            
        } catch (error) {
            console.log(error, "verify code and reset password error");
            
        }
    }

//delete user
const deleteUser = async (req, res) => {
    try{
       const userId = req.user._id;
       const password = req.body;

       if(!password){
        return res.status(400).json({message:"Please fill all the fields",success:false}
        )
       }
       const user = await User.findById(userId);
       
       const isMatch = await user.comparePassword(password);
       if(!isMatch){
        return res.status(400).json({message:"Password is incorrect",success:false})
       }
      
       await Post.deleteMany({author:userId})

       await User.updateMany({
        followers:userId // match users who have userId in followers
       },
       {
        $pull:{
            followers:userId //remove userId from followers array
        }
       }
       )

       await User.updateMany({
        following:userId
       },
       {
        $pull:{
            following:userId
        }
       }
       )

       await User.findByIdAndDelete(userId);

       return res.status(200).json({message:"User deleted successfully",success:true})
    }catch(error){
        console.log(error, "delete user error");
        
    }
}

//get all my post and reels
  const getAllMyPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const type = req.query.type;
        const query = { author: userId};
        if(type){
            query.type = type
        }
        const posts = await Post.find(query).populate({
            path: "author",
            select: "username profilePic"
        })
        .populate({
            path:"comments"
        })
        .sort({ createdAt: -1 });
        return res.status(200).json({ message: "Posts fetched successfully", posts, success: true });
    } catch (error) {
        console.log(error, "get all my posts error");
         return res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
      success: false
    });
    }
}

//Todo 
//blockUser
//unblockUser
//reportuser

export { registerUser, verifyEmail,editProfile , getProfile, followOrUnfollowUser , suggestedUsers , login, resetPassword, verifyCodeAndResetPassword, deleteUser , resendVerificationCode , changeCurrentPassword, refreshToken, logoutUser,getAllMyPosts};