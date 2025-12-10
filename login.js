const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }

    setupEventListeners();
});

function setupEventListeners() {
    // Login form submit
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });

    // Guest button
    document.getElementById('guest-btn').addEventListener('click', () => {
        handleGuestLogin();
    });

    // Toggle password visibility
    document.getElementById('toggle-password').addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const icon = document.querySelector('#toggle-password i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showToast('Please enter both username and password', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.id,
                username: data.user.username,
                walletBalance: data.user.wallet_balance,
                isAdmin: data.user.is_admin,
                phone: data.user.phone,
                isGuest: false
            }));

            showToast('Login successful!');

            // Redirect based on user role
            setTimeout(() => {
                if (data.user.is_admin) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            showToast(data.error || 'Login failed', true);
        }
    } catch (err) {
        console.error(err);
        showToast('Connection error. Please try again.', true);
    }
}

function handleGuestLogin() {
    // Store guest user data
    localStorage.setItem('currentUser', JSON.stringify({
        id: null,
        username: 'Guest',
        walletBalance: 500,
        isAdmin: false,
        phone: null,
        isGuest: true
    }));

    showToast('Continuing as guest...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    toast.className = `fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-[100] border ${isError ? 'bg-slate-800 border-red-500/50' : 'bg-slate-800 border-green-500/50'}`;
    toast.querySelector('i').className = isError ? "fa-solid fa-circle-exclamation text-red-400" : "fa-solid fa-circle-check text-green-400";
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}
