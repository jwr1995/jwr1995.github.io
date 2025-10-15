# Citation Auto-Update Setup

This website includes an automatic citation count updater that fetches the latest citation count from Google Scholar using SerpApi.

## How It Works

1. When someone visits the website, the `citation-updater.js` script runs
2. It checks the `citation-data.json` file for the last update timestamp
3. If more than 24 hours have passed, it fetches the latest citation count from Google Scholar via SerpApi
4. The citation count is updated and stored in the browser's localStorage
5. The updated count is displayed on the page

## Setup Instructions

### 1. Get a SerpApi API Key

1. Sign up for a free SerpApi account at https://serpapi.com/
2. Get your API key from the dashboard (250 free searches per month)

### 2. Configure the API Key

Edit the `citation-updater.js` file and replace the placeholder with your actual API key:

```javascript
const SERPAPI_KEY = 'YOUR_SERPAPI_KEY_HERE'; // Replace with your SerpApi API key
```

### 3. Update Citation Data Manually (Optional)

To manually update the citation count in the `citation-data.json` file:

```json
{
  "citations": YOUR_CITATION_COUNT,
  "lastUpdated": "YYYY-MM-DDTHH:MM:SS.000Z"
}
```

## How to Test

1. Open the website in a browser
2. Open the browser's Developer Console (F12)
3. Check for log messages from the citation updater
4. The citation count should be displayed and updated automatically if needed

## Notes

- The script runs client-side, so it respects the 24-hour update interval per visitor
- If the SerpApi key is not configured, the script will use the cached data from `citation-data.json`
- Citation data is stored in localStorage to persist across page visits on the same browser
- The script gracefully handles errors and falls back to cached data if the API request fails

## Security Considerations

⚠️ **Important**: The SerpApi key is exposed in the client-side JavaScript. For a production setup, consider:

1. Using a backend service to proxy API requests
2. Implementing rate limiting
3. Using environment variables or a build process to inject the API key
4. For a static site like this, the current approach is acceptable since SerpApi has built-in rate limiting and the free tier is sufficient

## File Structure

- `index.html` - Main website file (includes the citation display and script reference)
- `citation-updater.js` - JavaScript module that handles citation fetching and updating
- `citation-data.json` - Stores the current citation count and last update timestamp
- `CITATION_SETUP.md` - This documentation file
