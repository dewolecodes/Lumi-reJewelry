// Lumière Jewelry - Client-Side Store State Manager

// Helper to retrieve cart from localStorage
window.getCart = function() {
    try {
        return JSON.parse(localStorage.getItem('lumiere_cart') || '[]');
    } catch (e) {
        return [];
    }
};

// Helper to save cart to localStorage
window.saveCart = function(cart) {
    localStorage.setItem('lumiere_cart', JSON.stringify(cart));
    window.updateNavCounts();
    // Dispatch custom event so pages can listen for cart updates if needed
    window.dispatchEvent(new CustomEvent('lumiere_cart_updated', { detail: cart }));
};

// Add item to cart
window.addToCart = function(name, price, img, category) {
    let cart = window.getCart();
    let existing = cart.find(item => item.name === name);
    if (!existing) {
        cart.push({
            name: name,
            price: parseFloat(price),
            img: img,
            category: category,
            qty: 1
        });
    }
    window.saveCart(cart);
};

// Toggle cart item (Add if not present, remove if present)
window.toggleCart = function(name, price, img, category) {
    let cart = window.getCart();
    let index = cart.findIndex(item => item.name === name);
    let isAdded = false;
    if (index > -1) {
        cart.splice(index, 1);
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            img: img,
            category: category,
            qty: 1
        });
        isAdded = true;
    }
    window.saveCart(cart);
    return isAdded;
};

// Helper to retrieve wishlist from localStorage
window.getWishlist = function() {
    try {
        return JSON.parse(localStorage.getItem('lumiere_wishlist') || '[]');
    } catch (e) {
        return [];
    }
};

// Helper to save wishlist to localStorage
window.saveWishlist = function(wishlist) {
    localStorage.setItem('lumiere_wishlist', JSON.stringify(wishlist));
    window.updateNavCounts();
    window.dispatchEvent(new CustomEvent('lumiere_wishlist_updated', { detail: wishlist }));
};

// Toggle wishlist item (Add if not present, remove if present)
window.toggleWishlist = function(name, price, img, category) {
    let wishlist = window.getWishlist();
    let index = wishlist.findIndex(item => item.name === name);
    let isAdded = false;
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push({
            name: name,
            price: parseFloat(price),
            img: img,
            category: category
        });
        isAdded = true;
    }
    window.saveWishlist(wishlist);
    return isAdded;
};

// Update navbar badges and links dynamically
window.updateNavCounts = function() {
    const cart = window.getCart();
    const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    // Update cart counts in navbar
    const cartBadges = document.querySelectorAll('#cart-count');
    cartBadges.forEach(badge => {
        badge.innerText = cartCount;
    });

    const mobileCartBadges = document.querySelectorAll('#mobile-cart-count');
    mobileCartBadges.forEach(badge => {
        badge.innerText = cartCount;
    });

    // Update cart counts in tab headers on cart.html if they exist
    const tabBagCount = document.getElementById('tab-bag-count');
    if (tabBagCount) {
        tabBagCount.innerText = cart.length; // Distinct item types
    }

    const wishlist = window.getWishlist();
    const wishCount = wishlist.length;

    // Update wishlist counts in navbar
    const wishBadges = document.querySelectorAll('#wish-count');
    wishBadges.forEach(badge => {
        badge.innerText = wishCount;
    });

    const mobileWishBadges = document.querySelectorAll('#mobile-wish-count');
    mobileWishBadges.forEach(badge => {
        badge.innerText = wishCount;
    });

    const tabWishCount = document.getElementById('tab-wish-count');
    if (tabWishCount) {
        tabWishCount.innerText = wishCount;
    }
};

// Runs on DOM Content Loaded to hook up shared UI elements
document.addEventListener('DOMContentLoaded', () => {
    // 1. Update all Favorite links in headers and mobile overlays to point to wish.html
    const favLinks = document.querySelectorAll('a[href="index.html"]');
    favLinks.forEach(link => {
        const heartIcon = link.querySelector('.material-symbols-outlined');
        if (heartIcon && heartIcon.textContent.trim() === 'favorite') {
            link.setAttribute('href', 'wish.html');
        }
    });

    // Also update any explicit favorite links that might have different structures
    document.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === 'index.html' || !link.getAttribute('href')) {
            const hasHeart = link.querySelector('span.material-symbols-outlined');
            if (hasHeart && hasHeart.textContent.trim() === 'favorite') {
                link.setAttribute('href', 'wish.html');
            }
        }
    });

    // 2. Initial count updates
    window.updateNavCounts();
});
