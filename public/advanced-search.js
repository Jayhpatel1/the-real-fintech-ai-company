// Advanced search functionality with AI integration

document.addEventListener('DOMContentLoaded', function () {
    const priceRangeInput = document.getElementById('priceRange');
    const currentPrice = document.getElementById('currentPrice');
    const resultsHeader = document.getElementById('resultsHeader');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    const propertyGrid = document.getElementById('propertyGrid');

    // Update price range display dynamically
    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', function () {
            currentPrice.textContent = `₹${(priceRangeInput.value / 100000).toFixed(1)}L`;
        });
    }

    // Sample properties data (would be replaced with actual data from Firestore)
    const properties = [
        { id: 1, title: 'Cozy 2BHK Apartment', location: 'Mumbai', price: 7500000, area: 850, type: 'Apartment', features: ['2 BHK', 'Gated Community', 'Prime Location'], matchScore: 90 },
        { id: 2, title: 'Luxury Villa', location: 'Bangalore', price: 80000000, area: 3500, type: 'Villa', features: ['Swimming Pool', 'Private Garden', 'Exclusive Clubhouse'], matchScore: 95 },
        { id: 3, title: 'Spacious Bungalow', location: 'Ahmedabad', price: 12000000, area: 2000, type: 'Bungalow', features: ['Independent House', 'Large Compound', 'Customizable Interiors'], matchScore: 88 },
        { id: 4, title: 'Commercial Space', location: 'Delhi', price: 25000000, area: 1800, type: 'Commercial', features: ['High ROI', 'Prime Location', 'Ample Parking'], matchScore: 92 },
    ];

    function performAdvancedSearch() {
        resultsHeader.style.display = 'none';
        loadingSpinner.style.display = 'block';

        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            const matchedProperties = filterProperties();
            displayProperties(matchedProperties);
        }, 1500);
    }

    function filterProperties() {
        // This function would use actual filter inputs to filter properties for demonstration
        let filtered = properties.filter(prop => prop.price <= priceRangeInput.value);

        return filtered;
    }

    function displayProperties(propertiesList) {
        propertyGrid.innerHTML = '';
        resultsHeader.style.display = 'block';

        if (propertiesList.length) {
            resultsHeader.querySelector('#resultsCount').textContent = `${propertiesList.length} Properties Found`;
            noResults.style.display = 'none';
            propertiesList.forEach(property => {
                propertyGrid.innerHTML += generatePropertyCard(property);
            });
        } else {
            resultsHeader.querySelector('#resultsCount').textContent = '0 Properties Found';
            noResults.style.display = 'block';
        }
    }

    function generatePropertyCard(property) {
        return `
            <div class="property-card">
                <div class="property-image">
                    🏠
                    <div class="ai-match-score">${property.matchScore}% Match</div>
                </div>
                <div class="property-details">
                    <div class="property-price">₹${property.price.toLocaleString()}</div>
                    <div class="property-title">${property.title}</div>
                    <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</div>
                    <div class="property-features">
                        ${property.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <div class="property-actions">
                        <button class="btn-contact" onclick="alert('Contact for property ID: ${property.id}')">Contact Now</button>
                        <button class="btn-save">Save</button>
                    </div>
                </div>
            </div>
        `;
    }

    function resetFilters() {
        document.querySelectorAll('.filter-group select').forEach(select => select.selectedIndex = 0);
        document.querySelectorAll('.filter-group input[type="range"]').forEach(input => input.value = 50000000);
        currentPrice.textContent = '₹50L';
        propertyGrid.innerHTML = '';
        resultsHeader.style.display = 'none';
        noResults.style.display = 'none';
    }

    function applySuggestion(suggestion) {
        switch (suggestion) {
            case '2bhk-mumbai-50l':
                document.getElementById('propertyType').value = 'apartment';
                priceRangeInput.value = 5000000;
                currentPrice.textContent = '₹50L';
                performAdvancedSearch();
                break;
            case 'villa-bangalore-1cr':
                document.getElementById('propertyType').value = 'villa';
                priceRangeInput.value = 10000000;
                currentPrice.textContent = '₹1Cr';
                performAdvancedSearch();
                break;
            case 'commercial-ahmedabad':
                document.getElementById('propertyType').value = 'commercial';
                performAdvancedSearch();
                break;
            default:
                resetFilters();
        }
    }
});
