# Instagram Mutual Followers Checker

A Node.js/Express web application that checks for mutual followers between 2 or more Instagram accounts by scraping their followers data.

## Features

- ✅ Check mutual followers between multiple Instagram accounts
- ✅ Works with public Instagram accounts and private accounts you follow
- ✅ Clean and responsive UI

## Requirements

- Node.js (v12 or higher)
- npm or yarn

## Installation (type into terminal)

1. Clone project:
   ```bash
   git clone https://github.com/OscarFromNZ/InstagramMutualFollowerChecker
   ```
2. Navigate into project:
   ```bash
   cd InstagramMutualFollowerChecker/
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory: (just make a file named .env)
   ```
   SECRET=12983y98efhisodufgsdukyfagousdyfgaosdfyaogsdgyf
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

1. **Public Accounts & Private Accounts you Follow**: Only works with public Instagram accounts & private accounts you follow.

2. **Large Follower Lists**: Fetching very large follower lists (10k+) may take significant time and memory.

## Troubleshooting

### "Account is private - Only public accounts can be checked"
- Verify you follow the account

### "Username not found"
- Make sure the username is spelled correctly
- The account must exist and be public
- Check the username on Instagram's website first


## License

ISC

---

**Note**: This app scrapes Instagram data. Always respect Instagram's Terms of Service and use responsibly.
