import React, { useEffect, useState } from 'react';
import { FaHeart, FaComment, FaBookmark, FaShare } from 'react-icons/fa';


const PostCard = ({ post }) => {
    const [shortCaption, setshortCaption] = useState("");
const [caption, setCaption] = useState("Chhatrapati Shivaji Maharaj was a brave and visionary 17th-century Indian ruler who founded the Maratha Empire. He is renowned for his military genius, particularly his innovative use of guerrilla warfare tactics against the larger Mughal Empire. He established a progressive and efficient administration that prioritized the welfare of his people, regardless of their caste or religion. Shivaji's legacy continues to inspire generations with its emphasis on courage, justice, religious tolerance, and self-rule (Swarajya).");
const [isExpanded, setIsExpanded ] = useState(false);
 
useEffect(() => {
      if(caption.length > 100){
        setshortCaption(caption.substring(0, 100) + "...");
      }else{
        setshortCaption(caption);
      }
      
},[caption]);

const toggleExpand = () => {
   setIsExpanded((prev) => !prev);   
}
  return (
    <div className="w-[70%] bg-gray-200 rounded-lg shadow-md m-6 border-b border-b-gray-100">

      {/* Post Header */}
      <div className="flex items-center p-3 border-b">
        <img
          src={
            post?.user?.avatar ||
            'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg'
          }
          alt={post?.user?.username || 'rudra2142'}
          className="w-8 h-8 rounded-full mr-2 "
        />
        <span className="font-semibold text-black">{post?.user?.username || 'rudra2142'}</span>
      </div>

      {/* Post Image */}
      <div className="w-full max-h-[500px] bg-gray-200 overflow-hidden">
        <img
          src={
            post?.media ||
            'https://printitnice.com/wp-content/uploads/2023/12/16x20-chatrapati-shivaji-maharaj-canvas-poster-scaled-1.webp'
          }
          alt={post?.caption || 'Shivaji Maharaj poster'}
          className="w-full  object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-3 text-black">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button
              className={`${
                post?.likes?.includes(post?.user?._id)
                  ? 'text-red-500'
                  : 'text-black'
              } hover:text-red-500`}
            >
              <FaHeart size={24} />
            </button>
            <button className="text-black hover:text-gray-600">
              <FaComment size={24} />
            </button>
            <button className="text-black hover:text-gray-600">
              <FaShare size={24} />
            </button>
          </div>
          <button className="text-black hover:text-gray-600">
            <FaBookmark size={24} />
          </button>
        </div>

        {/* Likes */}
        <div className="font-semibold mb-1 text-black">
          <span className='mr-4'>{post?.likes?.length || 10} </span>
          <span className='mr-4'>{post?.caption?.length || 3}</span>
        </div>

        {/* Caption */}
        <div className="mb-1 text-black">
          <span className="font-semibold mr-2 text-black">
            {post?.user?.username || 'rudra321'}
          </span>

          {isExpanded ? caption : shortCaption}
          {caption.length > 100 && (
              <button onClick={toggleExpand} className='text-blue-500'>
                 {isExpanded ? "show less" : "show more"}
                </button>
          )}
          
        </div>

        {/* Timestamp */}
        <div className="text-black text-xs mt-2">
          {post?.timestamp || '2 hours ago'}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
