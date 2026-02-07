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

// Function to filter and generate HTML
// Function to filter and generate HTML
function renderProducts(category, limit, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return; 

  // 1. Filter the products
  let filteredList = products;
  if (category !== 'all') {
    filteredList = products.filter(p => p.category === category);
  }

  // 2. Limit the number of products
  if (limit) {
    filteredList = filteredList.slice(0, limit);
  }

  // 3. Generate the HTML
  let html = '';
  filteredList.forEach(product => {
    
    // --- NEW LOGIC: Calculate Discount ---
    const hasDiscount = product.dis > 0;
    // Calculate final price: Original - (Original * (Discount / 100))
    const finalPrice = hasDiscount 
        ? Math.floor(product.price - (product.price * (product.dis / 100))) 
        : product.price;

    // Create the HTML for the price section
    // If discount exists: Show crossed-out original + New Price
    // If no discount: Just show original price
    const priceDisplay = hasDiscount 
        ? `
           <div class="price-stack">
             <p class="discount-price">Rs ${product.price}</p>
             <h4 class="product-price">Rs ${finalPrice}/-</h4>
           </div>
          `
        : `<h4 class="product-price">Rs ${product.price}/-</h4>`;
    // -------------------------------------

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

// --- CALL THE FUNCTIONS ---

// 1. Home Page: "All Products" section (Limit 8)
renderProducts('all', 8, '.js-product-grid');

// 2. Home Page: "Men Watches" section (Limit 4)
renderProducts('men-watch', 4, '.js-product-grid-men');

// 3. Collection Page: (Show everything)
renderProducts('all', null, '.js-collection-grid');
// --- 4. Cart Count Logic (Runs on Load & Update) ---
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('ravyn_cart')) || [];
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const countElement = document.querySelector('.cart-button span');
  if (countElement) {
    countElement.innerText = totalCount;
    // Hide badge if 0, show if > 0
    countElement.style.display = totalCount > 0 ? 'block' : 'none';
  }
}

// Run immediately on page load
updateCartCount();


// --- 5. Slider Logic (Unchanged) ---
const track = document.querySelector('.slider-track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const slideWidth = 200; 
let autoPlayInterval;

function updateActive() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach(s => s.classList.remove('active'));
  if(slides[2]) slides[2].classList.add('active');
}
updateActive();

function moveNext() {
  track.style.transition = 'transform 0.5s linear';
  track.style.transform = `translateX(-${slideWidth}px)`;
  setTimeout(() => {
    track.style.transition = 'none';
    track.appendChild(track.firstElementChild);
    track.style.transform = 'translateX(0)';
    updateActive();
  }, 500);
}

function movePrev() {
  track.style.transition = 'none';
  track.prepend(track.lastElementChild);
  track.style.transform = `translateX(-${slideWidth}px)`;
  setTimeout(() => {
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = 'translateX(0)';
    updateActive();
  }, 20);
}

function startAutoPlay() { autoPlayInterval = setInterval(moveNext, 2500); }
function stopAutoPlay() { clearInterval(autoPlayInterval); }
function resetTimer() { stopAutoPlay(); startAutoPlay(); }
startAutoPlay();

const exploreBtn = document.getElementById('exploreBtn');
const featuredSection = document.querySelector('.fe-products');

if (exploreBtn && featuredSection) {
  exploreBtn.addEventListener('click', () => {
    featuredSection.scrollIntoView({ 
      behavior: 'smooth', 
    });
  });
}