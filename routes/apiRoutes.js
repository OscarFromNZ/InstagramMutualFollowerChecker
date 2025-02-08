const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/api/next-article', async (req, res) => {
    try {
      // First call: get a random summary
      const summaryResponse = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
      const summaryData = await summaryResponse.json();
  
      const title = summaryData.title;
      const extract = summaryData.extract;
      // If no thumbnail in summary, we might still find one in media
      const fallbackThumbnail = summaryData.thumbnail?.source || null;
      const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
  
      // Second call: get media info for that page
      // We'll attempt to get the "largest" image from the array
      const mediaResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media/${encodeURIComponent(title)}`);
      const mediaData = await mediaResponse.json();
  
      const biggestImage = findLargestImage(mediaData);
      // If no images are found, fallback to the random summary thumbnail or null
      const finalImage = biggestImage || fallbackThumbnail;
  
      res.json({
        title: title,
        extract: extract,
        thumbnail: finalImage,  // This will (hopefully) be the large image
        url: wikiUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch article.' });
    }
  });
  
  /**
   * findLargestImage scans the 'items' from /page/media
   * and picks the largest available image based on width.
   */
  function findLargestImage(mediaData) {
    if (!mediaData || !Array.isArray(mediaData.items)) return null;
  
    let largest = null;
    let largestWidth = 0;
  
    for (let item of mediaData.items) {
      // Looking for type: 'image' and an 'original' object with width/height/source
      if (item.type === 'image' && item.original) {
        if (item.original.width > largestWidth) {
          largestWidth = item.original.width;
          largest = item.original.source; // The direct URL to the image
        }
      }
    }
  
    return largest;
  }

/*
router.get('/api/like-article', async (req, res) => {
    try {
        const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
        const data = await response.json();
        
        // We'll send back only the info we need
        res.json({
            title: data.title,
            extract: data.extract,
            thumbnail: data.thumbnail ? data.thumbnail.source : null,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`
        });
    } catch (error) {
        console.error('Error fetching random Wikipedia article:', error);
        res.status(500).json({ error: 'Failed to fetch article.' });
    }
});
*/

module.exports = router;