import Jar from "../../../database/models/Jar.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";
import Mixer from "../../../database/models/Mixer.js";
import JarHasIngredient from "../../../database/models/JarHasIngredient.js";

let counter = 0;

export default class JarsSection extends WebComponent {
  static #currentlySeeding = false;

  constructor() {
    super();
    Jar.subscribeToModel(this.#seedList.bind(this));
    JarHasIngredient.subscribeToModel(
      this.#seedList.bind(this)
    );
    this.#seedList();
  }

  connectedCallback() {
    this.shadowRoot
      .getElementById("add-jar-button")
      .addEventListener("click", this.#addJar);
  }
  disconnectedCallback() {
    this.shadowRoot
      .getElementById("add-jar-button")
      .removeEventListener("click", this.#addJar);
  }

  #addJar = async function () {
    try {
      const jar = new Jar({
        name: "new Jar",
      });
      await jar.save();
      console.log("Jar created", jar);

      new Notification("Jar created successfully", "success");
    } catch (error) {
      new Notification("Could not create jar", "error");
    }
  };

  async #seedList() {
    const jarListElement = this.shadowRoot.getElementById("jar-list");

    // while (JarsSection.#currentlySeeding) {
    //   await new Promise(resolve => setTimeout(resolve, 100));
    // }
    JarsSection.#currentlySeeding = true;
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
    JarsSection.#currentlySeeding = false;
  }
}
