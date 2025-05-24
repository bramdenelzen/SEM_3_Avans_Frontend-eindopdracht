export default class WebComponent extends HTMLElement {
  // Gets filled in the defineComponents method in App.js
  static globalStylesheet = null;
  /**
   * @param {string} html
   * @param {CSSStyleSheet} css
   */
  constructor(html, css) {
    super();

    this.attachShadow({ mode: "open" });

    if (html) {
      this.shadowRoot.innerHTML = html;
    }

    this.shadowRoot.adoptedStyleSheets = [css, WebComponent.globalStylesheet];
  }
}
