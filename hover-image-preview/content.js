// Create a single preview element that we can reuse
let previewElement = null;
let hideTimeout = null;
let currentHoveredLink = null;

// Function to create the preview element structure
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

// Function to extract image URLs from the fetched HTML
function extractImages(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    const imageUrls = Array.from(images)
        .filter(img => {
            // 排除包含data-link属性的广告图片
            return !img.hasAttribute('data-link');
        })
        .map(img => img.getAttribute('ess-data'))
        .filter(src => src); // 确保ess-data存在
    return imageUrls;
}


// Function to adjust the preview position
function adjustPosition(preview, linkRect) {
    const previewRect = preview.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate initial position (below the link)
    let left = linkRect.left;
    let top = linkRect.bottom + 5;
    
    // Check right edge
    if (left + previewRect.width > windowWidth) {
        left = windowWidth - previewRect.width - 5;
    }
    
    // Check left edge
    if (left < 5) {
        left = 5;
    }
    
    // Check bottom edge
    if (top + previewRect.height > windowHeight) {
        // Try placing above the link
        top = linkRect.top - previewRect.height - 5;
        // If still off screen, align to top
        if (top < 5) {
            top = 5;
        }
    }
    
    preview.style.left = `${left + window.scrollX}px`;
    preview.style.top = `${top + window.scrollY}px`;
}

// Function to show the preview
function showPreview(link, imageUrls) {
    clearTimeout(hideTimeout);
    currentHoveredLink = link;
    
    const preview = createPreviewElement();
    preview.innerHTML = '';
    
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
    
    // Position the preview
    const linkRect = link.getBoundingClientRect();
    adjustPosition(preview, linkRect);
    preview.style.display = 'flex';
}

// Function to hide the preview
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

// Update preview position on scroll
function updatePreviewPosition() {
    if (previewElement && previewElement.style.display !== 'none' && currentHoveredLink) {
        const linkRect = currentHoveredLink.getBoundingClientRect();
        adjustPosition(previewElement, linkRect);
    }
}

// Add scroll event listener
window.addEventListener('scroll', updatePreviewPosition);

// Add event listeners to links using event delegation
document.body.addEventListener('mouseover', (event) => {
    const link = event.target.closest('a');
    
    if (link && link.href && !link.href.startsWith('#') && !link.href.startsWith('javascript:')) {
        const url = link.href;
        
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
                    if (link.contains(event.target)) {
                        showPreview(link, imageUrls);
                    }
                } else {
                    hidePreview();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                hidePreview();
            });
    } else {
        hidePreview();
    }
});

document.body.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML' || event.relatedTarget.nodeName === 'BODY') {
        hidePreview();
    }
});
