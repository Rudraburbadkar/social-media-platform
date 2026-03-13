import React, { useState } from 'react'
import TrendingAudioSelector from '../components/TrendingAudioSelector';
import api from '../api/api';

const CreatePost = () => {
    const [caption,setCaption] = useState("");
    const [tags,setTags] = useState("");
    const [mediaFiles,setMediaFiles] = useState([]);
    const [type,setType] = useState("post");
    const [selectedAudio,setSelectedAudio] = useState(null);
    const [mediaPreviews,setMediaPreviews] = useState([]);

   const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  
  setMediaFiles(prev => [...prev, ...files]);

  const previews = files.map(file => ({
    url: URL.createObjectURL(file),
    type: file.type.startsWith("image") ? "image" : "video"
  }));

  setMediaPreviews(prev => [...prev, ...previews]);
     
  e.target.value = null; 
  
};

 
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!caption || mediaFiles.length === 0) {
    return alert("caption and media required");
  }

  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("tags", tags);

  if (selectedAudio) {
    formData.append("audio", JSON.stringify(selectedAudio));
  }

  for (let file of mediaFiles) {
    formData.append("media", file);
  }

  try {
    if(type){
const res = await api.post(`/api/v1/post/create-post?type=${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (res.data.success) {
      alert(res.data.message);
      setCaption("");
      setTags("");
      setMediaFiles([]);
      setSelectedAudio(null);
      setMediaPreviews([]);
    }
    }
    
  } catch (err) {
    console.error("Post error:", err);
    alert("Error creating post");
  }
};


  

  return (
   <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12 border border-gray-200">
  <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">📤 Create a New Post</h2>

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Media Previews */}
    {mediaPreviews?.length > 0 && (
      <div className="grid grid-cols-2 gap-4 mt-2">
        {mediaPreviews.map((media, index) =>
          media.type === "image" ? (
            <img
              key={index}
              src={media.url}
              alt="preview"
              className="w-full h-44 object-cover rounded-xl border"
            />
          ) : (
            <video
              key={index}
              src={media.url}
              controls
              className="w-full h-44 object-cover rounded-xl border"
            />
          )
        )}
      </div>
    )}

    {/* File Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Media</label>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                   file:rounded-md file:border-0 file:text-sm file:font-semibold 
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>

    {/* Caption */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border rounded-xl px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
        rows={4}
        required
      />
    </div>
    

    {/* Tags */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
      <input
        type="text"
        placeholder="e.g., nature, travel, art"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border rounded-xl px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
      <TrendingAudioSelector onSelect={setSelectedAudio} />
       {selectedAudio && (
  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
    <h3 className="text-lg font-bold">Selected Song</h3>

    {selectedAudio.image && (
      <img
        src={selectedAudio.image}
        alt={selectedAudio.name || "Song cover"}
        className="w-12 h-12 rounded-full mr-2"
      />
    )}

    <p className="text-gray-800">
      🎵 {selectedAudio.name || "Unknown"} - {selectedAudio.album || "Unknown Album"}
    </p>

    {selectedAudio.preview_url && (
      <audio controls src={selectedAudio.preview_url}></audio>
    )}
  </div>
)}
    {/* Post Type */}
    <div >
      <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border rounded-xl px-4 py-2 border-gray-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="post" className='text-gray-800'>📄 Post</option>
        <option value="reel" className='text-gray-800'>🎥 Reel</option>
      </select>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition hover:bg-blue-700 active:scale-95"
    >
      🚀 Create Post
    </button>
  </form>
</div>

  )
}

export default CreatePost