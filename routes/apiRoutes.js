const express = require('express');
const router = express.Router();
const InstagramService = require('../services/instagramService');

function getErrorMessage(error) {
    const msg = error.message || '';

    if (msg.includes('session')) {
        return 'Authentication error: Instagram session ID is missing or expired. Please update INSTAGRAM_SESSION_ID in your .env file.';
    }
    if (msg.includes('Account is private')) {
        return msg + ' — only public accounts can be checked.';
    }
    if (msg.includes('Could not find user')) {
        return `Username not found or not accessible. Please verify the spelling and that the account is public.`;
    }
    if (msg.includes('Rate limit') || msg.includes('429')) {
        return 'Instagram is rate limiting requests. Please wait a few minutes and try again.';
    }
    if (msg.includes('network') || msg.includes('Failed to fetch')) {
        return 'Network error. Please check your internet connection and try again.';
    }

    return msg || 'An unexpected error occurred.';
}

router.post('/api/mutual-followers', async (req, res) => {
    try {
        const { usernames } = req.body;

        if (!usernames || !Array.isArray(usernames) || usernames.length < 2) {
            return res.status(400).json({ error: 'Please provide at least 2 usernames' });
        }

        const invalid = usernames.filter(u => !u || typeof u !== 'string' || u.trim().length === 0);
        if (invalid.length > 0) {
            return res.status(400).json({ error: 'All usernames must be non-empty strings' });
        }

        const mutualFollowers = await InstagramService.getMutualFollowers(usernames);

        res.json({
            success: true,
            usernames,
            mutualFollowers,
            count: mutualFollowers.length,
        });
    } catch (error) {
        console.error('Error fetching mutual followers:', error);
        res.status(500).json({ error: getErrorMessage(error) });
    }
});

router.get('/api/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || username.trim().length === 0) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const profile = await InstagramService.getProfileInfo(username);
        res.json({ success: true, profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: getErrorMessage(error) });
    }
});

module.exports = router;