export default class WebComponent extends HTMLElement {
    constructor(html,css) {
        super();
        this.attachShadow({ mode: 'open' });
        console.log(html,css)
        this.shadowRoot.innerHTML = html
        console.log(css)
        this.shadowRoot.adoptedStyleSheets = [css];

    }
}