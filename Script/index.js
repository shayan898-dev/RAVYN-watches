// --- 1. Mobile Menu Logic ---
const bar = document.getElementById('bar');
const nav = document.querySelector('.header-right-section');
const close = document.getElementById('close');

if (bar) {
  bar.addEventListener('click', () => nav.classList.add('active'));
}
if (close) {
  close.addEventListener('click', () => nav.classList.remove('active'));
}

// --- 2. Product Rendering Function ---
function renderProducts(category, limit, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return; 

  let filteredList = products;
  if (category !== 'all') {
    filteredList = products.filter(p => p.category === category);
  }

  if (limit) {
    filteredList = filteredList.slice(0, limit);
  }

  let html = '';
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

// --- 3. EXECUTION LOGIC (STRICT SEPARATION) ---

// Check which page we are currently on
const collectionContainer = document.querySelector('.js-collection-grid');
const homeContainer = document.querySelector('.js-product-grid');

if (collectionContainer) {
  // WE ARE ON COLLECTION PAGE
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category') || 'all'; 
  renderProducts(categoryParam, null, '.js-collection-grid');
} 
else if (homeContainer) {
  // WE ARE ON HOME PAGE - Render all sections
  renderProducts('all', 8, '.js-product-grid');
  renderProducts('men-watch', 4, '.js-product-grid-men');
  renderProducts('women-watch', 4, '.js-product-grid-women');
  renderProducts('rolex-watch', 4, '.js-product-grid-rolex');
  renderProducts('patek-watch', 4, '.js-product-grid-patek');
  renderProducts('automatic-watch', 4, '.js-product-grid-automatic');
}

// --- 4. Utilities ---

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

// Slider Logic
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