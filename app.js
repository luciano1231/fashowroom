/* ===== FA SHOWROOM - Main App JS ===== */

// ===== DATA =====
const PRODUCTS = [
  { id: 1, name: 'Blazer Oversize', category: 'Sacos', price: 45000, stock: 5, isNew: true, sizes: ['S', 'M', 'L'], colors: ['Negro', 'Beige'], img: 'Imagenes/Catalogo/654eeef1e7527b885d33070c5d8a3c31.jpg' },
  { id: 2, name: 'Vestido Midi Satén', category: 'Vestidos', price: 38000, stock: 3, isNew: true, sizes: ['S', 'M'], colors: ['Rojo', 'Negro'], img: 'Imagenes/Catalogo/2200a248aad549a964402c20ea460953.jpg' },
  { id: 3, name: 'Jean Wide Leg', category: 'Pantalones', price: 32000, stock: 8, isNew: true, sizes: ['36', '38', '40', '42'], colors: ['Azul', 'Celeste'], img: 'Imagenes/Catalogo/171693f9423ca000208767ff960f5c02.jpg' },
  { id: 4, name: 'Top Cruzado', category: 'Tops', price: 18000, stock: 12, isNew: true, sizes: ['Único'], colors: ['Blanco', 'Negro', 'Rosa'], img: 'Imagenes/Catalogo/a52fedf7932446d54afc841f34f3f61d.jpg' },
  { id: 5, name: 'Falda Plisada', category: 'Faldas', price: 25000, stock: 0, isNew: false, sizes: ['S', 'M', 'L'], colors: ['Beige', 'Negro'], img: 'Imagenes/Catalogo/b4bb401c82cfca3f8d0b296ce3fbfdd3.jpg' },
  { id: 6, name: 'Camisa Lino', category: 'Camisas', price: 28000, stock: 2, isNew: false, sizes: ['M', 'L', 'XL'], colors: ['Blanco', 'Celeste'], img: 'Imagenes/Catalogo/1da1d306195e3cf7eb8e7486960a9686.jpg' },
  { id: 7, name: 'Pantalón Palazzo', category: 'Pantalones', price: 35000, stock: 6, isNew: true, sizes: ['S', 'M', 'L'], colors: ['Negro', 'Verde'], img: 'Imagenes/Catalogo/editorialtelevisa.brightspotcdn.jpg' },
  { id: 8, name: 'Vestido Corto Encaje', category: 'Vestidos', price: 42000, stock: 4, isNew: false, sizes: ['S', 'M'], colors: ['Blanco', 'Negro'], img: 'Imagenes/Catalogo/377057_0000104531_Back.webp' },
  { id: 9, name: 'Crop Top Tejido', category: 'Tops', price: 16000, stock: 15, isNew: false, sizes: ['Único'], colors: ['Beige', 'Rosa'], img: 'Imagenes/Catalogo/375760_0000007780.webp' },
  { id: 10, name: 'Blazer Entallado', category: 'Sacos', price: 48000, stock: 3, isNew: true, sizes: ['S', 'M', 'L'], colors: ['Rojo', 'Negro'], img: 'Imagenes/Catalogo/f636bf1805f1f77662df55ad31f31c62.jpg' },
  { id: 11, name: 'Mono Elegante', category: 'Monos', price: 52000, stock: 2, isNew: true, sizes: ['M', 'L'], colors: ['Negro'], img: 'Imagenes/Catalogo/e9e08b6edfc335bfdee06030520d5741.jpg' },
  { id: 12, name: 'Short Tiro Alto', category: 'Pantalones', price: 22000, stock: 7, isNew: false, sizes: ['36', '38', '40'], colors: ['Blanco', 'Negro'], img: 'Imagenes/Catalogo/da6f803d607c1f4a9747b5d0d5fddff0.jpg' },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('fa_cart') || '[]');
let currentUser = JSON.parse(localStorage.getItem('fa_user') || 'null');

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCarousel(); // For hero slider
  renderNewArrivals(); // For index.html
  initCatalog(); // For catalogo.html
  renderCartCount();
  initModals();
  initCart();
  updateAuthUI();
});

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger?.classList.remove('active');
    });
  });
}

