import Jar from "../../../database/models/Jar.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";
import Mixer from "../../../database/models/Mixer.js";

export default class JarsSection extends WebComponent {
  constructor() {
    super();
    this._seedList();

    const addButton = this.shadowRoot.getElementById("add-jar");
    addButton.addEventListener("click", async () => {
      const jar = new Jar({
        name: "new Jar",
      });
      await jar.save();

      const jarElement = document.createElement("x-jar");
      jarElement.jar = jar;

      this.shadowRoot.getElementById("jar-list").prepend(jarElement);
      new Notification("Jar created successfully", "success");
    });
  }

  async _seedList() {
    const jarListElement = this.shadowRoot.getElementById("jar-list");
    jarListElement.innerHTML = "";
    const jars = await Jar.find({});

    for (const jar of jars) {
      const isMixing = await Mixer.find({ jarId: jar.id });

      if (isMixing.length > 0) {
        continue;
      }

      const jarElement = document.createElement("x-jar");
      jarElement.jar = jar;

      jarListElement.prepend(jarElement);
    }
  }
}
