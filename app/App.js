import WebComponent from "./Webcomponent.js";

export default class App {
  /**
   *
   * @param {string[]} components
   */
  constructor(components, pages) {
    this._defineWebComponents("/app/components/",components);
    this._defineWebComponents("/app/pages/",pages);

    document.body.appendChild(document.createElement("x-home"));
  }
  /**
   * @param {string[]} components - Array of paths to components
   * @private
   * @description This method is used to define components in the app.
   */
  async _defineWebComponents(basePath,components) {

     const globalStylesheet = await fetch("global.css").then(async (response)=>{
        if (!response.ok) {
            throw new Error(`Could not load CSS file: ${response.status}`);
        }
        const cssText = await response.text();
    
        const sheet = new CSSStyleSheet();
        sheet.replace(cssText);
    
        return sheet;
    })

    WebComponent.globalStylesheet = globalStylesheet;


    components.forEach(async (componentName) => {
      try {
        const componentPath =
          basePath + componentName.toLocaleLowerCase() + "/" + componentName;

        const css = await fetch(
          `${componentPath.toLocaleLowerCase()}.css`
        ).then(async (response) => {
          if (!response.ok) {
            throw new Error(`Could not load CSS file: ${response.status}`);
          }
          const cssText = await response.text();

          const sheet = new CSSStyleSheet();
          await sheet.replace(cssText);

          return sheet;
        });

        const html = await fetch(
          `${componentPath.toLocaleLowerCase()}.html`
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        });

        const componentClass = await import(`${componentPath}.js`).then(
          (res) => res.default
        );

        componentClass.html = html;
        componentClass.css = css;

        customElements.define(
          "x-" + componentName.toLocaleLowerCase(),
          componentClass
        );
      } catch (error) {
        console.error(error);
      }
    });
  }
}
