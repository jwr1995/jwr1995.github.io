#!/usr/bin/env python3
"""
Local test script for citation update workflow
This script simulates the GitHub Actions workflow locally for testing
"""

import json
import os
import sys
from datetime import datetime


def check_api_key():
    """Check if SERPAPI_KEY is configured"""
    api_key = os.environ.get('SERPAPI_KEY')
    
    if not api_key:
        print("❌ FAIL: SERPAPI_KEY environment variable not set")
        print("   Set it with: export SERPAPI_KEY='your_api_key_here'")
        return False
    
    if api_key == 'YOUR_SERPAPI_KEY_HERE':
        print("❌ FAIL: SERPAPI_KEY is still the placeholder value")
        return False
    
    if len(api_key) < 10:
        print("❌ FAIL: SERPAPI_KEY appears invalid (too short)")
        return False
    
    print(f"✓ SERPAPI_KEY is configured ({len(api_key)} chars)")
    return True


def test_api_connection():
    """Test connection to SerpApi"""
    try:
        import requests
    except ImportError:
        print("❌ FAIL: requests library not installed")
        print("   Install with: pip install requests")
        return False
    
    api_key = os.environ.get('SERPAPI_KEY')
    author_id = 'MrFn0HIAAAAJ'
    
    url = f"https://serpapi.com/search.json?engine=google_scholar_author&author_id={author_id}&api_key={api_key}"
    
    print("\nTesting SerpApi connection...")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"  Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if 'error' in data:
                print(f"❌ FAIL: API error: {data['error']}")
                return False
            
            if 'cited_by' not in data:
                print("❌ FAIL: No cited_by data in response")
                print(f"  Response keys: {list(data.keys())}")
                return False
            
            if 'table' not in data['cited_by']:
                print("❌ FAIL: No citation table in response")
                return False
            
            citations = data['cited_by']['table'][0]['citations']['all']
            print(f"✓ Successfully retrieved citation count: {citations}")
            return True
            
        elif response.status_code == 401:
            print("❌ FAIL: Authentication failed - invalid API key")
            return False
            
        elif response.status_code == 429:
            print("❌ FAIL: Rate limit exceeded")
            return False
            
        else:
            print(f"❌ FAIL: Unexpected status code: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ FAIL: Request timed out")
        return False
    except Exception as e:
        print(f"❌ FAIL: {type(e).__name__}: {e}")
        return False


def test_citation_extraction():
    """Test citation data extraction"""
    import requests
    
    api_key = os.environ.get('SERPAPI_KEY')
    author_id = 'MrFn0HIAAAAJ'
    
    url = f"https://serpapi.com/search.json?engine=google_scholar_author&author_id={author_id}&api_key={api_key}"
    
    print("\nTesting citation data extraction...")
    
    try:
        response = requests.get(url)
        data = response.json()
        
        citations = data['cited_by']['table'][0]['citations']['all']
        
        citation_data = {
            'citations': citations,
            'lastUpdated': datetime.utcnow().isoformat() + 'Z'
        }
        
        print(f"✓ Extracted citation data:")
        print(f"  - Citations: {citation_data['citations']}")
        print(f"  - Last Updated: {citation_data['lastUpdated']}")
        
        # Compare with current file
        if os.path.exists('citation-data.json'):
            with open('citation-data.json', 'r') as f:
                current = json.load(f)
            print(f"\nCurrent citation count: {current['citations']}")
            
            if current['citations'] == citations:
                print("✓ Citation count is up to date")
            else:
                print(f"⚠ Citation count has changed: {current['citations']} → {citations}")
        
        return True
        
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("  Citation Update Workflow - Local Test Suite")
    print("=" * 60)
    
    # Check dependencies
    print("\nChecking dependencies...")
    try:
        import requests
        print("✓ requests library installed")
    except ImportError:
        print("❌ requests library not installed")
        print("   Install with: pip install requests")
        sys.exit(1)
    
    # Run tests
    tests = [
        ("API Key Configuration", check_api_key),
        ("API Connection", test_api_connection),
        ("Citation Extraction", test_citation_extraction),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'=' * 60}")
        print(f"Test: {test_name}")
        print('=' * 60)
        result = test_func()
        results.append((test_name, result))
    
    # Print summary
    print("\n" + "=" * 60)
    print("  TEST SUMMARY")
    print("=" * 60)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    all_passed = all(r for _, r in results)
    
    if all_passed:
        print("\n✓ All tests passed! The workflow is ready to use.")
        print("\nTo trigger the workflow on GitHub:")
        print("  1. Go to Actions tab")
        print("  2. Select 'Update Citation Count'")
        print("  3. Click 'Run workflow'")
        return 0
    else:
        print("\n❌ Some tests failed. Please fix the issues above.")
        return 1


if __name__ == '__main__':
    sys.exit(main())
