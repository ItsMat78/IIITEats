const API_URL = 'http://localhost:3000/api';

// --- STATE ---
let menuItems = [];
let cart = [];
let walletBalance = 500.00;
let activeFilters = new Set(['all']);
let currentView = 'customer';
let currentSort = 'popularity';
let currentUser = null; // Will store logged in user or guest

// Carousel State
let trendingItems = [];
let currentSlide = 0;
let slideInterval;

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(userData);

    // Redirect admins to admin page
    if (currentUser.isAdmin) {
        window.location.href = 'admin.html';
        return;
    }

    walletBalance = currentUser.walletBalance;

    // Update UI with user info
    updateUserUI();

    fetchMenu();
    fetchOrders();
    updateWalletUI();
    setupEventListeners();
    setInterval(fetchOrders, 5000);
});

// --- CAROUSEL LOGIC ---
function startCarousel() {
    trendingItems = menuItems.slice(0, 5); 
    if(trendingItems.length > 0) {
        renderSlide(0); // Render first slide
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
        
        const container = document.getElementById('carousel-container');
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
    }
}

// --- CAROUSEL LOGIC ---

// 1. Pass 'next' direction
function nextSlide() {
    currentSlide = (currentSlide + 1) % trendingItems.length;
    renderSlide(currentSlide, 'next');
}

// 2. Pass 'prev' direction
function prevSlide() {
    currentSlide = (currentSlide - 1 + trendingItems.length) % trendingItems.length;
    renderSlide(currentSlide, 'prev');
}

// 3. Render with Direction
function renderSlide(index, direction = 'next') {
    if (!trendingItems || trendingItems.length === 0) return;

    const item = trendingItems[index];
    const bgContainer = document.getElementById('carousel-bg');
    const textContainer = document.getElementById('carousel-text');
    const mainContainer = document.getElementById('carousel-container');

    if (!bgContainer || !textContainer) return;
    
    // Determine CSS classes based on direction
    const imgClass = direction === 'next' ? 'slide-in-from-right' : 'slide-in-from-left';
    const textClass = direction === 'next' ? 'text-fade-in-right' : 'text-fade-in-left';

    // We do NOT wait for fade-out anymore. We swap immediately for a snappy slide feel.
    
    // A. Update Background Image
    bgContainer.innerHTML = `
        <img src="${item.image}" class="absolute inset-0 w-full h-full object-cover ${imgClass}">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
    `;
    
    // B. Update Text Content
    textContainer.innerHTML = `
        <div class="flex flex-col items-start ${textClass}">
            <span class="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                Trending Now 🔥
            </span>
            <h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow-lg">
                ${item.name}
            </h2>
            <p class="text-gray-200 text-lg mb-8 max-w-md drop-shadow-md font-medium">
                Try the most loved dish on campus today. Freshly prepared in ${item.time}.
            </p>
            <button onclick="openItemDetails(${item.id}); event.stopPropagation();" class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold hover:scale-105 transition shadow-lg shadow-orange-500/40">
                Order Now
            </button>
        </div>
    `;
    
    mainContainer.onclick = () => openItemDetails(item.id);
}
// --- FILTER & SEARCH ---
function toggleFilter(filter) {
    if (filter === 'all') {
        activeFilters.clear();
        activeFilters.add('all');
    } else {
        activeFilters.delete('all');
        if (activeFilters.has(filter)) activeFilters.delete(filter);
        else activeFilters.add(filter);
        if (activeFilters.size === 0) activeFilters.add('all');
    }

    // Update desktop filters
    document.querySelectorAll('#filter-container .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnType = btn.id.replace('btn-', '');
        if (activeFilters.has(btnType)) btn.classList.add('active');
    });

    // Update mobile filters
    document.querySelectorAll('#mobile-filter-menu .filter-option').forEach(option => {
        option.classList.remove('active');
        const optionFilter = option.id.replace('mobile-btn-', '');
        if (activeFilters.has(optionFilter)) option.classList.add('active');
    });

    renderMenu();
}

