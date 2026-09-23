const quantityInput = document.querySelector('input[name="quantity"]');
const minusButton = document.querySelector('[data-quantity-minus]');
const plusButton = document.querySelector('[data-quantity-plus]');

minusButton.addEventListener('click', function () {
    if (quantityInput.value <= 1) return;
    const quantity = parseInt(quantityInput.value) || 1;

    quantityInput.value = Math.max(1, quantity - 1);
});

plusButton.addEventListener('click', function () {
    const quantity = parseInt(quantityInput.value) || 1;

    quantityInput.value = quantity + 1;
});

class VariantPicker extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.variantSelectors = this.querySelectorAll('input[type="radio"]');

        this.variantSelectors.forEach((selector) => {
            selector.addEventListener('change', this.handleChange.bind(this));
        })
    }

    handleChange(event) {
        const select = event.currentTarget;
        const url = `${window.location.pathname}?variant=${select.value}&section_id=${this.sectionId}`;

        fetch(url)
            .then((response) => response.text())
            .then((html) => {
                const resElement = document.createElement('div');
                resElement.innerHTML = html;
                console.log(html)
                document.querySelector('#product-page').innerHTML = resElement.querySelector('#product-page').innerHTML;
            });
    }

    get sectionId() {
        return this.dataset.sectionId;
    }
}

customElements.define('variant-picker', VariantPicker);