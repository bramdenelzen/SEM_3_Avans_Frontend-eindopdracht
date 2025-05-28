import Jar from "../../../database/models/Jar.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";

export default class JarsSection extends WebComponent {
  constructor() {
    super(JarsSection.html, JarsSection.css);
  }

  connectedCallback() {
    this.jarListElement = this.shadowRoot.getElementById("jar-list");

    this.seedList();

    const addButton = this.shadowRoot.getElementById("add-jar");

    this.seedList();
    addButton.addEventListener("click", async () => {
      const jar = new Jar({
        name: "new Jar",
      });

      await jar.save();

      const jarElement = document.createElement("x-jar");

      jarElement.jar = jar;

      this.jarListElement.prepend(jarElement);
    });
  }

  async seedList() {
    const jars = await Jar.find({});

    for (const jar of jars) {
      const jarElement = document.createElement("x-jar");

      jarElement.jar = jar;

      this.jarListElement.prepend(jarElement);
    }
  }
}