// --- API & RENDER ---
async function fetchMenu(searchTerm = '') {
    try {
        const response = await fetch(`${API_URL}/menu?search=${searchTerm}`);
        const data = await response.json();
        
        menuItems = data.map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            category: item.category_name ? item.category_name.toLowerCase() : 'general', 
            image: item.image_url, 
            veg: Boolean(item.is_veg),
            spicy: item.spicy_level || 0,
            time: (item.prep_time_mins || 15) + ' min',
            cal: item.calories || 0
        }));

        renderMenu();
        if(!searchTerm) startCarousel();
    } catch (err) { console.error(err); }
}

function renderMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    let filtered = menuItems.filter(item => {
        if (activeFilters.has('all')) return true;
        let matches = false;
        
        if (activeFilters.has('veg') && item.veg) matches = true;
        if (activeFilters.has('nonveg') && !item.veg) matches = true;
        if (activeFilters.has('spicy') && item.spicy >= 2) matches = true;
        if (activeFilters.has('budget') && item.price <= 100) matches = true;
        if (activeFilters.has('lowcal') && item.cal <= 300) matches = true;
        
        return matches;
    });

    // Apply sorting
    filtered = applySorting(filtered);

    filtered.forEach(item => {
        let spiceIcons = '🌶️'.repeat(item.spicy);
        const typeColor = item.veg ? 'border-green-500' : 'border-red-500';
        const typeText = item.veg ? 'VEG' : 'NON-VEG';

        const card = document.createElement('div');
        card.className = "glass-card rounded-2xl p-0 overflow-hidden relative group cursor-pointer";
        
        // Correctly call openItemDetails when card is clicked
        card.onclick = (e) => {
            if(e.target.closest('button')) return; 
            openItemDetails(item.id);
        };

        // Added loading="lazy" for performance
        card.innerHTML = `
            <div class="h-40 overflow-hidden relative">
                <img src="${item.image}" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border ${typeColor} border-l-4 text-[10px] font-bold uppercase text-white shadow-lg">
                    ${typeText}
                </div>
                <div class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white flex gap-2 border border-white/10">
                     <span>⏱ ${item.time}</span>
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
    <div>
        <h3 class="font-bold text-lg leading-tight group-hover:text-orange-400 transition break-words pr-2">${item.name}</h3>
        
        <div class="text-xs mt-1 text-orange-500 h-4">${spiceIcons}</div>
    </div>
    <span class="font-bold text-xl text-white whitespace-nowrap">₹${item.price}</span>
</div>
                <button onclick="openItemDetails(${item.id})" class="w-full mt-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-orange-500 hover:border-orange-500 text-sm font-bold transition flex items-center justify-center gap-2">
                    View Details
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- SORTING LOGIC ---
function applySorting(items) {
    const sorted = [...items];
    
    switch(currentSort) {
        case 'popularity':
            // Sort by trending (random with weighted bias towards beginning)
            sorted.sort(() => Math.random() - 0.4);
            break;
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'fastest':
            // Parse time and sort (assumes format like "15 min")
            sorted.sort((a, b) => {
                const timeA = parseInt(a.time);
                const timeB = parseInt(b.time);
                return timeA - timeB;
            });
            break;
        case 'rating':
            // Sort by rating (higher first)
            sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
            break;
        default:
            break;
    }
    
    return sorted;
}

function setSort(sortType) {
    currentSort = sortType;
    
    // Update UI - highlight active option and update label
    document.querySelectorAll('.sort-option').forEach(option => {
        if (option.dataset.sort === sortType) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Update button label and icon
    const sortLabelMap = {
        'popularity': { icon: 'fa-fire', label: 'Trending' },
        'price-low': { icon: 'fa-arrow-up-short-wide', label: 'Price: Low to High' },
        'price-high': { icon: 'fa-arrow-down-wide-short', label: 'Price: High to Low' },
        'fastest': { icon: 'fa-bolt', label: 'Fastest Delivery' },
        'rating': { icon: 'fa-star', label: 'Top Rated' }
    };
    
    const sortInfo = sortLabelMap[sortType];
    const btn = document.getElementById('sort-dropdown-btn');
    const label = document.getElementById('sort-label');
    
    label.textContent = sortInfo.label;
    btn.querySelectorAll('i')[0].className = `fa-solid ${sortInfo.icon}`;
    
    renderMenu();
}

// --- MODAL LOGIC ---
function openItemDetails(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    document.getElementById('modal-img').src = item.image;
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-price').innerText = `₹${item.price}`;
    document.getElementById('modal-cat').innerText = item.category.toUpperCase();
    document.getElementById('modal-cal').innerHTML = `<i class="fa-solid fa-fire text-orange-500"></i> ${item.cal} cal`;
    document.getElementById('modal-time').innerHTML = `<i class="fa-regular fa-clock text-blue-400"></i> ${item.time}`;
    
    const tag = document.getElementById('modal-tag');
    tag.innerText = item.veg ? "VEG" : "NON-VEG";
    tag.className = `absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold text-white backdrop-blur-md border ${item.veg ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`;

    const btn = document.getElementById('modal-add-btn');
    btn.onclick = () => {
        addToCart(item.id);
        closeModal();
        // REMOVED toggleCart() here so cart stays closed
    };

    const modal = document.getElementById('item-modal');
    const modalContent = modal.querySelector('.animate-fade-in');
    
    modal.classList.remove('hidden');
    // Add pop animation
    modalContent.classList.add('modal-enter');
}

function closeModal() {
    const modal = document.getElementById('item-modal');
    modal.classList.add('hidden');
    // Clean up animation class
    const modalContent = modal.querySelector('.animate-fade-in');
    modalContent.classList.remove('modal-enter');
}

// --- CART ---
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if(!item) return;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({...item, qty: 1});
    
    updateCartUI();
    showToast(`Added ${item.name} to Tray`);
}

function removeFromCart(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index > -1) {
        if (cart[index].qty > 1) cart[index].qty--;
        else cart.splice(index, 1);
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const countBadge = document.getElementById('cart-count');
    
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        container.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-slate-500"><i class="fa-solid fa-basket-shopping text-4xl mb-3 opacity-20"></i><p>Tray is empty</p></div>';
        countBadge.innerText = '0';
        countBadge.style.display = 'none';
        document.getElementById('cart-total').innerText = '₹0';
        return;
    }

    container.innerHTML = '';
    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        const div = document.createElement('div');
        div.className = "flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5";
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="${item.image}" class="w-10 h-10 rounded-lg object-cover">
                <div>
                    <h4 class="font-bold text-sm text-gray-200 w-32 truncate">${item.name}</h4>
                    <div class="text-xs text-gray-400">₹${item.price} x ${item.qty}</div>
                </div>
            </div>
            <div class="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-white/5">
                <button onclick="removeFromCart(${item.id})" class="w-6 h-6 flex items-center justify-center text-xs hover:text-red-400"><i class="fa-solid fa-minus"></i></button>
                <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                <button onclick="addToCart(${item.id})" class="w-6 h-6 flex items-center justify-center text-xs hover:text-green-400"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        container.appendChild(div);
    });

    countBadge.innerText = count;
    countBadge.style.display = count > 0 ? 'flex' : 'none';
    document.getElementById('cart-total').innerText = `₹${total}`;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    }
}

async function checkout() {
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    if(total === 0) return;

    if (total > walletBalance) {
        showToast("Insufficient Balance!", true);
        return;
    }

    // For guest users, show payment form (no autofill)
    if (currentUser.isGuest) {
        showGuestPaymentModal(total);
        return;
    }

    // For logged-in users, process payment directly
    const payload = { userName: currentUser.username, total: total, items: cart };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            walletBalance -= total;
            currentUser.walletBalance = walletBalance;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Update wallet in database for logged-in users
            if (!currentUser.isGuest) {
                await fetch(`${API_URL}/users/${currentUser.username}/wallet`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: walletBalance })
                });
            }

            updateWalletUI();
            cart = [];
            updateCartUI();
            toggleCart();
            showToast(`Order Placed! ID: #${result.orderId}`);
            fetchOrders();
        } else {
            showToast(`Order Failed: ${result.error}`, true);
        }
    } catch (err) {
        showToast("Connection Failed", true);
    }
}

