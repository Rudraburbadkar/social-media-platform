// import { useState, useEffect } from "react";
// import axios from "axios";

const Search = () => {
//   const [query, setQuery] = useState("");
//   const [userResults, setUserResults] = useState([]);
//   const [postResults, setPostResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const search = async () => {
//       if (!query || query.trim() === "") {
//         setUserResults([]);
//         setPostResults([]);
//         setError(null);
//         return;
//       }

//       try {
//         setIsSearching(true);
//         setError(null);
        
//         const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);
        
//         setUserResults(response.data.user || []);
//         setPostResults(response.data.posts || []);
//       } catch (err) {
//         console.error("Search error:", err);
//         setError(err.response?.data?.message || "Failed to perform search");
//         setUserResults([]);
//         setPostResults([]);
//       } finally {
//         setIsSearching(false);
//       }
//     };

//     // Add debounce to prevent too many API calls
//     const timer = setTimeout(() => {
//       search();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [query]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
//             Discover Content
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
//             Search for users, posts, or anything else you're interested in
//           </p>
//         </div>

//         <div className="relative max-w-2xl mx-auto mb-12">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>
//           <input
//             type="text"
//             placeholder="Search users, posts, or hashtags..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="block w-full pl-10 pr-4 py-3 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white transition-all duration-200"
//           />
//           {isSearching && (
//             <div className="absolute right-3 top-3 animate-spin">
//               <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg">
//             {error}
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Accounts Section */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//               <h2 className="text-xl font-bold flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 Accounts
//               </h2>
//             </div>
//             <div className="p-6">
//               {userResults.length > 0 ? (
//                 <div className="space-y-4">
//                   {userResults.map((user) => (
//                     <div 
//                       key={user._id}
//                       className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
//                     >
//                       <img 
//                         src={user.profilePic || "https://randomuser.me/api/portraits/men/1.jpg"} 
//                         alt={user.username} 
//                         className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-400"
//                       />
//                       <div className="ml-4">
//                         <h3 className="font-semibold text-gray-900 dark:text-white">@{user.username}</h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-300">{user.name}</p>
//                       </div>
//                       <button className="ml-auto px-4 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200">
//                         Follow
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
//                   <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                     {query ? "Try a different search term" : "Start typing to search for users"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Posts Section */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//               <h2 className="text-xl font-bold flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
//                 </svg>
//                 Posts
//               </h2>
//             </div>
//             <div className="p-6">
//               {postResults.length > 0 ? (
//                 <div className="space-y-6">
//                   {postResults.map((post) => (
//                     <div 
//                       key={post._id}
//                       className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
//                     >
//                       {post.image && (
//                         <img 
//                           src={post.image} 
//                           alt={post.caption} 
//                           className="w-full h-48 object-cover"
//                         />
//                       )}
//                       <div className="p-4">
//                         <p className="text-gray-800 dark:text-gray-200 mb-3">{post.caption}</p>
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center">
//                             <img 
//                               src={post.author?.profilePic || "https://randomuser.me/api/portraits/men/1.jpg"} 
//                               alt={post.author?.username} 
//                               className="w-6 h-6 rounded-full mr-2"
//                             />
//                             <span className="text-sm text-gray-600 dark:text-gray-400">@{post.author?.username}</span>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                             </svg>
//                             {post.likesCount || 0}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
//                   <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                     {query ? "Try a different search term" : "Start typing to search for posts"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
 };

export default Search;