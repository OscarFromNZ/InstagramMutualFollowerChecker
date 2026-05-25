# Instagram Mutual Followers Checker

A Node.js/Express web application that checks for mutual followers between 2 or more public Instagram accounts by scraping their followers data.

## Features

- ✅ Check mutual followers between multiple Instagram accounts
- ✅ Works with public Instagram accounts
- ✅ Displays profile information for each follower
- ✅ Clean and responsive UI
- ✅ Real-time results with loading indicators
- ✅ Easy-to-use interface for adding multiple accounts
- ✅ Robust error handling with user-friendly messages
- ✅ Automatic retry logic for API failures

## Requirements

- Node.js (v12 or higher)
- npm or yarn

## Installation

1. Clone or navigate to the project directory:
   ```bash
   cd /home/oscar/proj/tikiwok
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (optional, for session management):
   ```
   SECRET=your_secret_key_here
   PORT=3000
   INSTAGRAM_SESSION_ID=go_to_your_cookies_to_find_it_or_google_it
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

   Or run directly:
   ```bash
   node index.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Enter at least 2 Instagram usernames (large accounts will take forever, max you should do is like 10k)

4. Click "Find Mutual Followers" to get results

## Project Structure

```
├── index.js                      # Entry point
├── Website.js                    # Express app setup
├── package.json                  # Dependencies
├── routes/
│   ├── homeRoutes.js            # Home page route
│   └── apiRoutes.js             # API endpoints
├── services/
│   └── instagramService.js      # Instagram scraping logic
├── public/
│   └── styles.css               # Frontend styling
└── views/
    └── index.ejs                # HTML template
```

## API Endpoints

### POST /api/mutual-followers
Get mutual followers between multiple Instagram accounts.

**Request:**
```json
{
  "usernames": ["username1", "username2", "username3"]
}
```

**Response:**
```json
{
  "success": true,
  "usernames": ["username1", "username2"],
  "mutualFollowers": [
    {
      "username": "follower_username",
      "id": "user_id",
      "full_name": "Follower Name",
      "profile_pic_url": "https://..."
    }
  ],
  "count": 5
}
```

### GET /api/profile/:username
Get profile information for a specific account.

**Response:**
```json
{
  "success": true,
  "profile": {
    "username": "username",
    "full_name": "Full Name",
    "biography": "Bio text",
    "followers_count": 1000,
    "following_count": 500,
    "is_private": false,
    "is_verified": true,
    "profile_pic_url": "https://...",
    "posts_count": 100
  }
}
```

## Dependencies

- **express**: Web framework
- **express-session**: Session management
- **ejs**: Template engine
- **node-fetch**: HTTP requests for Instagram API
- **insta-api**: Instagram API wrapper
- **dotenv**: Environment variable management

## Limitations

1. **Public Accounts Only**: Only works with public Instagram accounts. Private accounts will return an error.

2. **Large Follower Lists**: Fetching very large follower lists (10k+) may take significant time and memory.

## Troubleshooting

### "Account is private - Only public accounts can be checked"
- Verify the Instagram account is public (not private)
- Go to the account's profile and check privacy settings
- Only public accounts can have their followers accessed

### "Username not found"
- Make sure the username is spelled correctly
- The account must exist and be public
- Check the username on Instagram's website first


## License

ISC

## Support

For issues or questions, please check:
1. Username spelling and account privacy status
2. Instagram account is public
3. Network connection is stable
4. Try again after a few minutes (rate limit)

---

**Note**: This app scrapes public Instagram data. Always respect Instagram's Terms of Service and use responsibly.
