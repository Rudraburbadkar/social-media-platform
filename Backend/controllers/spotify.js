import { Router } from "express";
import fetch from "node-fetch";

const router = Router();


router.get("/trending", async (req, res) => {
  try {
    const limit = 20; 
    const country = "in"; 
    const url = `https://itunes.apple.com/${country}/rss/topsongs/limit=${limit}/json`;

    const response = await fetch(url);
    const data = await response.json();

    const songs = data.feed.entry.map((song) => ({
      id: song.id.attributes["im:id"],
      name: song["im:name"].label,
      artist: song["im:artist"].label,
      album: song["im:collection"]["im:name"].label,
      preview_url: song.link.find(l => l.attributes?.type?.includes("audio"))?.attributes?.href || null,
      external_url: song.link[0].attributes.href,
      image: song["im:image"][2].label,
    }));

    res.json({ success: true, songs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch trending songs" });
  }
});

// Search songs
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ success: false, message: "Search query required" });

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=10`;
    const response = await fetch(url);
    const data = await response.json();

    const songs = data.results.map((track) => ({
      id: track.trackId,
      name: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      preview_url: track.previewUrl,
      external_url: track.trackViewUrl,
      image: track.artworkUrl100,
    }));

    res.json({ success: true, songs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to search songs" });
  }
});

export default router;
