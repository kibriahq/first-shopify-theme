document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;

        try {
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            const item = await response.json();

            console.log('Added:', item);

            button.textContent = 'Added ✓';

            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.disabled = false;
            }, 1000);

        } catch (error) {
            console.error(error);
            button.disabled = false;
        }
    });
});