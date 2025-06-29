import config from "../../../config.js";
import Seed from "../../../database/seeders/Seed.js";
import { Notification } from "../../../services/Notifications.js";
import Page from "../Page.js";

export default class Home extends Page {
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
      try {
        config.Db.models.forEach(async (model) => {
          await model.reset();
        });
      } catch (error) {
        console.error("Error resetting models:", error);
      }

      const seed = new Seed(config.Db.seeders);
      await seed.run();
      new Notification("Database reset and seeded successfully", "success");
    } catch (error) {
      new Notification(`Error resetting database: ${error.message}`, "error");
    }
  }
}
