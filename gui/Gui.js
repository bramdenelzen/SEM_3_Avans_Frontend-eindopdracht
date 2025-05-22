import WebComponent from "./Webcomponent.js";

export default class Gui {
  static Instance = null;

  registeredGuiFiles = null;

  /**
   * @param {
   * {
   * components: string[],
   * pages: string[],
   * layouts: string[]
   * }
   * } components
   */
  constructor(components) {
    if (Gui.Instance) {
      return Gui.Instance;
    } else {
      Gui.Instance = this;
    }

    this.registeredGuiFiles = components;

    if (this.registeredGuiFiles === null) {
      throw new Error(
        "Gui.registeredGuiFiles is not set. Please set it before using the Gui class."
      );
    }

    this.getGlobalStylesheet();
    this._defineWebComponents(
      "/gui/components/",
      this.registeredGuiFiles.components
    );
    this._defineWebComponents("/gui/pages/", this.registeredGuiFiles.pages);
    this._defineWebComponents("/gui/layouts/", this.registeredGuiFiles.layouts);
  }

  /**
   * @param {string[]} webComponents - Array of paths to components
   * @private
   * @description This method is used to define components in the app.
   */
   async _defineWebComponents(basePath, webComponents) {
    if (Array.isArray(webComponents)) {
      webComponents.forEach(async (componentName) => {
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

   async getGlobalStylesheet() {
    const globalStylesheet = await fetch("global.css").then(
      async (response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error(`Could not load CSS file: ${response.status}`);
        }
        const cssText = await response.text();

        const sheet = new CSSStyleSheet();
        sheet.replace(cssText);

        return sheet;
      }
    );

    WebComponent.globalStylesheet = globalStylesheet;
  }
}
