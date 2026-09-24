class CollectionFilters extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.filterInputs = this.querySelectorAll('input');

        this.filterInputs.forEach(input => {
            input.addEventListener('change', this.handleClick.bind(this));
        });
    }

    handleClick(event) {
        const input = event.currentTarget;
        const url = new URL(input.checked ? input.dataset.addUrl : input.dataset.removeUrl, window.location.origin);
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