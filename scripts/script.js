import imageData from './imageData.js';

// DOM Elements
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search');
const filterButtons = document.querySelectorAll('.filters button');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

// State
let currentFilter = 'all';
let currentSearch = '';

// Render images to gallery
function renderImages(images) {
  gallery.innerHTML = '';

  if (images.length === 0) {
    gallery.innerHTML = '<p class="no-results">No images found matching your search</p>';
    return;
  }

  images.forEach((img) => {
    const imageElement = document.createElement('div');
    imageElement.className = 'gallery-item';

    const imgTag = document.createElement('img');
    imgTag.src = img.src;
    imgTag.alt = img.category;

    // Add keywords as data attributes
    if (img.keywords) {
      imageElement.dataset.keywords = img.keywords.join(' ');
    }

    // Open lightbox when image is clicked
    imgTag.addEventListener('click', () => openLightbox(img.src));

    imageElement.appendChild(imgTag);
    gallery.appendChild(imageElement);
  });
}

// Filter images based on category and search term
function filterImages() {
  let filtered = [...imageData];

  // Apply category filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(img => img.category === currentFilter);
  }

  // Apply search filter
  if (currentSearch) {
    const searchTerm = currentSearch.trim().toLowerCase();
    filtered = filtered.filter(img => 
      img.category.toLowerCase().includes(searchTerm) || 
      (img.description && img.description.toLowerCase().includes(searchTerm))
    );
  }

  renderImages(filtered);
}

// Event Listeners
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update current filter
    currentFilter = button.getAttribute('data-category');

    // Update active button styling
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Apply filters and re-render
    filterImages();
  });
});

searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value.trim();
  filterImages();
});

// Lightbox functions
function openLightbox(src) {
  lightbox.style.display = 'flex';
  lightboxImg.src = src;
  document.body.style.overflow = 'hidden'; 
}

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeLightbox);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close lightbox with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.style.display === 'flex') {
    closeLightbox();
  }
});

// Initialize
function init() {
  // Set 'All' as active filter by default
  document.querySelector('.filters button[data-category="all"]').classList.add('active');
  renderImages(imageData);
}

init();
