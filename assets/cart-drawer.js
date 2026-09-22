document.addEventListener('DOMContentLoaded', function () {
    const cartDrawer = document.querySelector('#cart-drawer');
    const closeButton = document.querySelector('#cart-drawer-close');

    closeButton.addEventListener('click', function () {
        cartDrawer.classList.remove('translate-x-0');
        cartDrawer.classList.add('translate-x-full');
    });

    // Open the cart drawer when the cart icon is clicked
    const cartIcon = document.querySelector('#cart-drawer-toggle');
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            cartDrawer.classList.remove('translate-x-full');
            cartDrawer.classList.add('translate-x-0');
        });
    }
});

class CartActions extends HTMLElement {
    constructor() {
        super();

        this.plusButton = this.querySelector('[data-plus-action]');
        this.minusButton = this.querySelector('[data-minus-action]');
        this.removeButton = this.querySelector('[data-remove-action]');
    }

    connectedCallback() {
        this.plusButton.addEventListener('click', this.handlePlusClick.bind(this));
        this.minusButton.addEventListener('click', this.handleMinusClick.bind(this));
        this.removeButton.addEventListener('click', this.handleRemoveClick.bind(this));
    }

    handlePlusClick(event) {
        this.#updateCart(event);
    }

    handleMinusClick(event) {
        this.#updateCart(event);
    }

    handleRemoveClick(event) {
        this.#updateCart(event);
    }

    async #updateCart(event) {
        const formData = {
            'line': this.dataset.line,
            'quantity': event.target.dataset.quantity,
            'sections': 'cart-drawer'
        }

        try {
            const response = await fetch('/cart/change.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update cart');
            }

            const cart = await response.json();

            // Update the cart drawer with the new cart data
            const cartElement = document.createElement('div');
            cartElement.innerHTML = cart.sections['cart-drawer'];

            document.querySelector('#shopify-section-cart-drawer').querySelector('#cart-drawer-content').innerHTML = cartElement.querySelector('#cart-drawer-content').innerHTML;
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define('cart-actions', CartActions);


class DiscountInput extends HTMLElement {
    constructor() {
        super();

        this.discountForm = this.querySelector('#discount-form');
        this.removeDiscountButtons = this.querySelectorAll('.remove-discount-button');
    }
    
    connectedCallback() {
        this.discountForm.addEventListener('submit', this.handleSubmit.bind(this));

        this.removeDiscountButtons.forEach(button => {
            button.addEventListener('click', this.handleRemoveDiscount.bind(this));
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const formData = {
            discount: this.discountForm.querySelector('input[name="discount"]').value,
            sections: 'cart-drawer'
        }

        this.#updateCart(formData);
    }

    handleRemoveDiscount(event) {
        event.preventDefault();

        const formData = {
            discount: '',
            sections: 'cart-drawer'
        }

        this.#updateCart(formData);
    }

    async #updateCart(formData) {

        try {
            const response = await fetch('/cart/update.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update cart');
            }

            const cart = await response.json();

            // Update the cart drawer with the new cart data
            const cartElement = document.createElement('div');
            cartElement.innerHTML = cart.sections['cart-drawer'];

            document.querySelector('#shopify-section-cart-drawer').querySelector('#cart-drawer-content').innerHTML = cartElement.querySelector('#cart-drawer-content').innerHTML;
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define('discount-input', DiscountInput);