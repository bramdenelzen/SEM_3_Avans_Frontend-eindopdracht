import WebComponent from "../Webcomponent.js";
import Router from "../../services/Router.js";


export default class Page extends WebComponent{
  static _cachedInstance = new Map();

  static async getPage() {
    const path = new Router().getCurrentPath();
    if (this._cachedInstance.has(path)) {
      return this._cachedInstance.get(path);
    }

    console.log("new page generated")

    const instance = document.createElement(`x-${this.name.toLowerCase()}`);

    this._cachedInstance.set(path, instance);
    return instance;
  }
}
