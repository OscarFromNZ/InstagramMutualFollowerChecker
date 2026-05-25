# Instagram Mutual Followers Checker

A Node.js/Express web application that checks for mutual followers between 2 or more public Instagram accounts by scraping their followers data.

> ⚠️ **Important Note**: Instagram has increasingly restricted public API access. Some accounts may not be accessible. If you encounter API errors, please see the [Troubleshooting](#troubleshooting) section. The app works best with very popular accounts that have more open API access.

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

3. Enter at least 2 Instagram usernames (e.g., `instagram`, `nasa`)

4. Click "Find Mutual Followers" to get results

## Recommended Test Accounts

Try these popular accounts which are more likely to have accessible API endpoints:
- `instagram` - The official Instagram account
- `nasa` - NASA's official account  
- `cristiano` - Cristiano Ronaldo
- `therock` - Dwayne "The Rock" Johnson
- `arianagrande` - Ariana Grande
- `billgates` - Bill Gates

**Tip**: Try with 2-3 accounts that have between 1M-100M followers for best results. Very small accounts may have restricted API access, and extremely large accounts may take longer to fetch.

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

## Features in Detail

### 1. Multiple Account Support
- Add 2 or more Instagram accounts to check
- Use the "+ Add Username" button to add more accounts

### 2. Real-time Followers Comparison
- Fetches followers from each account
- Finds accounts that follow all selected accounts
- Displays results with profile pictures and names

### 3. Responsive Design
- Mobile-friendly interface
- Works on tablets and desktops
- Beautiful gradient UI with smooth animations

### 4. Error Handling
- Validates user input
- Handles private accounts gracefully
- Network error messages
- User-friendly error notifications

## Limitations

1. **Public Accounts Only**: Only works with public Instagram accounts. Private accounts will return an error.

2. **Instagram API Restrictions**: Instagram has increasingly restricted public API access. Some accounts may not be accessible due to:
   - Instagram's security measures
   - Account privacy settings
   - Rate limiting after multiple requests
   - API endpoint changes by Instagram

3. **Rate Limiting**: Instagram may rate-limit requests. The app includes delays between API calls (1-2 seconds) to minimize this. If you encounter rate limiting errors:
   - Wait a few minutes before trying again
   - Try with fewer accounts or smaller follower counts
   - Instagram's rate limits reset over time

4. **API Changes**: Instagram frequently updates their API. If the app stops working entirely, the API endpoints may need to be updated.

5. **Large Follower Lists**: Fetching very large follower lists (100k+) may take significant time and memory.

6. **Partial Data**: If an account's API endpoint becomes temporarily inaccessible, the app may return partial follower data or an empty followers list.

## Troubleshooting

### "Account is private - Only public accounts can be checked"
- Verify the Instagram account is public (not private)
- Go to the account's profile and check privacy settings
- Only public accounts can have their followers accessed

### "Instagram API is not responding properly"
This error occurs when:
1. **The account has restricted API access**: Some accounts have additional security that blocks automated access
2. **Instagram API has changed**: This is an ongoing issue as Instagram restricts public API access
3. **Rate limiting**: Too many requests were made. Wait 5-10 minutes and try again
4. **Network issue**: Check your internet connection and try again

**Solution**: Try with a different account or wait and retry the same account later

### "Username not found"
- Make sure the username is spelled correctly
- The account must exist and be public
- Check the username on Instagram's website first

### No mutual followers found
- This could mean there are no accounts that follow all selected accounts
- Check that the usernames are spelled correctly
- Try with very popular accounts (like `instagram`, `nasa`) as they have millions of followers

### Timeout errors
- Try with accounts that have smaller follower counts
- Instagram may be rate-limiting requests - wait a few minutes
- Try fewer usernames (2 instead of 3+)

### "JSON parsing errors"
- This usually means the Instagram API endpoint returned invalid data
- Wait a few moments and try again
- The account may have temporarily restricted API access
- Try a different account to test if your connection is working

## Environment Variables

Create a `.env` file with:

```
PORT=3000
SECRET=your_random_session_secret
```

## Performance Notes

- First search may take 10-30 seconds depending on follower count
- Results are cached for faster subsequent searches
- Searches are performed sequentially to avoid rate limiting

## Future Improvements

- [ ] Add follower count filtering
- [ ] Export results to CSV/JSON
- [ ] Add search history
- [ ] Implement caching with database
- [ ] Add more detailed follower analytics
- [ ] User authentication for faster API access

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
