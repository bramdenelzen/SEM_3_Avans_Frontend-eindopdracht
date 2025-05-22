export default class Router {
  constructor(routes, targetId = "app") {
    this.routes = routes;
    this.appElement = document.getElementById(targetId);
    window.addEventListener("hashchange", () => this.route());
    window.addEventListener("DOMContentLoaded", () => this.route());
  }

  getCurrentPath() {
    return location.hash.slice(1) || "/";
  }

  matchRoute(path) {
    for (const [pattern, view] of Object.entries(this.routes)) {
      const paramNames = [];
      const regexPattern = pattern.replace(/{([^}]+)}/g, (_, name) => {
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
        return { view, params };
      }
    }
    return null;
  }

  route() {
    const path = this.getCurrentPath();
    const match = this.matchRoute(path);

    if (match) {
      const html =
        typeof match.view === "function"
          ? match.view(match.params)
          : match.view;
      this.appElement.innerHTML = html;
    } else {
      this.appElement.innerHTML = `<x-error status="404" message="Not found"></x-error>`;
    }
  }

  navigate(path) {
    location.hash = path;
  }
}
