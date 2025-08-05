// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// Update cart count in the header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounters = document.querySelectorAll('#cart-count');
    cartCounters.forEach(counter => {
        counter.textContent = count;
    });
}

// Add to cart functionality
function addToCart(event) {
    const button = event.target;
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    
    // Update cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Show added to cart message
    const message = document.createElement('div');
    message.classList.add('notification');
    message.textContent = `${name} added to cart!`;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Render cart items
function renderCart() {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateOrderSummary();
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="https://via.placeholder.com/100" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', updateQuantity);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeItem);
    });
    
    updateOrderSummary();
}

// Update quantity of cart item
function updateQuantity(event) {
    const button = event.target;
    const id = button.dataset.id;
    const item = cart.find(item => item.id === id);
    
    if (button.classList.contains('increase')) {
        item.quantity += 1;
    } else if (button.classList.contains('decrease')) {
        item.quantity = Math.max(1, item.quantity - 1);
    }
    
    // Update cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Re-render cart
    renderCart();
    updateCartCount();
}

// Remove item from cart
function removeItem(event) {
    const id = event.target.dataset.id;
    cart = cart.filter(item => item.id !== id);
    
    // Update cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Re-render cart
    renderCart();
    updateCartCount();
}

// Update order summary
function updateOrderSummary() {
    if (!subtotalElement) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Checkout button handler
function handleCheckout() {
    alert('Thank you for your purchase!');
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    renderCart();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to all "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Render cart if on cart page
    if (cartItemsContainer) {
        renderCart();
    }
    
    // Add event listener to checkout button if it exists
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Update cart count on page load
    updateCartCount();
});

// Add some basic notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
