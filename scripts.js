

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function updateTotal() {
    let total = 0;
    cartItems.forEach(item => {
        total += item.price * item.quantity;
    });
    document.getElementById('totalPrice').textContent = total.toFixed(2);
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        updateTotal();
        return;
    }

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item d-flex align-items-center mb-3';
        cartItem.id = `cart-item-${item.id}`;

        cartItem.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}" class="img-thumbnail" style="max-width: 100px; margin-right: 15px;">
            <div class="cart-item-info flex-grow-1">
                <h5 class="mb-1">${item.title}</h5>
                
                <!-- Основная стоимость товара -->
                <p class="mb-1"><strong>Total Price:</strong> $${(item.price * item.quantity).toFixed(2)}</p>
                
                <!-- Изначальная цена товара -->
                <p class="mb-1 text-muted"><strong>Price per unit:</strong> $${item.price.toFixed(2)}</p>

                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-secondary decrease-quantity">-</button>
                    <input type="number" class="form-control form-control-sm mx-2 quantity-input" value="${item.quantity}" min="1" style="width: 60px;">
                    <button class="btn btn-sm btn-secondary increase-quantity">+</button>
                </div>
                <button class="btn btn-danger btn-sm mt-2">Remove</button>
            </div>
        `;

        const decreaseButton = cartItem.querySelector('.decrease-quantity');
        const increaseButton = cartItem.querySelector('.increase-quantity');
        const removeButton = cartItem.querySelector('.btn-danger');
        const quantityInput = cartItem.querySelector('.quantity-input');

        decreaseButton.addEventListener('click', () => changeQuantity(item.id, -1));
        increaseButton.addEventListener('click', () => changeQuantity(item.id, 1));
        removeButton.addEventListener('click', () => removeFromCart(item.id));
        quantityInput.addEventListener('change', (e) => updateQuantity(item.id, e.target.value));

        cartItemsContainer.appendChild(cartItem);
    });

    updateTotal();
}

function changeQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCart();
    }
}

function updateQuantity(itemId, newQuantity) {
    const item = cartItems.find(item => item.id === itemId);
    if (item && newQuantity >= 1) {
        item.quantity = parseInt(newQuantity);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCart();
    }
}

function addToCart(button) {
    const card = button.closest('.card');
    const cardId = card.id; 

    if (cartItems.some(item => item.id === cardId)) {
        alert('This item is already in the cart!');
        return;
    }

    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('.card-title').textContent;
    const price = parseFloat(card.querySelector('.card-text').textContent.slice(1)); 
    const newItem = {
        id: cardId,
        title: title,
        price: price,
        imgSrc: imgSrc,
        quantity: 1 
    };
    cartItems.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

function removeFromCart(itemId) {
    const index = cartItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    renderCart();
}

function clearCart() {
    localStorage.removeItem('cartItems');
    cartItems.length = 0;
    renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart(); 
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            addToCart(e.target);
        });
    });
    document.getElementById('clearCartButton').addEventListener('click', clearCart);
});
