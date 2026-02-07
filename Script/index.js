// --- 1. Mobile Menu Logic (Hamburger Menu) ---
const bar = document.getElementById('bar');
const nav = document.querySelector('.header-right-section');
const close = document.getElementById('close');

if (bar) {
  bar.addEventListener('click', () => nav.classList.add('active'));
}
if (close) {
  close.addEventListener('click', () => nav.classList.remove('active'));
}

// --- 2. Mobile Side Search Panel Logic ---
const mobileSearchTrigger = document.getElementById('mobileSearchTrigger');
const sideSearchPanel = document.getElementById('sideSearchPanel');
const closeSideSearch = document.getElementById('closeSideSearch');

if (mobileSearchTrigger && sideSearchPanel) {
    mobileSearchTrigger.addEventListener('click', () => {
        sideSearchPanel.classList.add('active'); // Slides in from the right
        // Automatically focus the input for the user
        setTimeout(() => document.getElementById('sideSearchInput').focus(), 300);
    });
}

if (closeSideSearch && sideSearchPanel) {
    closeSideSearch.addEventListener('click', () => {
        sideSearchPanel.classList.remove('active'); // Slides out to the right
    });
}

// --- 3. Unified Search & Suggestion Logic ---
function setupSearch(inputId, btnId, suggestionsId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    const suggestionsBox = document.getElementById(suggestionsId);

    if (!input || !suggestionsBox) return;

    // Handle instant suggestions as the user types
    input.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        suggestionsBox.innerHTML = '';

        if (query.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }

        const matches = products.filter(p => p.name.toLowerCase().includes(query));

        if (matches.length > 0) {
            matches.forEach(product => {
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                div.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="suggestion-img">
                    <div class="suggestion-info">
                        <h4>${product.name}</h4>
                        <p>Rs ${product.price}</p>
                    </div>
                `;
                div.addEventListener('click', () => {
                    window.location.href = `Product-detail.html?id=${product.id}`;
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    });

    // Execute full search on Enter or Button Click
    const execute = () => {
        const query = input.value.trim();
        if (query) {
            window.location.href = `collection.html?search=${encodeURIComponent(query)}`;
        }
    };

    if (btn) btn.addEventListener('click', execute);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') execute();
    });

    // Close suggestions if clicking outside the search area
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

// Initialize Desktop and Mobile Side-Panel searches
setupSearch('searchInput', 'searchBtn', 'searchSuggestions');
setupSearch('sideSearchInput', 'sideSearchBtn', 'sideSearchSuggestions');

// --- 4. Product Rendering Function ---
function renderProducts(category, limit, containerSelector, customList = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return; 

  let filteredList = customList || products;
  if (!customList && category !== 'all') {
    filteredList = products.filter(p => p.category === category);
  }

  if (limit) {
    filteredList = filteredList.slice(0, limit);
  }

  let html = '';
  
  if (filteredList.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 20px; padding: 50px;">No products found.</p>`;
    return;
  }

  filteredList.forEach(product => {
    const hasDiscount = product.dis > 0;
    const finalPrice = hasDiscount 
        ? Math.floor(product.price - (product.price * (product.dis / 100))) 
        : product.price;

    const priceDisplay = hasDiscount 
        ? `<div class="price-stack">
             <p class="discount-price">Rs ${product.price}</p>
             <h4 class="product-price">Rs ${finalPrice}/-</h4>
           </div>`
        : `<h4 class="product-price">Rs ${product.price}/-</h4>`;

    html += `
      <div class="products js-product" onclick="window.location.href='Product-detail.html?id=${product.id}'">
        <div class="products-top">
          <div class="dis-container ${product.dis === 0 ? 'dis-container-display' : ''}">
            <p class="discount">${product.dis}% OFF</p>
          </div>
          <img class="product-image" src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-bottom">
          <p class="product-owner">RAVYN Watch</p>
          <div class="product-name-container"><h2 class="product-name">${product.name}</h2></div>
          <div class="parice-button-container"> 
            ${priceDisplay} <i class="fa-solid fa-cart-shopping"></i>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// --- 5. EXECUTION LOGIC ---
const collectionContainer = document.querySelector('.js-collection-grid');
const homeContainer = document.querySelector('.js-product-grid');

if (collectionContainer) {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category') || 'all'; 
  const searchParam = urlParams.get('search');

  if (searchParam) {
    const query = searchParam.toLowerCase();
    const searchResults = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    );
    
    const heading = document.querySelector('.product-heading');
    if (heading) heading.innerText = `Search Results for: "${searchParam}"`;
    
    renderProducts(null, null, '.js-collection-grid', searchResults);
  } else {
    renderProducts(categoryParam, null, '.js-collection-grid');
  }
} 
else if (homeContainer) {
  renderProducts('all', 8, '.js-product-grid');
  renderProducts('men-watch', 4, '.js-product-grid-men');
  renderProducts('women-watch', 4, '.js-product-grid-women');
  renderProducts('rolex-watch', 4, '.js-product-grid-rolex');
  renderProducts('patek-watch', 4, '.js-product-grid-patek');
  renderProducts('automatic-watch', 4, '.js-product-grid-automatic');
}

// --- 6. Utilities ---

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('ravyn_cart')) || [];
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const countElement = document.querySelector('.cart-button span');
  if (countElement) {
    countElement.innerText = totalCount;
    countElement.style.display = totalCount > 0 ? 'block' : 'none';
  }
}
updateCartCount();

const track = document.querySelector('.slider-track');
const slideWidth = 200; 
let autoPlayInterval;

function updateActive() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 0) {
    slides.forEach(s => s.classList.remove('active'));
    if(slides[2]) slides[2].classList.add('active');
  }
}

function moveNext() {
  if (!track) return;
  track.style.transition = 'transform 0.5s linear';
  track.style.transform = `translateX(-${slideWidth}px)`;
  setTimeout(() => {
    track.style.transition = 'none';
    track.appendChild(track.firstElementChild);
    track.style.transform = 'translateX(0)';
    updateActive();
  }, 500);
}

function startAutoPlay() { if(track) autoPlayInterval = setInterval(moveNext, 2500); }
function stopAutoPlay() { clearInterval(autoPlayInterval); }
if (track) {
  updateActive();
  startAutoPlay();
}

const exploreBtn = document.getElementById('exploreBtn');
const featuredSection = document.querySelector('.fe-products');
if (exploreBtn && featuredSection) {
  exploreBtn.addEventListener('click', () => {
    featuredSection.scrollIntoView({ behavior: 'smooth' });
  });
}