// Create a single preview element that we can reuse
let previewElement = null;
let hideTimeout = null;
let currentHoveredLink = null;
let isExtensionEnabled = false; // Default to disabled

// Function to create the preview element
function createPreviewElement() {
    if (!previewElement) {
        previewElement = document.createElement('div');
        previewElement.id = 'image-preview-extension';
        previewElement.className = 'image-preview-container';
        previewElement.style.display = 'none';
        document.body.appendChild(previewElement);
    }
    return previewElement;
}

// Extract image URLs from the fetched HTML content
function extractImages(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    const imageUrls = Array.from(images)
        .filter(img => {
            // Exclude ads with data-link attribute
            return !img.hasAttribute('data-link');
        })
        .map(img => img.getAttribute('ess-data'))
        .filter(src => src); // Ensure ess-data exists
    return imageUrls;
}

// Adjust preview position relative to link
function adjustPosition(preview, linkRect) {
    const previewRect = preview.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Initial position below link
    let left = linkRect.left;
    let top = linkRect.bottom + 5;
    
    // Adjust for right edge overflow
    if (left + previewRect.width > windowWidth) {
        left = windowWidth - previewRect.width - 5;
    }
    
    // Adjust for left edge overflow
    if (left < 5) {
        left = 5;
    }
    
    // Adjust for bottom edge overflow
    if (top + previewRect.height > windowHeight) {
        // Try placing above the link
        top = linkRect.top - previewRect.height - 5;
        // If still off screen, align to top
        if (top < 5) {
            top = 5;
        }
    }
    
    // Account for page scrolling
    preview.style.left = `${left + window.scrollX}px`;
    preview.style.top = `${top + window.scrollY}px`;
}

// Display image preview
function showPreview(link, imageUrls) {
    clearTimeout(hideTimeout);
    currentHoveredLink = link;
    
    const preview = createPreviewElement();
    preview.innerHTML = '';
    
    // Create image elements for each URL
    if (imageUrls.length === 0) {
     //   const noImageMessage = document.createElement('div');
     //   noImageMessage.textContent = '未找到ess-data属性的图片';
     //   noImageMessage.style.color = '#555';
     //   noImageMessage.style.padding = '10px';
     //   preview.appendChild(noImageMessage);
    } else {
        imageUrls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.className = 'image-preview';
            preview.appendChild(img);
        });
    }
    
    // Position and show preview
    const linkRect = link.getBoundingClientRect();
    adjustPosition(preview, linkRect);
    preview.style.display = 'flex';
}

// Hide preview with delay
function hidePreview() {
    if (previewElement) {
        hideTimeout = setTimeout(() => {
            if (previewElement) {
                previewElement.style.display = 'none';
                previewElement.innerHTML = '';
                currentHoveredLink = null;
            }
        }, 100);
    }
}

// Update preview position during scrolling
function updatePreviewPosition() {
    if (previewElement && 
        previewElement.style.display !== 'none' && 
        currentHoveredLink) {
        const linkRect = currentHoveredLink.getBoundingClientRect();
        adjustPosition(previewElement, linkRect);
    }
}

// Setup mouse event listeners
function setupEventListeners() {
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
}

// Remove mouse event listeners
function removeEventListeners() {
    document.body.removeEventListener('mouseover', handleMouseOver);
    document.body.removeEventListener('mouseout', handleMouseOut);
    hidePreview(); // Ensure preview is hidden
}

// Handle mouseover events on links
function handleMouseOver(event) {
    const link = event.target.closest('a');
    
    if (link && link.href && 
        !link.href.startsWith('#') && 
        !link.href.startsWith('javascript:')) {
        const url = link.href;
        
        // Fetch link content
        fetch(url)
            .then(response => {
                const contentType = response.headers.get('content-type');
                if (!response.ok || !contentType || !contentType.includes('text/html')) {
                    return null;
                }
                return response.text();
            })
            .then(html => {
                if (html !== null) {
                    const imageUrls = extractImages(html);
                    // Verify target is still the same link
                    if (link.contains(event.target)) {
                        showPreview(link, imageUrls);
                    }
                } else {
                    hidePreview();
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                hidePreview();
            });
    } else {
        hidePreview();
    }
}

// Handle mouseout events
function handleMouseOut(event) {
    if (!event.relatedTarget || 
        event.relatedTarget.nodeName === 'HTML' || 
        event.relatedTarget.nodeName === 'BODY') {
        hidePreview();
    }
}

// Listen for scroll events to update position
window.addEventListener('scroll', updatePreviewPosition);

// Handle extension enable/disable messages
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleExtension") {
        isExtensionEnabled = message.enabled;
        
        // Add or remove event listeners based on state
        if (isExtensionEnabled) {
            setupEventListeners();
        } else {
            removeEventListeners();
        }
    }
});