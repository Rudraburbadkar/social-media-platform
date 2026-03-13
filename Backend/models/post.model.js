import mongoose, {Schema} from "mongoose";
 
const postSchema = new Schema({
    caption: {
        type: String,
        required: true
    },
    media: [{
        url : {
            type: String,
            required: true
        }
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    tags: [{
        type:String
    }],

    views: {
    type: Number,
    default: 0
},
viewedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
,
audio:{
    title: String,           
    album: String,         
    preview_url: String,       
    image: String,  
},
 type: {
   type: String,
   enum: ["post", "reel"],
   default: "post"
 },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
},
{ timestamps: true})

const Post = mongoose.model("Post", postSchema);
export default Post