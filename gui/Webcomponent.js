export default class WebComponent extends HTMLElement {
  // Gets filled in the defineComponents method in App.js
  static globalStylesheet = null;
  /**
   * @param {string} html
   * @param {CSSStyleSheet} css
   */
  constructor() {
    super();
    const html = this.constructor.html
    const css = this.constructor.css;

    if (!html || !css) {
      throw new Error(
        `WebComponent ${this.constructor.name} is missing html and/or css. Please define them as static properties.`
      );
    }

    this.attachShadow({ mode: "open" });

    if (html) {
      this.shadowRoot.innerHTML = html;
    }

    this.shadowRoot.adoptedStyleSheets = [css, WebComponent.globalStylesheet];
  }
}
