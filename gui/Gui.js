import WebComponent from "./Webcomponent.js";

export default class Gui {
  static Instance = null;

  registeredGuiFiles = null;

  loaded = false;

  /**
   * @param {
   * {
   * components: string[],
   * pages: string[],
   * layouts: string[]
   * }
   * } components
   */
  constructor(config) {
    if (Gui.Instance) {
      return Gui.Instance;
    } else {
      Gui.Instance = this;
    }

    this.registeredGuiFiles = config.registeredGuiFiles;

    if (this.registeredGuiFiles === null) {
      throw new Error(
        "Gui.registeredGuiFiles is not set. Please set it before using the Gui class."
      );
    }

    this.getGlobalStylesheet().then(async () => {
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

      this.loaded = true;
      console.log(this.loaded);
    });
  }

  /**
   * @param {string[]} webComponents - Array of paths to components
   * @private
   * @description This method is used to define components in the app.
   */
  async _defineWebComponents(basePath, webComponents) {
    console.log("loaded: ", basePath, this.loaded);
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
    }
  }
}
