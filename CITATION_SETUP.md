# Citation Auto-Update Setup Guide

This repository includes an automatic citation count updater that securely fetches your Google Scholar citation count using GitHub Actions and SerpApi.

## Overview

The citation count on your website is automatically updated once per day by a GitHub Actions workflow. The workflow:

1. Runs daily at 2 AM UTC (or can be triggered manually)
2. Fetches your citation count from Google Scholar using SerpApi
3. Updates `citation-data.json` with the new count and timestamp
4. Updates `index.html` with the new citation count
5. Commits and pushes the changes back to your repository

**Security**: The SerpApi API key is stored as a GitHub Secret and never exposed in client-side code.

## Setup Instructions

### 1. Get a SerpApi API Key

1. Sign up for a free account at [https://serpapi.com/](https://serpapi.com/)
2. Navigate to your dashboard to get your API key
3. The free tier includes 250 searches per month (more than enough for daily updates)

### 2. Add the API Key as a GitHub Secret

1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `SERPAPI_KEY`
5. Value: Paste your SerpApi API key
6. Click **Add secret**

### 3. Enable GitHub Actions (if not already enabled)

1. Go to your repository's **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, ensure **Read and write permissions** is selected
3. Check **Allow GitHub Actions to create and approve pull requests** if needed
4. Save changes

### 4. Verify the Workflow

The workflow is now configured and will run automatically. To test it:

1. Go to the **Actions** tab in your repository
2. Click on **Update Citation Count** workflow
3. Click **Run workflow** → **Run workflow** to manually trigger it
4. Wait for the workflow to complete (should take less than 30 seconds)
5. Check the commit history to see the automated update

## How It Works

### GitHub Actions Workflow

- **File**: `.github/workflows/update-citations.yml`
- **Schedule**: Runs daily at 2 AM UTC via cron schedule
- **Manual trigger**: Can be run manually from the Actions tab
- **Process**:
  1. Checks out the repository
  2. Fetches citation data from SerpApi using the secure `SERPAPI_KEY` secret
  3. Updates `citation-data.json` with new citation count and timestamp
  4. Updates the citation count directly in `index.html`
  5. Commits and pushes changes if the count has changed

### Client-Side Display

- **File**: `citation-display.js`
- **Purpose**: Loads and displays the citation count from `citation-data.json`
- **Features**:
  - Smooth fade animation when count changes
  - Cache-busting to ensure fresh data
  - No API keys or secrets in client-side code

### Data Storage

- **File**: `citation-data.json`
- **Format**:
  ```json
  {
    "citations": 123,
    "lastUpdated": "2025-10-15T02:00:00.000Z"
  }
  ```

## Customization

### Change Update Frequency

Edit `.github/workflows/update-citations.yml` and modify the cron schedule:

```yaml
on:
  schedule:
    # Current: daily at 2 AM UTC
    - cron: '0 2 * * *'
    
    # Examples:
    # - cron: '0 */12 * * *'  # Every 12 hours
    # - cron: '0 0 * * 0'     # Weekly on Sunday
```

### Change Scholar Author ID

If you need to update the Google Scholar author ID, edit the workflow file:

```yaml
env:
  SCHOLAR_AUTHOR_ID: MrFn0HIAAAAJ  # Replace with your author ID
```

## Troubleshooting

### Workflow Fails

1. **Check secrets**: Ensure `SERPAPI_KEY` is correctly set in repository secrets
2. **Check permissions**: Verify GitHub Actions has write permissions
3. **Check API quota**: SerpApi free tier has 250 searches/month
4. **View logs**: Click on failed workflow run in Actions tab to see error details

### Citation Count Not Updating on Website

1. **Check workflow runs**: Go to Actions tab and verify the workflow is running successfully
2. **Clear browser cache**: Force refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. **Check console**: Open browser DevTools and look for errors in the console
4. **Verify JSON**: Navigate to `/citation-data.json` directly to check if it's updated

### Manual Update

To manually update the citation count without waiting for the scheduled run:

1. Go to **Actions** tab
2. Select **Update Citation Count** workflow
3. Click **Run workflow**
4. Select the branch (usually `main` or `master`)
5. Click **Run workflow**

## Security Notes

✅ **Secure**: API key is stored as a GitHub Secret and only accessible to GitHub Actions  
✅ **Private**: API key is never exposed in client-side code or commit history  
✅ **Safe**: GitHub Actions runs in an isolated environment  
✅ **Controlled**: Only repository administrators can view/edit secrets  

## File Structure

```
.github/
  workflows/
    update-citations.yml    # GitHub Actions workflow
citation-data.json          # Citation count data storage
citation-display.js         # Client-side display script
index.html                  # Main website (updated by workflow)
```

## Monitoring

You can monitor the citation updates by:

1. **GitHub Actions**: Check the Actions tab for workflow run history
2. **Commits**: View commit history for automated updates
3. **JSON file**: Check `citation-data.json` for latest count and timestamp
4. **Website**: Visit your site and check browser console for update messages

## Support

If you encounter any issues:

1. Check the workflow logs in the Actions tab
2. Verify your SerpApi account status and quota
3. Ensure GitHub Actions has proper permissions
4. Review the troubleshooting section above

---

**Last Updated**: 2025-10-15
