import WebComponent from "./Webcomponent.js";

export default class Gui {
  static Instance = null;

  static registeredGuiFiles = null;

  static #loaded = false;

  constructor() {
    throw new Error(
      "Gui is a static class and cannot be instantiated. Use Gui.configure(config) instead."
    );
  }

  static async configure(config) {
    this.registeredGuiFiles = config.registeredGuiFiles;

    if (this.registeredGuiFiles === null) {
      throw new Error(
        "Gui.registeredGuiFiles is not set. Please set it before using the Gui class."
      );
    }

    await this.getGlobalStylesheet();

    await this._defineWebComponents(
      "/gui/components/",
      this.registeredGuiFiles.components
    );
    await this._defineWebComponents(
      "/gui/pages/",
      this.registeredGuiFiles.pages
    );
    await this._defineWebComponents(
      "/gui/layouts/",
      this.registeredGuiFiles.layouts
    );

    return true;
  }
  /**
   * @param {string[]} webComponents - Array of paths to components
   * @private
   * @description This method is used to define components in the app.
   */
  static async _defineWebComponents(basePath, webComponents) {
    if (Array.isArray(webComponents)) {
      for (const componentName of webComponents) {
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
      }
    }
  }

  static async getGlobalStylesheet() {
    if (!WebComponent.globalStylesheet) {
      const globalStylesheet = await fetch("global.css").then(
        async (response) => {
          if (!response.ok) {
            throw new Error(`Could not load CSS file: ${response.status}`);
          }
          const cssText = await response.text();
          const sheet = new CSSStyleSheet();

          sheet.replace(cssText);

          return sheet;
        }
      );

      WebComponent.globalStylesheet = globalStylesheet;
      return globalStylesheet;
    }
  }
}
