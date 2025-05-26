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

  matchRoute(path) {
    for (const [routePath, routeContent] of Object.entries(
      this.routes
    )) {
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

  route() {
    const path = this.getCurrentPath();
    const match = this.matchRoute(path);

    if (match) {
      this.currentParams = match.params; // <-- Update current params

      const html = match.routeContent;
      this.appElement.innerHTML = html;
    } else {
      this.appElement.innerHTML = `<x-error status="404" message="Not found"></x-error>`;
    }
  }

  navigate(path) {
    location.hash = path;
  }

  getParams() {
    return this.currentParams;
  }
}
