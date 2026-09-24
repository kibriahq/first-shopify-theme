class CollectionFilters extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.filterInputs = this.querySelectorAll('input');

        this.minRange = this.querySelector('input[type="range"][data-min-value]');
        this.maxRange = this.querySelector('input[type="range"][data-max-value]');

        this.filterInputs.forEach(input => {
            input.addEventListener('change', this.handleClick.bind(this));
        });
    }

    handleClick(event) {
        const input = event.currentTarget;
        let url;

        if(input.dataset.addUrl && input.dataset.removeUrl) {
            url = new URL(input.checked ? input.dataset.addUrl : input.dataset.removeUrl, window.location.origin);
        } else {
            url = new URL(window.location.href);

            url.searchParams.delete(this.minRange.dataset.param);
            url.searchParams.delete(this.maxRange.dataset.param);

            url.searchParams.set(this.minRange.dataset.param, this.minRange.value);
            url.searchParams.set(this.maxRange.dataset.param, this.maxRange.value);
        }

        url.searchParams.set('section_id', this.sectionId);

        fetch(url.toString())
            .then(response => response.text())
            .then(html => {
                const docElement = document.createElement('div');
                docElement.innerHTML = html;

                this.querySelector('#collection-products').innerHTML = docElement.querySelector('#collection-products').innerHTML;
            });

        url.searchParams.delete('section_id');
        window.history.pushState({}, '', url.toString());
    }

    get sectionId() {
        return this.dataset.sectionId;
    }
}

customElements.define('collection-filters', CollectionFilters);