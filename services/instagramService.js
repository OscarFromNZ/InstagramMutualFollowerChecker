const fetch = require('node-fetch');
require('dotenv').config();

class InstagramService {
    constructor() {
        this.baseUrl = 'https://i.instagram.com/api/v1';
        this.cache = new Map();

        if (!process.env.INSTAGRAM_SESSION_ID) {
            console.warn('WARNING: INSTAGRAM_SESSION_ID is not set in .env');
        }

        this.headers = {
            'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 380dpi; 1080x1920; OnePlus; ONEPLUS A3010; OnePlus3T; qcom; en_US; 138226743)',
            'Accept': '*/*',
            'Accept-Language': 'en-US',
            'X-IG-App-ID': '936619743392459',
            'Cookie': `sessionid=${process.env.INSTAGRAM_SESSION_ID};`,
        };
    }

    /**
     * Get followers for a username
     */
    async getFollowers(username, limit = 10000) {
        const cacheKey = `followers_${username}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const user = await this.fetchUserInfo(username);

        if (!user) {
            throw new Error(`Could not find user: ${username}`);
        }
        if (user.is_private) {
            throw new Error(`Account is private: ${username}`);
        }

        const followers = await this.fetchFollowersList(user.pk || user.id, username, limit);
        this.cache.set(cacheKey, followers);
        return followers;
    }

    /**
     * Fetch user info via web_profile_info endpoint
     */
    async fetchUserInfo(username) {
        try {
            const url = `${this.baseUrl}/users/web_profile_info/?username=${encodeURIComponent(username)}`;
            const response = await fetch(url, { headers: this.headers });

            if (response.status === 404) return null;
            if (response.status === 401) throw new Error('Invalid or expired session ID. Please update INSTAGRAM_SESSION_ID in .env');
            if (!response.ok) throw new Error(`Instagram returned status ${response.status}`);

            const data = await response.json();
            return data?.data?.user || null;
        } catch (error) {
            if (error.message.includes('session')) throw error;
            throw new Error(`Failed to fetch user info for ${username}: ${error.message}`);
        }
    }

    /**
     * Fetch paginated followers list via friendships endpoint
     */
    async fetchFollowersList(userId, username, limit = 10000) {
        const followers = [];
        let maxId = null;
        let hasMore = true;

        while (hasMore && followers.length < limit) {
            try {
                const params = new URLSearchParams({ count: '50' });
                if (maxId) params.set('max_id', maxId);

                const url = `${this.baseUrl}/friendships/${userId}/followers/?${params}`;
                const response = await fetch(url, { headers: this.headers });

                if (response.status === 401) {
                    throw new Error('Invalid or expired session ID. Please update INSTAGRAM_SESSION_ID in .env');
                }
                if (!response.ok) {
                    console.warn(`Followers request failed with status ${response.status} for ${username}`);
                    break;
                }

                const data = await response.json();
                const users = data.users || [];

                users.forEach(user => {
                    if (user.username) {
                        followers.push({
                            username: user.username,
                            id: user.pk,
                            full_name: user.full_name || '',
                            profile_pic_url: user.profile_pic_url || '',
                        });
                    }
                });

                // Pagination: Instagram uses next_max_id
                hasMore = !!data.next_max_id && users.length > 0;
                maxId = data.next_max_id || null;

                // Respect rate limits
                await this.delay(1500);
            } catch (error) {
                if (error.message.includes('session')) throw error;
                console.warn(`Failed during followers pagination for ${username}: ${error.message}`);
                break;
            }
        }

        return followers;
    }

    /**
     * Get profile information for a username
     */
    async getProfileInfo(username) {
        const user = await this.fetchUserInfo(username);

        if (!user) {
            throw new Error(`Could not find user: ${username}`);
        }

        return {
            username: user.username,
            full_name: user.full_name || '',
            biography: user.biography || '',
            followers_count: user.edge_followed_by?.count ?? user.follower_count ?? 0,
            following_count: user.edge_follow?.count ?? user.following_count ?? 0,
            is_private: user.is_private || false,
            is_verified: user.is_verified || false,
            profile_pic_url: user.profile_pic_url_hd || user.profile_pic_url || '',
            posts_count: user.edge_owner_to_timeline_media?.count ?? user.media_count ?? 0,
        };
    }

    /**
     * Get mutual followers between 2 or more accounts
     */
    async getMutualFollowers(usernames) {
        if (!usernames || usernames.length < 2) {
            throw new Error('Please provide at least 2 usernames');
        }

        const allFollowerSets = await Promise.all(
            usernames.map(username => this.getFollowers(username))
        );

        return this.findIntersection(allFollowerSets);
    }

    /**
     * Find intersection of multiple follower arrays by username
     */
    findIntersection(followerArrays) {
        if (followerArrays.length === 0) return [];
        if (followerArrays.length === 1) return followerArrays[0];

        const sets = followerArrays.map(
            followers => new Set(followers.map(f => f.username))
        );

        return followerArrays[0].filter(
            follower => sets.slice(1).every(set => set.has(follower.username))
        );
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearCache() {
        this.cache.clear();
    }
}

module.exports = new InstagramService();