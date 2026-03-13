import React, { useEffect, useState } from "react";
import api from "../api/api";
const TrendingAudioSelector = ({ onSelect }) => {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTrending = async () => {
      try {
        const res = await api.get("/api/v1/spotify/trending");
        console.log(res.data.songs);
        setSongs(res.data.songs);
        
      } catch (error) {
        console.error("Error fetching trending songs:", error);
      }
    setLoading(false);
  };

const searchSongs = async () => {
    if (!search.trim()) {
      fetchTrending();
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/spotify/search?q=${search}`);
      setSongs(res.data.songs);
    } catch (error) {
      console.error("Error searching songs:", error);
    }
    setLoading(false);
  };

 
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchSongs();
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [search]);


  useEffect(() => {
    fetchTrending();
  }, []);

 const handleSelect = (song,e) => {
   e.stopPropagation();
  e.preventDefault();
  onSelect({
    title: song.name,
    album: song.album,
    preview_url: song.preview_url,
    image: song.image
  });
};


  return (
   <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow-lg border border-gray-200 mx-auto">
  <h2 className="text-xl font-bold text-gray-800 mb-4">🎧 Trending Audio</h2>

  <div className="mb-4">
    <input
      type="text"
      placeholder="Search song..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && searchSongs()}
      className="w-full px-3 py-2 text-sm border rounded-lg text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
    />
    <button
      onClick={searchSongs}
      className="mt-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition w-full text-sm"
    >
      🔍 Search
    </button>
  </div>

  {loading ? (
    <p className="text-center text-gray-500">Loading songs...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
      {songs.map((song) => (
        <div
          key={song.id}
          className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <img
              src={song.image}
              alt={song.title}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-gray-800 text-sm truncate">
                {song.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {song.album}
              </span>
            </div>
          </div>

          {song.preview_url && (
            <audio controls className="w-full mt-1 h-8">
              <source src={song.preview_url} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          )}

          <button
            onClick={() => handleSelect(song,e)}
            className="mt-1 bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600 transition text-xs"
          >
            Select
          </button>
        </div>
      ))}
    </div>
  )}

  {!loading && songs.length === 0 && (
    <p className="text-center text-gray-500">No songs found.</p>
  )}
</div>

  );
};

export default TrendingAudioSelector;