function showGuestPaymentModal(total) {
    // Create a payment modal for guest users
    const modal = document.createElement('div');
    modal.id = 'guest-payment-modal';
    modal.className = 'fixed inset-0 z-[80] flex items-center justify-center px-4';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeGuestPaymentModal()"></div>
        <div class="relative bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-8 animate-fade-in">
            <h2 class="text-2xl font-bold mb-4">Guest Payment</h2>
            <p class="text-gray-400 mb-6">Please enter your payment details to complete the order.</p>

            <form id="guest-payment-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold mb-2 text-gray-300">Name</label>
                    <input type="text" id="guest-name" placeholder="Enter your name" required
                        class="w-full bg-slate-800/80 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 focus:bg-slate-800 transition" />
                </div>

                <div>
                    <label class="block text-sm font-semibold mb-2 text-gray-300">Phone Number</label>
                    <input type="tel" id="guest-phone" placeholder="Enter phone number" required pattern="[0-9]{10}"
                        class="w-full bg-slate-800/80 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 focus:bg-slate-800 transition" />
                </div>

                <div>
                    <label class="block text-sm font-semibold mb-2 text-gray-300">Payment Method</label>
                    <select id="guest-payment-method"
                        class="w-full bg-slate-800/80 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 focus:bg-slate-800 transition">
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                        <option value="Cash">Cash on Delivery</option>
                    </select>
                </div>

                <div class="pt-4 border-t border-white/10">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-gray-400">Total Amount:</span>
                        <span class="text-2xl font-bold text-white">₹${total}</span>
                    </div>

                    <button type="submit"
                        class="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-bold text-white shadow-lg hover:shadow-green-500/30 transition">
                        Confirm Payment
                    </button>

                    <button type="button" onclick="closeGuestPaymentModal()"
                        class="w-full mt-3 py-3 rounded-xl bg-white/5 border border-white/10 font-semibold text-gray-300 hover:bg-white/10 transition">
                        Cancel
                    </button>
                </div>
            </form>

            <button onclick="closeGuestPaymentModal()"
                class="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 hover:bg-black/50 w-8 h-8 rounded-full flex items-center justify-center transition">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle form submission
    document.getElementById('guest-payment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await processGuestPayment(total);
    });
}

