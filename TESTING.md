# Testing the Citation Update Workflow

This document explains how to test the citation update workflow.

## Test Files

- **`.github/workflows/test-citation-update.yml`** - Automated test workflow that runs on GitHub Actions
- **`test-citation-workflow.py`** - Local test script for testing before pushing to GitHub

## Running Tests on GitHub Actions

### 1. Run the Test Workflow

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select **Test Citation Update Workflow** from the left sidebar
4. Click **Run workflow** button
5. Click the green **Run workflow** button in the dropdown
6. Wait for the workflow to complete (30-60 seconds)

### 2. Review Test Results

The test workflow will run the following checks:

- ✓ **Pre-flight checks**: Verifies environment setup
- ✓ **API key configuration**: Confirms SERPAPI_KEY is set correctly
- ✓ **API connection**: Tests connection to SerpApi
- ✓ **Citation extraction**: Validates data extraction from API response
- ✓ **HTML update logic**: Tests the HTML update mechanism
- ✓ **Integration test**: Full end-to-end test (dry run)

Click on the workflow run to see detailed logs for each step.

### 3. Interpret Results

**All tests pass (green checkmark)**
- ✓ Configuration is correct
- ✓ API key is valid
- ✓ Citation update workflow is ready to use
- → You can now run the actual "Update Citation Count" workflow

**Some tests fail (red X)**
- Check the failed step's logs for details
- Common issues:
  - API key not configured → Add SERPAPI_KEY secret
  - Authentication failed → Verify your API key is correct
  - Rate limit → Wait for quota to reset
- Fix the issue and run the test again

## Running Tests Locally

### 1. Prerequisites

Install required dependencies:

```bash
pip install requests
```

### 2. Set Environment Variable

Set your SerpApi API key as an environment variable:

```bash
# Linux/Mac
export SERPAPI_KEY='your_api_key_here'

# Windows (Command Prompt)
set SERPAPI_KEY=your_api_key_here

# Windows (PowerShell)
$env:SERPAPI_KEY='your_api_key_here'
```

### 3. Run the Test Script

```bash
python test-citation-workflow.py
```

### 4. Review Output

The script will run three tests:

1. **API Key Configuration** - Checks if SERPAPI_KEY is set
2. **API Connection** - Tests connection to SerpApi
3. **Citation Extraction** - Validates data retrieval

Example successful output:

```
============================================================
  Citation Update Workflow - Local Test Suite
============================================================

Checking dependencies...
✓ requests library installed

============================================================
Test: API Key Configuration
============================================================
✓ SERPAPI_KEY is configured (64 chars)

============================================================
Test: API Connection
============================================================

Testing SerpApi connection...
  Response status: 200
✓ Successfully retrieved citation count: 114

============================================================
Test: Citation Extraction
============================================================

Testing citation data extraction...
✓ Extracted citation data:
  - Citations: 114
  - Last Updated: 2025-10-15T09:45:00.000Z

Current citation count: 114
✓ Citation count is up to date

============================================================
  TEST SUMMARY
============================================================
✓ PASS: API Key Configuration
✓ PASS: API Connection
✓ PASS: Citation Extraction

✓ All tests passed! The workflow is ready to use.
```

## What the Tests Do

### Pre-flight Checks
- Verifies Python version
- Shows current repository state
- Displays current citation count

### API Key Test
- Checks if SERPAPI_KEY secret exists
- Validates key is not a placeholder
- Ensures key length is reasonable

### API Connection Test
- Makes a test request to SerpApi
- Validates authentication
- Checks for rate limiting
- Verifies response format

### Citation Extraction Test
- Fetches real citation data
- Extracts citation count
- Creates test JSON file
- Validates data format

### HTML Update Test
- Creates test HTML file
- Tests sed replacement logic
- Verifies citation count is updated correctly

### Integration Test
- Runs complete workflow (dry run)
- Compares current vs. new citation count
- Shows what would change
- Does NOT commit or push changes

## After Testing

Once all tests pass:

1. **Run the actual workflow**:
   - Go to Actions → Update Citation Count → Run workflow

2. **Verify the update**:
   - Check the commit history for automated commit
   - Visit your website to see the updated count
   - Review `citation-data.json` for the new data

3. **Monitor daily runs**:
   - The workflow runs automatically at 2 AM UTC
   - Check Actions tab to see daily run history
   - Updates only commit if citation count changes

## Troubleshooting Test Failures

### "SERPAPI_KEY secret not configured"
- Go to Settings → Secrets and variables → Actions
- Add a new secret named `SERPAPI_KEY`
- Paste your API key from SerpApi dashboard

### "Authentication failed"
- Your API key may be invalid
- Log in to serpapi.com and verify your key
- Try creating a new API key

### "Rate limit exceeded"
- Free tier: 250 searches/month
- Check your usage on SerpApi dashboard
- Wait for monthly quota reset or upgrade plan

### "No citation data in response"
- Verify author ID is correct (MrFn0HIAAAAJ)
- Check if Google Scholar profile is public
- Try accessing the profile directly on scholar.google.com

## Manual Workflow Testing

You can also manually trigger the actual update workflow in test mode by:

1. Temporarily editing the workflow to not push changes
2. Running the workflow manually
3. Checking the logs to see what would happen
4. Reverting the temporary changes

However, using the dedicated test workflow is recommended as it's designed for safe testing.

---

**Remember**: The test workflow does NOT make any changes to your repository. It only validates that the configuration is correct.
