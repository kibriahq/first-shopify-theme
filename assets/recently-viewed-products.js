(() => {
    const STORAGE_KEY = 'shopify_recently_viewed_products';
    const MAX_STORED_PRODUCTS = 12;

    function getRecentlyViewed() {
        try {
            const products = JSON.parse(localStorage.getItem(STORAGE_KEY));

            return Array.isArray(products) ? products : [];
        } catch (error) {
            return [];
        }
    }

    function saveRecentlyViewed(handle) {
        console.log('Saving recently viewed product:', handle);
        if (!handle) return;

        const products = getRecentlyViewed();

        // Remove the product if it already exists.
        const filteredProducts = products.filter(
            (productHandle) => productHandle !== handle
        );

        // Put the current product at the beginning.
        filteredProducts.unshift(handle);

        // Keep only the latest products.
        const limitedProducts = filteredProducts.slice(
            0,
            MAX_STORED_PRODUCTS
        );

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(limitedProducts)
            );
        } catch (error) {
            // Ignore localStorage errors.
        }
    }

    function formatMoney(cents) {
        const amount = cents / 100;

        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: window.Shopify?.currency?.active || 'USD'
        }).format(amount);
    }

    function createProductCard(product, showVendor, showPrice) {
        const card = document.createElement('article');

        card.className = 'recently-viewed__card';

        const link = document.createElement('a');

        link.className = 'recently-viewed__link';
        link.href = product.url;

        // Product image
        if (product.featured_image) {
            const imageWrapper = document.createElement('div');

            imageWrapper.className = 'recently-viewed__image-wrapper';

            const image = document.createElement('img');

            image.className = 'recently-viewed__image';
            image.src = product.featured_image;
            image.alt = product.title;
            image.loading = 'lazy';
            image.width = 600;
            image.height = 600;

            imageWrapper.appendChild(image);
            link.appendChild(imageWrapper);
        }

        // Product information
        const info = document.createElement('div');

        info.className = 'recently-viewed__info';

        if (showVendor && product.vendor) {
            const vendor = document.createElement('p');

            vendor.className = 'recently-viewed__vendor';
            vendor.textContent = product.vendor;

            info.appendChild(vendor);
        }

        const title = document.createElement('h3');

        title.className = 'recently-viewed__title';
        title.textContent = product.title;

        info.appendChild(title);

        if (showPrice) {
            const price = document.createElement('div');

            price.className = 'recently-viewed__price';

            if (product.compare_at_price > product.price) {
                const currentPrice = document.createElement('span');

                currentPrice.className = 'recently-viewed__price-current';
                currentPrice.textContent = formatMoney(product.price);

                const comparePrice = document.createElement('s');

                comparePrice.className = 'recently-viewed__price-compare';
                comparePrice.textContent = formatMoney(
                    product.compare_at_price
                );

                price.appendChild(currentPrice);
                price.appendChild(comparePrice);
            } else {
                price.textContent = formatMoney(product.price);
            }

            info.appendChild(price);
        }

        link.appendChild(info);
        // card.appendChild(link);

        const element = `
            <div class="flex flex-col group">
                <div class="relative w-full aspect-[4/5] bg-surface-container mb-6 overflow-hidden">
                <img
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    data-alt="A set of two minimalist linen napkins in a soft stone grey color, folded neatly and tied with a simple piece of twine. Photographed on a clean white background."
                    height="600"
                    width="480"
                    src="${product.featured_image}"
                >
                <form 
                    method="post"
                    action="/cart/add"
                    class="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                >
                    <input
                        type="hidden" 
                        name="id" 
                        value="${product.variants[0].id}">
                    <input
                        type="hidden"
                        name="quantity"
                        value="1"
                        min="1"
                        aria-label="Quantity">
                    <button
                        type="submit"
                        class="w-full bg-surface-container-lowest/90 backdrop-blur text-primary py-3 font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                    >
                    Quick Add
                    </button>
                </form>
                </div>
                <a class="flex justify-between items-start" href="${product.url}">
                <h3 class="font-body-lg text-body-lg text-primary">${product.title}</h3>
                <span class="font-headline-md text-body-lg text-primary">${formatMoney(product.price)}</span>
                </a>
                <p class="font-body-md text-body-md text-on-surface-variant mt-1">${product.type}</p>
            </div>
        `;

        card.innerHTML = element;

        return card;
    }

    async function fetchProduct(handle) {
        try {
            const response = await fetch(
                `${window.Shopify.routes.root}products/${encodeURIComponent(handle)}.js`
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            return null;
        }
    }

    async function renderRecentlyViewed(section) {
        const container = section.querySelector(
            '[data-recently-viewed-products]'
        );

        if (!container) return;

        const limit = Number(section.dataset.limit) || 4;
        const currentProduct = section.dataset.currentProduct;

        let handles = getRecentlyViewed();

        // Don't show the product currently being viewed.
        if (currentProduct) {
            handles = handles.filter(
                (handle) => handle !== currentProduct
            );
        }

        handles = handles.slice(0, limit);

        // Don't display the section if there are no products.
        if (handles.length === 0) {
            section.hidden = true;
            return;
        }

        const products = await Promise.all(
            handles.map((handle) => fetchProduct(handle))
        );

        const validProducts = products.filter(Boolean);

        if (validProducts.length === 0) {
            section.hidden = true;
            return;
        }

        container.innerHTML = '';

        validProducts.forEach((product) => {
            const card = createProductCard(
                product,
            );

            container.appendChild(card);
        });

        section.hidden = false;
    }

    function initRecentlyViewed() {
        const sections = document.querySelectorAll(
            '[data-recently-viewed]'
        );

        sections.forEach((section) => {
            renderRecentlyViewed(section);
        });
    }


    /*
     * Save the current product.
     *
     * template.name === 'product' is injected by Liquid below.
     */
    function getCurrentProductHandle() {
        const segments = window.location.pathname
            .split('/')
            .filter(Boolean);

        const productIndex = segments.indexOf('products');

        if (productIndex === -1) {
            return null;
        }

        return segments[productIndex + 1] || null;
    }

    const currentProductHandle = getCurrentProductHandle();

    if (currentProductHandle) {
        saveRecentlyViewed(currentProductHandle);
    }

    initRecentlyViewed();
})();