async function processGuestPayment(total) {
    const name = document.getElementById('guest-name').value;
    const phone = document.getElementById('guest-phone').value;
    const paymentMethod = document.getElementById('guest-payment-method').value;

    const payload = {
        userName: 'guest',
        total: total,
        items: cart,
        guestInfo: { name, phone, paymentMethod }
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            walletBalance -= total;
            currentUser.walletBalance = walletBalance;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            updateWalletUI();
            cart = [];
            updateCartUI();
            closeGuestPaymentModal();
            toggleCart();
            showToast(`Order Placed! ID: #${result.orderId}`);
            fetchOrders();
        } else {
            showToast(`Order Failed: ${result.error}`, true);
        }
    } catch (err) {
        showToast("Connection Failed", true);
    }
}

window.closeGuestPaymentModal = function() {
    const modal = document.getElementById('guest-payment-modal');
    if (modal) modal.remove();
}

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    toast.className = `fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-[100] border ${isError ? 'bg-slate-800 border-red-500/50' : 'bg-slate-800 border-green-500/50'}`;
    toast.querySelector('i').className = isError ? "fa-solid fa-circle-exclamation text-red-400" : "fa-solid fa-circle-check text-green-400";
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

function setupEventListeners() {
    document.getElementById('cart-btn').addEventListener('click', () => toggleCart());
    document.getElementById('close-cart-btn').addEventListener('click', () => toggleCart());
    document.getElementById('overlay').addEventListener('click', () => toggleCart());
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    
    // Search with debouncing and dropdown
    const searchInput = document.getElementById('search-input');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        searchTimeout = setTimeout(() => {
            if (query.length > 0) {
                updateSearchDropdown(query);
            } else {
                hideSearchDropdown();
            }
            fetchMenu(query);
        }, 300);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-input') && !e.target.closest('#search-dropdown')) {
            hideSearchDropdown();
        }
    });
    
    // Open dropdown on focus if there's a query
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 0) {
            document.getElementById('search-dropdown').classList.remove('hidden');
        }
    });
    
    // Sort dropdown toggle
    const sortDropdownBtn = document.getElementById('sort-dropdown-btn');
    const sortDropdownMenu = document.getElementById('sort-dropdown-menu');
    
    sortDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortDropdownMenu.classList.toggle('hidden');
    });
    
    // Close sort dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#sort-dropdown-btn') && !e.target.closest('#sort-dropdown-menu')) {
            sortDropdownMenu.classList.add('hidden');
        }
    });
    
    // Close sort dropdown when an option is selected
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', () => {
            sortDropdownMenu.classList.add('hidden');
        });
    });
    
    // Mobile filter button toggle
    const mobileFilterBtn = document.getElementById('mobile-filter-btn');
    const mobileFilterMenu = document.getElementById('mobile-filter-menu');
    
    if (mobileFilterBtn) {
        mobileFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileFilterMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile filter menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#mobile-filter-btn') && !e.target.closest('#mobile-filter-menu')) {
            mobileFilterMenu.classList.add('hidden');
        }
    });
    
    // Close mobile filter menu when an option is selected
    document.querySelectorAll('#mobile-filter-menu .filter-option').forEach(option => {
        option.addEventListener('click', () => {
            mobileFilterMenu.classList.add('hidden');
        });
    });
}

