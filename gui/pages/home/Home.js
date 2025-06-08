import Router from "../../../services/Router.js";
import WebComponent from "../../Webcomponent.js";
import config from "../../../config.js";
import Seed from "../../../database/seeders/Seed.js";
import { Notification } from "../../../services/Notifications.js";
export default class Home extends WebComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadowRoot
      .getElementById("reset-button")
      .addEventListener("click", this.resetApp);
  }

  disconnectedCallback() {
    this.shadowRoot
      .getElementById("reset-button")
      .removeEventListener("click", this.resetApp);
  }

  async resetApp() {
    try {
      const db = config.Db.handler;

      config.Db.models.forEach(async (model) => {
        await db.reset(model.modelName);
      });

      const seed = new Seed(config.Db.seeders);
      await seed.run();
      new Notification("Database reset and seeded successfully", "success");
    } catch (error) {
      new Notification(`Error resetting database: ${error.message}`, "error");
    }
  }
}
