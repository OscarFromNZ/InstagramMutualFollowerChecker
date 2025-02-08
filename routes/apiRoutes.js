const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const wiki = require('wikipedia');

router.get('/api/next-article', async (req, res) => {
    try {
        const { year, month, day } = getRandomDateBetween2010And2024();

        const content = await wiki.featuredContent({
            year: year.toString(),
            month: String(month).padStart(2, '0'),
            day: String(day).padStart(2, '0')
        });

        //console.log(content.tfa)
        //console.log(content.mostread.articles)
        //console.log(await wiki.random())

        res.json({
            title: content.tfa.titles.normalized,
            extract: content.tfa.extract,
            thumbnail: content.tfa.originalimage.source,  // This will (hopefully) be the large image
            url: content.tfa.content_urls.desktop.page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch article.' });
    }
});

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


function getRandomDateBetween2010And2024() {
    // Generate a random year (2010 <= year <= 2024)
    const year = Math.floor(Math.random() * (2024 - 2010 + 1)) + 2010;

    // Generate a random month (1 <= month <= 12)
    const month = Math.floor(Math.random() * 12) + 1;

    // Figure out how many days are in this particular month/year
    // By setting day=0 on the next month, JavaScript Date auto-corrects to the
    // last day of the *previous* month. So new Date(year, month, 0).getDate()
    // is the number of days in that month.
    const lastDayOfMonth = new Date(year, month, 0).getDate();

    // Generate a random day between 1 and lastDayOfMonth
    const day = Math.floor(Math.random() * lastDayOfMonth) + 1;

    return { year, month, day };
}