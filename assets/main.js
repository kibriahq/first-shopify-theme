document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get updated cart
        const cartResponse = await fetch('/cart.js');

        if (!cartResponse.ok) {
            throw new Error('Failed to fetch cart');
        }
        const cart = await cartResponse.json();

        // Update cart counter
        const cartCount = document.querySelector('#cart-count');
        if (cartCount) {
            cartCount.textContent = cart.item_count;
        }
    } catch (error) {
        console.error(error);
    }
})


document.addEventListener('click', async (event) => {
    const plusButton = event.target.closest('[data-quantity-plus]');
    const minusButton = event.target.closest('[data-quantity-minus]');

    if (!plusButton && !minusButton) return;

    const quantityContainer = event.target.closest('[data-cart-item]');
    const quantityInput = quantityContainer.querySelector('[data-quantity-input]');

    let quantity = parseInt(quantityInput.value, 10) || 1;

    if (plusButton) {
        quantity += 1;
    }

    if (minusButton) {
        quantity = Math.max(1, quantity - 1);
    }

    const line = Number(quantityContainer.dataset.line);
    console.log('Line:', line);
    try {
        const response = await fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                line: line,
                quantity: quantity,
                sections: 'cart-section'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update cart');
        }

        const cart = await response.json();

        // Update the cart with the new cart data
        document.querySelector('#cart-section').innerHTML = cart.sections['cart-section'];

        quantityInput.value = quantity;

    } catch (error) {
        console.error(error);
    }
});