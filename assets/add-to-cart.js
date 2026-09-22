document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;

        try {
            const formData = new FormData(form);
            formData.append('sections', 'cart-drawer');

            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

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

            const item = await response.json();

            const cartElement = document.createElement('div');
            cartElement.innerHTML = item.sections['cart-drawer'];

            document.querySelector('#shopify-section-cart-drawer').querySelector('#cart-drawer-content').innerHTML = cartElement.querySelector('#cart-drawer-content').innerHTML;

            const btnContent = button.innerHTML;

            button.textContent = 'Added ✓';

            setTimeout(() => {
                button.innerHTML = btnContent;
                button.disabled = false;
            }, 1000);

        } catch (error) {
            console.error(error);
            button.disabled = false;
        }
    });
});