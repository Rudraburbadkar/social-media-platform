import Post from "../models/post.model.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


//create post
const createPost = async (req, res) => {
    try {
        const {caption,tags,audio} = req.body;
        const author = req.user._id;
        const files = req.files;
        const type = req.query.type; //http://localhost:5713/post?type=post or reel

        if(!caption || !files || req.files.length === 0){
           return res.status(400).json({message:"No media found",success:false}); 
        }

        //upload on cloudinary
       const media = await Promise.all(
    files.map(async file => {
        const result = await uploadOnCloudinary(file.path);
        return { url: result.secure_url };
    })
);

    
    const parsedTags = tags ? tags.split(",").map(tag => tag.trim()) : [];
     
    const post = await Post.create({
        caption,
        media,
        author,
        tags:parsedTags,
        audio: audio ? JSON.parse(audio) : null,
        type
    })
    
    return res.status(200).json({message:"Post created successfully", post:post,success:true});
    
    } catch (error) {
        console.log(error,"create post error");
        
    }
}

//get all post with  reels
const getAllPosts = async (req,res) =>{
    try {
        const posts = await Post.find({}).populate({
            path:"author",
            select:"username profilePic"
        })
        .populate({
            path:"comments"
        })
        .sort({createdAt:-1});
        return res.status(200).json({message:"Posts fetched successfully",posts,success:true});
    } catch (error) {
        console.log(error,"get all posts error");
         return res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
      success: false
    });
        
    }
}

//get All posts by type
const getAllPostsReels = async (req,res) =>{
    try {
         const type = await req.query.type;
         const posts = await Post.find({type:type}).populate({
            path:"author",
            select:"username profilePic"
        })
        .populate({
            path:"comments"
        })
        .sort({createdAt:-1});
        return res.status(200).json({message:"Posts fetched successfully",posts,success:true});
    
    } catch (error) {
        console.log(error,"get all posts by type error");
         return res.status(500).json({
      message: "Failed to fetch posts by type",
      error: error.message,
      success: false
    });
        
    }
}

//get post by id
const getPostById = async (req,res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate({
            path:"author",
            select:"username profilePic"
        }).populate({
            path:"comments"
        })
        if(!post.viewedBy.includes(req.user._id)){
           post.views += 1;
           post.viewedBy.push(req.user._id); 
           await post.save({validateBeforeSave:false});
        }
        
        
        
        return res.status(200).json({message:"Post fetched successfully",post,success:true});
        
    } catch (error) {
        console.log(error,"get post by id error");
        return res.status(500).json({
          message: "Failed to fetch post by id",
          success: false  
        })
        
    }   
}

//update post
const updatePost = async (req,res) => {
     try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const {caption,tags,audio} = req.body;
        if(!post || post.author.toString() !== req.user._id){
           return res.status(400).json({message:"You are not authorized to update this post",success:false});   
        }
        if(caption) post.caption = caption;
        if(tags) post.tags = tags.split(",").map(tag => tag.trim());
        if(audio) post.audio = JSON.parse(audio);
        
        await post.save({validateBeforeSave:false});
        return res.status(200).json({message:"Post updated successfully",post,success:true});
     } catch (error) {
        console.log(error,"update post error");
        return res.status(500).json({
          message: "Failed to update post",
          success: false      
        })
     }
}

//delete post
const deletePost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post || post.author.toString() !== req.user._id){
            return res.status(400).json({message:"You are not authorized to delete this post",success:false});
        }
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"Post deleted successfully",success:true});
    } catch (error) {
        console.log(error,"delete post error");
        res.status(500).json({
          message: "Failed to delete post",
          success: false      
        })
        
    }
}

//like post
const likeAndUnLikePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({message:"Post not found",success:false});
        }
        const isLiked = post.likes.includes(req.user._id);
        let updatedPost;
        if(isLiked){
            
           updatePost= await Post.findByIdAndUpdate(
                postId,
                {$pull:{likes:req.user._id}}, 
                {new:true});

            return res.status(200).json({message:"Post unliked successfully",post:updatePost,success:true});
        }else{
           updatePost = await Post.findByIdAndUpdate(
            postId,
            {$push:{likes:req.user._id}},
            {new:true});

            return res.status(200).json({message:"Post liked successfully",post: updatePost,success:true});
        }

        
    } catch (error) {
        console.log(error,"like post error");
        return res.status(500).json({
            message: "Failed to like post",
            success: false
        })
               
    }
}

//get post by user
const getPostByUser = async (req,res) => {
    try {
        const userId = req.params.id;
        const posts = await Post.find({author:userId}).populate({
          path:"author",
          select:"username profilePic"  
        }).sort({createdAt:-1});
        return res.status(200).json({message:"Posts fetched successfully",posts,success:true});
    } catch (error) {
        console.log(error,"get post by user error");
        
    }   

}

//get post by tag
const getPostByTag = async (req,res) => {
    try {
        const tag = req.params.tag;
        const posts = await Post.find({tags:tag}).populate({
          path:"author",
          select:"username profilePic"  
        }).sort({createdAt:-1});
        return res.status(200).json({message:"Posts fetched successfully",posts,success:true});
    } catch (error) {
        console.log(error,"get post by tag error");
        
    }   
}

//view increment
const viewPost = async (req,res) => {
  try {
      const userId = req.user._id;
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if(!post.viewedBy.includes(userId)){
         post.views += 1;
         post.viewedBy.push(userId); 
         await post.save({validateBeforeSave:false});
      }
      return res.status(200).json({message:"Post viewed successfully",success:true});
  } catch (error) {
    console.log(error,"view post error");
    return res.status(500).json({
        message: "Failed to view post",
        success: false
    })
  }   
}

//search
const searchAll = async (req,res) => {
   try {
       const {query} = req.query;
       if(!query || query.trim() === ""){
           return res.status(400).json({message:"Please enter a valid search query",success:false});
       }

       const regex = new RegExp(query, "i"); //use i for case insensitive
       const user = await User.find({
         $or:[
            {username:{$regex:regex}},
            {name:{$regex:regex}}
         ]
       }).select("username name profilePic");
       if(!user || user.length === 0){
           return res.status(400).json({message:"No user found",success:false});
       }

       //find posts by tags or caption
       const posts = await Post.find({
        $or:[
            {caption: {$regex:regex}},
            {tags:{$regex:regex}}
        ]
       }).populate({
        path:"author",
        select:"username profilePic"
       }).sort({createdAt:-1});

       if(!posts || posts.length === 0){
           return res.status(400).json({message:"No posts found",success:false});
       }

       return res.status(200).json({message:"Search results",user,posts,success:true});
   } catch (error) {
    console.log(error,"search post error");
    
   }   

}





export {createPost,
  getAllPosts,
  getAllPostsReels,
  getPostById,
  updatePost,
  deletePost,
  likeAndUnLikePost,
  getPostByUser,
  getPostByTag,
  viewPost,
  searchAll}