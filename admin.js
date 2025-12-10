const API_URL = 'http://localhost:3000/api';

let currentUser = null;
let currentPage = 1;
let searchQuery = '';
let searchTimeout;

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(userData);

    // Check if user is admin
    if (!currentUser.isAdmin) {
        alert('Access Denied: Admin privileges required');
        window.location.href = 'index.html';
        return;
    }

    // Update UI with admin info
    document.getElementById('admin-name').innerText = currentUser.username;

    // Setup event listeners
    document.getElementById('admin-logout-btn').addEventListener('click', handleLogout);
    document.getElementById('order-search').addEventListener('input', handleSearch);
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));

    // Fetch data and start polling
    fetchOrders();
    fetchRevenue();
    fetchLastOrders();
    setInterval(fetchOrders, 5000);
    setInterval(fetchRevenue, 10000); // Update revenue every 10 seconds
});

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
        document.getElementById('stats-new').innerText = newOrders.length;
        document.getElementById('stats-cooking').innerText = cookingOrders.length;
        document.getElementById('stats-ready').innerText = readyOrders.length;

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
    try {
        await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        showToast(`Order #${id} moved to ${status}`);
        fetchOrders();
    } catch (err) {
        showToast('Failed to update order status', true);
    }
}

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    toast.className = `fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-[100] border ${isError ? 'bg-slate-800 border-red-500/50' : 'bg-slate-800 border-green-500/50'}`;
    toast.querySelector('i').className = isError ? "fa-solid fa-circle-exclamation text-red-400" : "fa-solid fa-circle-check text-green-400";
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

// Fetch Revenue Statistics
async function fetchRevenue() {
    try {
        const response = await fetch(`${API_URL}/revenue`);
        const data = await response.json();

        document.getElementById('revenue-today').innerText = `₹${parseFloat(data.today).toFixed(2)}`;
        document.getElementById('revenue-week').innerText = `₹${parseFloat(data.week).toFixed(2)}`;
        document.getElementById('revenue-month').innerText = `₹${parseFloat(data.month).toFixed(2)}`;
        document.getElementById('orders-today-count').innerText = data.todayCount;
    } catch (err) {
        console.error('Error fetching revenue:', err);
    }
}

// Fetch Last Orders with Pagination and Search
async function fetchLastOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/all?page=${currentPage}&limit=20&search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        renderLastOrders(data.orders);
        updatePagination(data);
    } catch (err) {
        console.error('Error fetching last orders:', err);
    }
}

function renderLastOrders(orders) {
    const tbody = document.getElementById('last-orders-body');
    const noOrdersMsg = document.getElementById('no-orders-message');

    tbody.innerHTML = '';

    if (orders.length === 0) {
        noOrdersMsg.classList.remove('hidden');
        return;
    }

    noOrdersMsg.classList.add('hidden');

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white/5 hover:bg-white/5 transition';

        // Status badge
        let statusBadge = '';
        let statusClass = '';
        switch (order.status) {
            case 'new':
                statusBadge = 'NEW';
                statusClass = 'bg-blue-500/20 text-blue-400';
                break;
            case 'cooking':
                statusBadge = 'COOKING';
                statusClass = 'bg-orange-500/20 text-orange-400';
                break;
            case 'ready':
                statusBadge = 'READY';
                statusClass = 'bg-green-500/20 text-green-400';
                break;
            case 'completed':
                statusBadge = 'COMPLETED';
                statusClass = 'bg-gray-500/20 text-gray-400';
                break;
        }

        const orderDate = new Date(order.created_at);
        const formattedDate = orderDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const formattedTime = orderDate.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        row.innerHTML = `
            <td class="py-3 px-4">
                <span class="font-mono font-bold text-white">#${order.id}</span>
            </td>
            <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-user text-gray-500 text-xs"></i>
                    <span class="text-gray-300">${order.user_name || 'Guest'}</span>
                </div>
            </td>
            <td class="py-3 px-4">
                <span class="font-bold text-white">₹${parseFloat(order.total_amount).toFixed(2)}</span>
            </td>
            <td class="py-3 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${statusClass}">${statusBadge}</span>
            </td>
            <td class="py-3 px-4">
                <div class="text-sm text-gray-400">
                    <div>${formattedDate}</div>
                    <div class="text-xs text-gray-500">${formattedTime}</div>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function updatePagination(data) {
    document.getElementById('showing-count').innerText = data.orders.length;
    document.getElementById('total-count').innerText = data.total;
    document.getElementById('current-page').innerText = data.page;

    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    prevBtn.disabled = data.page <= 1;
    nextBtn.disabled = data.page >= data.totalPages;
}

function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    fetchLastOrders();
}

function handleSearch(e) {
    clearTimeout(searchTimeout);
    searchQuery = e.target.value.trim();

    searchTimeout = setTimeout(() => {
        currentPage = 1; // Reset to first page on new search
        fetchLastOrders();
    }, 300);
}
