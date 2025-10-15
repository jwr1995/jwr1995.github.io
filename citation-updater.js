// Citation updater script for Google Scholar
// This script fetches citation count from Google Scholar via SerpApi
// and updates it at most once per day

const SERPAPI_KEY = 'YOUR_SERPAPI_KEY_HERE'; // Replace with your SerpApi API key
const SCHOLAR_AUTHOR_ID = 'MrFn0HIAAAAJ';
const CITATION_DATA_URL = './citation-data.json';
const UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches citation data from the local JSON file
 */
async function loadCitationData() {
    try {
        const response = await fetch(CITATION_DATA_URL + '?t=' + Date.now());
        if (!response.ok) {
            throw new Error('Failed to fetch citation data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading citation data:', error);
        return { citations: 114, lastUpdated: '2025-01-01T00:00:00.000Z' };
    }
}

/**
 * Fetches citation count from Google Scholar via SerpApi
 */
async function fetchCitationCount() {
    const apiUrl = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${SCHOLAR_AUTHOR_ID}&api_key=${SERPAPI_KEY}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('SerpApi request failed');
        }
        
        const data = await response.json();
        
        // Extract citation count from the response
        if (data.cited_by && data.cited_by.table) {
            const allCitations = data.cited_by.table[0];
            if (allCitations && allCitations.citations) {
                return allCitations.citations.all;
            }
        }
        
        throw new Error('Citation count not found in response');
    } catch (error) {
        console.error('Error fetching citation count from SerpApi:', error);
        return null;
    }
}

/**
 * Checks if the citation data needs to be updated
 */
function shouldUpdate(lastUpdated) {
    const lastUpdateTime = new Date(lastUpdated).getTime();
    const now = Date.now();
    return (now - lastUpdateTime) >= UPDATE_INTERVAL_MS;
}

/**
 * Updates the citation count display on the page
 */
function updateCitationDisplay(count) {
    const citationElement = document.getElementById('citation-count');
    if (citationElement) {
        // Animate the count change
        const currentCount = parseInt(citationElement.textContent) || 0;
        if (currentCount !== count) {
            citationElement.style.transition = 'opacity 0.3s ease';
            citationElement.style.opacity = '0';
            
            setTimeout(() => {
                citationElement.textContent = count;
                citationElement.style.opacity = '1';
            }, 300);
        }
    }
}

/**
 * Main function to handle citation count updates
 */
async function initCitationUpdater() {
    try {
        // Load current citation data
        const citationData = await loadCitationData();
        
        // Update display with current data
        updateCitationDisplay(citationData.citations);
        
        // Check if we need to fetch new data
        if (shouldUpdate(citationData.lastUpdated)) {
            console.log('Citation data is stale, fetching new data...');
            
            // Only fetch if API key is configured
            if (SERPAPI_KEY !== 'YOUR_SERPAPI_KEY_HERE') {
                const newCount = await fetchCitationCount();
                
                if (newCount !== null) {
                    console.log(`Citation count updated: ${citationData.citations} -> ${newCount}`);
                    
                    // Note: Since this is a static GitHub Pages site, we can't update the JSON file
                    // from client-side. Instead, we'll store in localStorage and use that
                    const updatedData = {
                        citations: newCount,
                        lastUpdated: new Date().toISOString()
                    };
                    
                    localStorage.setItem('citationData', JSON.stringify(updatedData));
                    updateCitationDisplay(newCount);
                } else {
                    console.log('Failed to fetch new citation count, using cached data');
                }
            } else {
                console.log('SerpApi key not configured, using cached data');
            }
        } else {
            console.log('Citation data is fresh, no update needed');
        }
        
        // Check localStorage for more recent data
        const localData = localStorage.getItem('citationData');
        if (localData) {
            const parsedLocalData = JSON.parse(localData);
            const localUpdateTime = new Date(parsedLocalData.lastUpdated).getTime();
            const fileUpdateTime = new Date(citationData.lastUpdated).getTime();
            
            if (localUpdateTime > fileUpdateTime) {
                updateCitationDisplay(parsedLocalData.citations);
            }
        }
    } catch (error) {
        console.error('Error in citation updater:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCitationUpdater);
} else {
    initCitationUpdater();
}
