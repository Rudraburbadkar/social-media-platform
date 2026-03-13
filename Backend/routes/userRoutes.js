import { Router } from "express";
import {  registerUser,
    verifyEmail,
    resendVerificationCode,
    login,
    logoutUser,
    refreshToken,
    getProfile,
    editProfile,
    suggestedUsers,
    followOrUnfollowUser,
    changeCurrentPassword,
    resetPassword,
    verifyCodeAndResetPassword,
    deleteUser,
    getAllMyPosts} from '../controllers/userControllers.js'
import { verifyJWt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";
const router = Router();

//public routes
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-code", resendVerificationCode);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/reset-password", resetPassword);
router.post("/verify-code-reset-password", verifyCodeAndResetPassword);

//protected routes
router.use(verifyJWt);
router.post("/logout", logoutUser);
router.get("/profile/:id", getProfile);
router.put("/edit-profile",upload.single("profilePic"), editProfile);
router.get("/suggested-users", suggestedUsers);
router.post("/follow-unfollow-user/:id", followOrUnfollowUser);
router.put("/change-password", changeCurrentPassword);
router.delete("/delete-account", deleteUser);
router.get("/my-posts", getAllMyPosts);


export default router;