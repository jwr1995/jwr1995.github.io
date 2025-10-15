// Citation display updater
// This script loads citation count from citation-data.json and displays it
// The actual fetching is done server-side by GitHub Actions

/**
 * Loads and displays citation data from the local JSON file
 */
async function loadAndDisplayCitationCount() {
    try {
        // Add cache-busting parameter to ensure fresh data
        const response = await fetch('./citation-data.json?t=' + Date.now());
        if (!response.ok) {
            throw new Error('Failed to fetch citation data');
        }
        
        const data = await response.json();
        const citationElement = document.getElementById('citation-count');
        
        if (citationElement && data.citations) {
            const currentCount = parseInt(citationElement.textContent) || 0;
            
            // Only update if the count has changed
            if (currentCount !== data.citations) {
                // Smooth fade transition
                citationElement.style.transition = 'opacity 0.3s ease';
                citationElement.style.opacity = '0';
                
                setTimeout(() => {
                    citationElement.textContent = data.citations;
                    citationElement.style.opacity = '1';
                }, 300);
                
                console.log(`Citation count updated to ${data.citations} (last updated: ${data.lastUpdated})`);
            }
        }
    } catch (error) {
        console.error('Error loading citation data:', error);
    }
}

// Load citation count when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndDisplayCitationCount);
} else {
    loadAndDisplayCitationCount();
}
