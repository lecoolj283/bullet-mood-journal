document.addEventListener('DOMContentLoaded', () => {
    const svgContainer = document.getElementById('svg-container');
    const svgFilePath = 'sample_template.svg';
    let selectedColor = 'rgba(0, 0, 255, 0.7)'; // Default color

    // --- LocalStorage Helper ---
    function getDailyStorageKey() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `moodJournal-${year}-${month}-${day}`;
    }

    // Initialize Pickr
    const pickr = Pickr.create({
        el: '.color-picker-button',
        theme: 'classic',
        useAsButton: true,
        default: selectedColor,
        swatches: [
            'rgba(244, 67, 54, 1)', 'rgba(233, 30, 99, 1)', 'rgba(156, 39, 176, 1)',
            'rgba(103, 58, 183, 1)', 'rgba(63, 81, 181, 1)', 'rgba(33, 150, 243, 1)',
            'rgba(0, 188, 212, 1)', 'rgba(76, 175, 80, 1)', 'rgba(255, 235, 59, 1)',
            'rgba(255, 152, 0, 1)', 'rgba(121, 85, 72, 1)', 'rgba(158, 158, 158, 1)'
        ],
        components: {
            preview: true, opacity: true, hue: true,
            interaction: {
                hex: true, rgba: true, hsla: false, hsva: false, cmyk: false,
                input: true, clear: true, save: true
            }
        }
    });

    pickr.on('save', (color, instance) => {
        if (color) {
            selectedColor = color.toRGBA().toString(0);
            console.log('Pickr Save: New color selected:', selectedColor);
        }
        pickr.hide();
    });

    pickr.on('change', (color, source, instance) => {
        if (color) {
            selectedColor = color.toRGBA().toString(0);
        }
    });

    async function loadSVG(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const svgText = await response.text();
            svgContainer.innerHTML = svgText;
            
            const svgElement = svgContainer.querySelector('svg');
            if (svgElement) {
                console.log('SVG loaded successfully:', svgElement);
                // Load saved colors AFTER SVG is loaded (will be step 9)
                addRegionEventListeners();
            } else {
                 if (svgContainer.firstChild && svgContainer.firstChild.tagName && svgContainer.firstChild.tagName.toLowerCase() === 'svg') {
                    console.log('SVG loaded (alternative check):', svgContainer.firstChild);
                    addRegionEventListeners();
                } else {
                    console.warn('SVG content loaded, but no <svg> tag found directly within it or as its first child.');
                }
            }
        } catch (error) {
            console.error('Error loading SVG:', error);
            svgContainer.innerHTML = `<p style="color: red;">Could not load SVG: ${error.message}</p>`;
        }
    }

    function addRegionEventListeners() {
        const svgElement = svgContainer.querySelector('svg');
        if (!svgElement) {
            console.error('No SVG element found to attach listeners to.');
            return;
        }
        const fillableRegions = svgElement.querySelectorAll('.fillable-region');
        fillableRegions.forEach(region => {
            region.addEventListener('click', (event) => handleRegionClick(event.currentTarget));
            region.addEventListener('touchstart', (event) => {
                event.preventDefault();
                handleRegionClick(event.currentTarget);
            });
        });
    }

    function handleRegionClick(regionElement) {
        const regionId = regionElement.id;
        if (!regionId) {
            console.warn('Clicked region has no ID. Cannot save state for this region.');
            // regionElement.setAttribute('fill', selectedColor); // Optionally still color it visually
            return; // Do not proceed to save if no ID
        }

        regionElement.setAttribute('fill', selectedColor);
        console.log(`Region ${regionId} clicked. Changed fill to ${selectedColor}.`);

        // Save to localStorage
        saveRegionColor(regionId, selectedColor);
    }

    function saveRegionColor(regionId, color) {
        const storageKey = getDailyStorageKey();
        let dailyData = {};
        try {
            const existingData = localStorage.getItem(storageKey);
            if (existingData) {
                dailyData = JSON.parse(existingData);
            }
        } catch (e) {
            console.error('Error parsing existing localStorage data:', e);
            // Potentially corrupted data, start fresh for the day
            dailyData = {};
        }

        dailyData[regionId] = color; // Update the color for the specific region

        try {
            localStorage.setItem(storageKey, JSON.stringify(dailyData));
            console.log(`Saved color for region ${regionId} (${color}) to localStorage for key ${storageKey}.`);
        } catch (e) {
            console.error('Error saving data to localStorage:', e);
            // Handle potential storage full errors or other issues
            alert('Could not save your changes. Local storage might be full or disabled.');
        }
    }

    // Initial load of SVG
    loadSVG(svgFilePath);
    // Note: Loading colors from localStorage will be handled in the next step.
});
