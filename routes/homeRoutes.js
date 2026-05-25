const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('index', {
        title: 'Instagram Mutual Followers Checker'
    });
});

module.exports = router;