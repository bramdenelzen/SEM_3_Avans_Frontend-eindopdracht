export default class App {
  constructor() {
    console.log("App initialized");

    this._defineComponents(["Button"]);
  }

  /**
   * @param {string[]} componentNames - Array of paths to components
   * @private
   * @description This method is used to define components in the app.
   */
  _defineComponents(componentNames) {
    const basePath = "/app/components/";

    componentNames.forEach(async (componentName) => {
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
    console.log("Components defined");

    document.body.appendChild(document.createElement("x-button"));
  }
}
