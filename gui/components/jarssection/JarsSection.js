import Jar from "../../../database/models/Jar.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";
import Mixer from "../../../database/models/Mixer.js";

export default class JarsSection extends WebComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    this.jarListElement = this.shadowRoot.getElementById("jar-list");

    this.seedList();
    console.log("seeded again")

    const addButton = this.shadowRoot.getElementById("add-jar");

    addButton.addEventListener("click", async () => {
      const jar = new Jar({
        name: "new Jar",
      });

      await jar.save();

      const jarElement = document.createElement("x-jar");

      jarElement.jar = jar;

      this.jarListElement.prepend(jarElement);
      new Notification("Jar created successfully", "success");
    });
  }

  async seedList() {
    this.jarListElement.innerHTML = "";
    const jars = await Jar.find({});

    for (const jar of jars) {
      
      const isMixing = await Mixer.find({ jarId: jar.id });
      console.log("isMixing", isMixing)
      if (isMixing.length > 0) {
        continue; 
      }

      const jarElement = document.createElement("x-jar");

      jarElement.jar = jar;

      this.jarListElement.prepend(jarElement);
    }
  }
}
