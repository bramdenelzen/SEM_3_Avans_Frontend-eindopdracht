import Page from "../gui/pages/Page.js";

export default class Router {
  static router = null;

  constructor(config, targetId = "app") {
    if (Router.router) {
      return Router.router;
    } else {
      Router.router = this;
    }

    this.routes = config.routes;
    this.appElement = document.getElementById(targetId);
    window.addEventListener("hashchange", () => this.route());
    window.addEventListener("DOMContentLoaded", () => this.route());

    this.route();
  }

  getCurrentPath() {
    return location.hash.slice(1) || "/";
  }

  _matchRoute(path) {
    for (const [routePath, routeContent] of Object.entries(this.routes)) {
      const paramNames = [];
      const regexPattern = routePath.replace(/{([^}]+)}/g, (_, name) => {
        paramNames.push(name);
        return "([^/]+)";
      });

      const regex = new RegExp(`^${regexPattern}$`);
      const match = path.match(regex);

      if (match) {
        const params = paramNames.reduce((acc, name, index) => {
          acc[name] = match[index + 1];
          return acc;
        }, {});
        return { routeContent, params };
      }
    }
    return null;
  }

  async route() {
    const path = this.getCurrentPath();
    const match = this._matchRoute(path);


    if (match) {
      this.currentParams = match.params; // <-- Update current params
      const routeContent = match.routeContent;

      if (typeof routeContent === "function") {
        this.appElement.innerHTML = ""; // Clear previous content
        this.appElement.appendChild(await routeContent.getPage());
      }else if (typeof routeContent === "string") {
        this.appElement.innerHTML = routeContent;
      } else if (routeContent instanceof Page) {
        this.appElement.innerHTML = ""; // Clear previous content
        this.appElement.appendChild(routeContent);
      } else {
        console.error("Invalid route content:", routeContent);
      }
    } else {
      this.appElement.innerHTML = "<x-error status='404' message='Not found'></x-error>";
    }
  }

  navigate(path) {
    location.hash = path;
  }

  getParams() {
    return this.currentParams;
  }
}
