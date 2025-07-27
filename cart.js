// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.updateCartDisplay();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                brand: product.brand,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartMessage(product.name);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (parseFloat(item.price.replace('₵', '')) * item.quantity);
        }, 0).toFixed(2);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }

    showAddToCartMessage(productName) {
        // Create and show a temporary message
        const message = document.createElement('div');
        message.className = 'cart-message';
        message.innerHTML = `
            <div class="alert alert-success" style="position: fixed; top: 20px; right: 20px; z-index: 1000; min-width: 300px;">
                <strong>${productName}</strong> added to cart!
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add event listeners for add to cart buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add cart icon to navigation
    addCartIconToNav();
    
    // Add event listeners to all add to cart buttons
    const addToCartButtons = document.querySelectorAll('.fal.fa-shopping-cart');
    addToCartButtons.forEach(button => {
        button.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productElement = this.closest('.pro');
            const product = extractProductInfo(productElement);
            cart.addItem(product);
        });
    });
});

function extractProductInfo(productElement) {
    const img = productElement.querySelector('img');
    const brand = productElement.querySelector('.des span');
    const name = productElement.querySelector('.des h5');
    const price = productElement.querySelector('.des h4');
    
    // Get the image filename without path
    const imageSrc = img.src;
    const imageFilename = imageSrc.split('/').pop();
    
    return {
        id: generateProductId(name.textContent, brand.textContent),
        name: name.textContent,
        price: price.textContent,
        image: imageFilename, // Store only the filename
        brand: brand.textContent
    };
}

function generateProductId(name, brand) {
    return (brand + '-' + name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function addCartIconToNav() {
    const navbar = document.querySelector('.navbar-nav');
    if (navbar && !document.querySelector('.cart-icon')) {
        const cartItem = document.createElement('li');
        cartItem.className = 'nav-item cart-icon';
        cartItem.innerHTML = `
            <a class="nav-link" href="cart.html" style="position: relative;">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count badge bg-danger" style="position: absolute; top: -5px; right: -5px; font-size: 12px;">0</span>
            </a>
        `;
        navbar.appendChild(cartItem);
        cart.updateCartDisplay();
    }
}




// Wishlist Functionality
class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("wishlistItems")) || [];
        this.updateWishlistDisplay();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (!existingItem) {
            this.items.push(product);
            this.saveWishlist();
            this.updateWishlistDisplay();
            this.showWishlistMessage(product.name, "added");
        } else {
            this.showWishlistMessage(product.name, "already_added");
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateWishlistDisplay();
    }

    saveWishlist() {
        localStorage.setItem("wishlistItems", JSON.stringify(this.items));
    }

    updateWishlistDisplay() {
        // This can be used to update a wishlist count in the future if needed
    }

    showWishlistMessage(productName, type) {
        const message = document.createElement("div");
        message.className = "wishlist-message";
        let messageText = "";
        if (type === "added") {
            messageText = `<strong>${productName}</strong> added to wishlist!`;
        } else if (type === "already_added") {
            messageText = `<strong>${productName}</strong> is already in your wishlist!`;
        }
        message.innerHTML = `
            <div class="alert alert-info" style="position: fixed; top: 70px; right: 20px; z-index: 1000; min-width: 300px;">
                ${messageText}
            </div>
        `;
        document.body.appendChild(message);
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }
}

const wishlist = new Wishlist();

document.addEventListener("DOMContentLoaded", function() {
    const addToWishlistButtons = document.querySelectorAll(".fal.fa-heart");
    addToWishlistButtons.forEach(button => {
        button.parentElement.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productElement = this.closest(".pro");
            const product = extractProductInfo(productElement);
            wishlist.addItem(product);
        });
    });
});



