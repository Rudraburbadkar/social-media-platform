import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getAllPostsReels,
  getPostById,
  updatePost,
  deletePost,
  likeAndUnLikePost,
  getPostByUser,
  getPostByTag,
  viewPost,
  searchAll
} from "../controllers/postController.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = Router();

//public routes
router.get("/", getAllPosts);
router.get("/all-posts-reels", getAllPostsReels);  //by type
router.get("/post/:id", getPostById);
router.get("/post-by-user/:id", getPostByUser);
router.get("/post-by-tag/:tag", getPostByTag);


//protected routes
router.use(verifyJWt);
router.post("/create-post", upload.array("media", 5), createPost); // type
router.put("/update-post/:id", updatePost);
router.delete("/delete-post/:id", deletePost);
router.patch("/like-post/:id", likeAndUnLikePost);
router.put("/view-post/:id", viewPost);
router.post("/searchAll",searchAll);

export default router;