function updateWalletUI() {
    document.getElementById('wallet-balance').innerText = `₹${walletBalance.toFixed(2)}`;
}

function updateUserUI() {
    // Update wallet display with user name
    const walletDisplay = document.getElementById('wallet-display');

    // Add logout button to navbar
    const navRightSection = document.querySelector('.flex.items-center.gap-4.shrink-0');

    // Check if logout button doesn't exist yet
    if (!document.getElementById('user-info-btn')) {
        const userInfoBtn = document.createElement('button');
        userInfoBtn.id = 'user-info-btn';
        userInfoBtn.className = 'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition';
        userInfoBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${currentUser.username}`;

        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500 border border-red-500/50 text-xs font-semibold text-red-300 hover:text-white transition';
        logoutBtn.innerHTML = `<i class="fa-solid fa-sign-out-alt"></i> Logout`;
        logoutBtn.onclick = handleLogout;

        // Insert before wallet display
        navRightSection.insertBefore(logoutBtn, walletDisplay);
        navRightSection.insertBefore(userInfoBtn, logoutBtn);
    }

    // If guest mode, show a badge
    if (currentUser.isGuest) {
        const guestBadge = document.createElement('span');
        guestBadge.className = 'text-xs text-orange-400 font-semibold';
        guestBadge.innerText = '(Guest)';
        document.getElementById('user-info-btn').appendChild(guestBadge);
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}
async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        const orders = await response.json();

        // Filter orders by status
        const newOrders = orders.filter(o => o.status === 'new');
        const cookingOrders = orders.filter(o => o.status === 'cooking');
        const readyOrders = orders.filter(o => o.status === 'ready');

        // Update statistics
        if (document.getElementById('stats-new')) {
            document.getElementById('stats-new').innerText = newOrders.length;
            document.getElementById('stats-cooking').innerText = cookingOrders.length;
            document.getElementById('stats-ready').innerText = readyOrders.length;
        }

        // --- ADMIN RENDER LOGIC ---
        const cols = {
            new: document.getElementById('col-new'),
            cooking: document.getElementById('col-cooking'),
            ready: document.getElementById('col-ready')
        };

        Object.values(cols).forEach(el => {
            if (el) el.innerHTML = '';
        });

        orders.forEach(order => {
            if (!cols[order.status]) return;

            const ticket = document.createElement('div');
            ticket.className = "bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all";

            // Calculate time since order
            const orderTime = new Date(order.created_at);
            const now = new Date();
            const diffMinutes = Math.floor((now - orderTime) / 60000);
            const timeAgo = diffMinutes < 1 ? 'Just now' : `${diffMinutes}m ago`;

            let btn = '';
            let statusBadge = '';

            if (order.status === 'new') {
                btn = `<button onclick="updateStatus(${order.id}, 'cooking')" class="w-full mt-3 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-play"></i> Start Cooking
                </button>`;
                statusBadge = '<span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">NEW</span>';
            } else if (order.status === 'cooking') {
                btn = `<button onclick="updateStatus(${order.id}, 'ready')" class="w-full mt-3 py-2 bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-check"></i> Mark Ready
                </button>`;
                statusBadge = '<span class="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full animate-pulse">COOKING</span>';
            } else {
                btn = `<button onclick="updateStatus(${order.id}, 'completed')" class="w-full mt-3 py-2 bg-green-600/20 hover:bg-green-600 text-green-300 hover:text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-circle-check"></i> Complete Order
                </button>`;
                statusBadge = '<span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">READY</span>';
            }

            ticket.innerHTML = `
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <span class="font-mono text-lg font-bold text-white">#${order.id}</span>
                        ${statusBadge}
                    </div>
                    <span class="text-xs text-gray-500 font-medium">${timeAgo}</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-gray-400">Total Amount</span>
                    <span class="text-xl font-bold text-white">₹${order.total_amount}</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <i class="fa-solid fa-user"></i>
                    <span>${order.user_name || 'Guest'}</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                    <i class="fa-regular fa-clock"></i>
                    <span>${new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                ${btn}
            `;

            cols[order.status].appendChild(ticket);
        });

        // Show empty states
        Object.keys(cols).forEach(status => {
            if (cols[status] && cols[status].children.length === 0) {
                cols[status].innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                        <i class="fa-solid fa-inbox text-4xl mb-2"></i>
                        <p class="text-sm">No ${status} orders</p>
                    </div>
                `;
            }
        });
    } catch (e) {
        console.error('Error fetching orders:', e);
    }
}