// ===== RENDER NEW ARRIVALS =====
function renderNewArrivals() {
  const grid = document.getElementById('arrivals-grid');
  if (!grid) return;

  const newProducts = PRODUCTS.filter(p => p.isNew).slice(0, 8);
  grid.innerHTML = newProducts.map(p => createProductCard(p)).join('');
}

function createProductCard(product) {
  const stockClass = product.stock === 0 ? 'stock-out' : product.stock <= 3 ? 'stock-low' : 'stock-in';
  const stockText = product.stock === 0 ? 'Agotado' : product.stock <= 3 ? `¡Últimas ${product.stock}!` : 'En stock';
  
  const bgImage = product.img ? `style="background-image: url('${product.img}'); background-size: cover; background-position: center;"` : '';

  return `
    <div class="product-card" data-id="${product.id}">
      ${product.isNew ? '<span class="product-badge-new">Nuevo</span>' : ''}
      <div class="product-img" ${bgImage}>
        ${!product.img ? getCategoryEmoji(product.category) : ''}
        <div class="product-img-overlay">
          <button onclick="addToCart(${product.id})" title="Agregar al carrito">🛒</button>
          <button onclick="quickView(${product.id})" title="Vista rápida">👁</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-category">${product.category}</div>
        <div class="product-price-row">
          <span class="product-price">$${product.price.toLocaleString('es-AR')}</span>
          <span class="product-stock ${stockClass}">${stockText}</span>
        </div>
      </div>
    </div>
  `;
}

function getCategoryEmoji(cat) {
  const emojis = {
    'Sacos': '🧥', 'Vestidos': '👗', 'Pantalones': '👖', 'Tops': '👚',
    'Faldas': '🩱', 'Camisas': '👔', 'Monos': '🥻'
  };
  return emojis[cat] || '👗';
}

// ===== CART =====
function initCart() {
  const cartBtn = document.getElementById('cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartClose = document.getElementById('cart-close');

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('active');
  document.getElementById('cart-backdrop').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('active');
  document.getElementById('cart-backdrop').classList.remove('active');
  document.body.style.overflow = '';
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || product.stock === 0) {
    showToast('❌ Producto sin stock');
    return;
  }

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    if (existing.qty >= product.stock) {
      showToast('⚠️ Stock máximo alcanzado');
      return;
    }
    existing.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  renderCartCount();
  showToast(`✨ ${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCartCount();
  renderCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  const product = PRODUCTS.find(p => p.id === productId);
  if (!item || !product) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  if (item.qty > product.stock) {
    item.qty = product.stock;
    showToast('⚠️ Stock máximo alcanzado');
  }

  saveCart();
  renderCart();
  renderCartCount();
}

function saveCart() {
  localStorage.setItem('fa_cart', JSON.stringify(cart));
}

function renderCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  el.textContent = total;
  el.style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <p>Tu carrito está vacío</p>
        <p style="font-size:0.8rem; margin-top:8px;">Explorá nuestro catálogo y encontrá tu estilo</p>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  let total = 0;

  container.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    const subtotal = p.price * item.qty;
    total += subtotal;
    
    const imgContent = p.img 
      ? `<img src="${p.img}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`
      : getCategoryEmoji(p.category);

    return `
      <div class="cart-item">
        <div class="cart-item-img">${imgContent}</div>
        <div class="cart-item-details">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-meta">${p.category}</div>
          <div class="cart-item-price">$${subtotal.toLocaleString('es-AR')}</div>
          <div class="cart-item-qty">
            <button onclick="updateQty(${p.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${p.id}, 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${p.id})">✕ Eliminar</button>
        </div>
      </div>`;
  }).join('');

  document.getElementById('cart-total-amount').textContent = `$${total.toLocaleString('es-AR')}`;
}

