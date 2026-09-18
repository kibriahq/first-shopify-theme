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