window.updateStatus = async (id, status) => {
    await fetch(`${API_URL}/orders/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status})});
    fetchOrders();
}

// --- SEARCH DROPDOWN FUNCTIONS ---
function updateSearchDropdown(query) {
    const dropdown = document.getElementById('search-dropdown');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    // Filter menu items based on query
    const filtered = menuItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8); // Limit to 8 suggestions
    
    suggestionsContainer.innerHTML = '';
    
    if (filtered.length === 0) {
        suggestionsContainer.innerHTML = `
            <div class="search-no-results">
                <div><i class="fa-solid fa-magnifying-glass"></i></div>
                <div>No items found for "${query}"</div>
            </div>
        `;
    } else {
        filtered.forEach(item => {
            const suggestion = document.createElement('div');
            suggestion.className = 'search-suggestion-item';
            suggestion.onclick = () => {
                openItemDetails(item.id);
                document.getElementById('search-input').value = '';
                hideSearchDropdown();
            };
            
            suggestion.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="search-suggestion-text">
                    <div class="search-suggestion-name">${item.name}</div>
                    <div class="search-suggestion-category">${item.category}</div>
                </div>
                <div class="search-suggestion-price">₹${item.price}</div>
            `;
            
            suggestionsContainer.appendChild(suggestion);
        });
    }
    
    dropdown.classList.remove('hidden');
}

function hideSearchDropdown() {
    const dropdown = document.getElementById('search-dropdown');
    dropdown.classList.add('hidden');
}