function sendWhatsApp() {
  if (cart.length === 0) return;

  if (!currentUser) {
    closeCart();
    showModal('login');
    showToast('⚠️ Por favor, iniciá sesión para enviar el pedido');
    return;
  }

  let msg = '🛍️ *Pedido FA Showroom*\n\n';
  let total = 0;

  cart.forEach(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return;
    const subtotal = p.price * item.qty;
    total += subtotal;
    msg += `▸ ${p.name} (x${item.qty}) — $${subtotal.toLocaleString('es-AR')}\n`;
  });

  msg += `\n💰 *Total: $${total.toLocaleString('es-AR')}*\n`;

  msg += `\n👤 *Cliente:* ${currentUser.name}\n📄 *DNI:* ${currentUser.dni}\n`;

  msg += '\n¡Gracias! 💕';

  const phone = '5493794000000'; // Reemplazar con número real
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function quickView(productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  if (!p) return;
  showToast(`👁 ${p.name} — $${p.price.toLocaleString('es-AR')}`);
}

// ===== AUTH =====
function initModals() {
  const loginBtn = document.getElementById('login-btn');
  const overlay = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('modal-close');

  if (loginBtn) loginBtn.addEventListener('click', () => {
    if (currentUser) {
      showProfileMenu();
    } else {
      showModal('login');
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function showModal(type) {
  const overlay = document.getElementById('auth-modal');
  const content = document.getElementById('modal-content');

  if (type === 'login') {
    content.innerHTML = `
      <h2>Iniciar Sesión</h2>
      <p>Ingresá con tu DNI y PIN</p>
      <div class="form-group">
        <label for="login-dni">DNI</label>
        <input type="text" id="login-dni" placeholder="12345678" maxlength="8" inputmode="numeric">
      </div>
      <div class="form-group">
        <label for="login-pin">PIN (4 dígitos)</label>
        <input type="password" id="login-pin" placeholder="••••" maxlength="4" inputmode="numeric">
      </div>
      <button class="btn btn-primary btn-full" onclick="handleLogin()">Ingresar</button>
      <div class="form-switch">¿No tenés cuenta? <a onclick="showModal('register')">Registrate</a></div>
    `;
  } else {
    content.innerHTML = `
      <h2>Crear Cuenta</h2>
      <p>Registrate para guardar tus datos</p>
      <div class="form-group">
        <label for="reg-name">Nombre completo</label>
        <input type="text" id="reg-name" placeholder="Tu nombre">
      </div>
      <div class="form-group">
        <label for="reg-dni">DNI</label>
        <input type="text" id="reg-dni" placeholder="12345678" maxlength="8" inputmode="numeric">
      </div>
      <div class="form-group">
        <label for="reg-phone">Teléfono</label>
        <input type="tel" id="reg-phone" placeholder="3794123456">
      </div>
      <div class="form-group">
        <label for="reg-email">Email</label>
        <input type="email" id="reg-email" placeholder="tu@email.com">
      </div>
      <div class="form-group">
        <label for="reg-pin">Crear PIN (4 dígitos)</label>
        <input type="password" id="reg-pin" placeholder="••••" maxlength="4" inputmode="numeric">
      </div>
      <div class="form-group">
        <label for="reg-pin2">Confirmar PIN</label>
        <input type="password" id="reg-pin2" placeholder="••••" maxlength="4" inputmode="numeric">
      </div>
      <button class="btn btn-primary btn-full" onclick="handleRegister()">Crear Cuenta</button>
      <div class="form-switch">¿Ya tenés cuenta? <a onclick="showModal('login')">Iniciá sesión</a></div>
    `;
  }

  overlay.classList.add('active');
}

function closeModal() {
  document.getElementById('auth-modal').classList.remove('active');
}

function handleLogin() {
  const dni = document.getElementById('login-dni').value.trim();
  const pin = document.getElementById('login-pin').value.trim();

  if (!dni || dni.length < 7) { showToast('⚠️ Ingresá un DNI válido'); return; }
  if (!pin || pin.length !== 4) { showToast('⚠️ El PIN debe ser de 4 dígitos'); return; }

  const users = JSON.parse(localStorage.getItem('fa_users') || '[]');
  const user = users.find(u => u.dni === dni && u.pin === pin);

  if (!user) {
    showToast('❌ DNI o PIN incorrecto');
    return;
  }

  currentUser = user;
  localStorage.setItem('fa_user', JSON.stringify(user));
  updateAuthUI();
  closeModal();
  showToast(`👋 ¡Hola, ${user.name}!`);
}

function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const dni = document.getElementById('reg-dni').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pin = document.getElementById('reg-pin').value.trim();
  const pin2 = document.getElementById('reg-pin2').value.trim();

  if (!name) { showToast('⚠️ Ingresá tu nombre'); return; }
  if (!dni || dni.length < 7) { showToast('⚠️ Ingresá un DNI válido'); return; }
  if (!pin || pin.length !== 4) { showToast('⚠️ El PIN debe ser de 4 dígitos'); return; }
  if (pin !== pin2) { showToast('⚠️ Los PIN no coinciden'); return; }

  const users = JSON.parse(localStorage.getItem('fa_users') || '[]');
  if (users.find(u => u.dni === dni)) {
    showToast('⚠️ Este DNI ya está registrado');
    return;
  }

  const newUser = { name, dni, phone, email, pin };
  users.push(newUser);
  localStorage.setItem('fa_users', JSON.stringify(users));

  currentUser = newUser;
  localStorage.setItem('fa_user', JSON.stringify(newUser));
  updateAuthUI();
  closeModal();
  showToast(`✅ ¡Bienvenida, ${name}!`);
}

function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  if (!loginBtn) return;

  if (currentUser) {
    loginBtn.innerHTML = `<span style="font-size:0.75rem;">👤 ${currentUser.name.split(' ')[0]}</span>`;
    loginBtn.title = `Sesión: ${currentUser.name}`;
  } else {
    loginBtn.innerHTML = '👤';
    loginBtn.title = 'Iniciar sesión';
  }
}

function showProfileMenu() {
  if (confirm(`👤 ${currentUser.name}\n📄 DNI: ${currentUser.dni}\n\n¿Deseas cerrar sesión?`)) {
    currentUser = null;
    localStorage.removeItem('fa_user');
    updateAuthUI();
    showToast('👋 Sesión cerrada');
  }
}

// ===== TOAST =====
function showToast(message) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}

// ===== CATALOG LOGIC =====
function initCatalog() {
  const catalogGrid = document.getElementById('catalog-grid');
  if (!catalogGrid) return; // Only run on catalog page

  const filterSearch = document.getElementById('filter-search');
  const filterCategory = document.getElementById('filter-category');
  const filterSize = document.getElementById('filter-size');
  const filterColor = document.getElementById('filter-color');
  const filterPrice = document.getElementById('filter-price');
  const priceOutput = document.getElementById('price-output');

  function renderFilteredCatalog() {
    const term = filterSearch.value.toLowerCase();
    const cat = filterCategory.value;
    const size = filterSize.value;
    const color = filterColor.value;
    const maxPrice = parseInt(filterPrice.value);

    const filtered = PRODUCTS.filter(p => {
      if (term && !p.name.toLowerCase().includes(term)) return false;
      if (cat && p.category !== cat) return false;
      if (size && !p.sizes.includes(size)) return false;
      if (color && !p.colors.includes(color)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = '<div class="no-results">No se encontraron productos con esos filtros.</div>';
    } else {
      catalogGrid.innerHTML = filtered.map(p => createProductCard(p)).join('');
    }
  }

  // Event listeners
  [filterSearch, filterCategory, filterSize, filterColor].forEach(el => {
    el.addEventListener('input', renderFilteredCatalog);
  });

  filterPrice.addEventListener('input', (e) => {
    priceOutput.textContent = '$' + parseInt(e.target.value).toLocaleString('es-AR');
    renderFilteredCatalog();
  });

  // Initial render
  renderFilteredCatalog();
}

// ===== CAROUSEL LOGIC =====
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length <= 1) return;

  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000); // Cambia de imagen cada 4 segundos
}
