import ResultColor from "../../../database/models/ResultColor.js";
import State from "../../../services/State.js";
import WebComponent from "../../Webcomponent.js";
import ColorTesting from "../../pages/colortesting/ColorTesting.js";

export default class EndResults extends WebComponent {


  constructor() {
    super();
    this.#seedList();
    // Is public so that the ColorTesting page can access it
    this.selectedColorState = new State("selectedColor", null);

    ResultColor.subscribeToModel(this.#seedList.bind(this));
  }

  async #seedList() {
    const resultsList = this.shadowRoot.getElementById("results-list");
    resultsList.innerHTML = ""; // Clear existing content

    const results = await ResultColor.find({});

    if (!results || results.length === 0) {
      const noResultsItem = document.createElement("li");
      noResultsItem.textContent = "No results found.";
      resultsList.appendChild(noResultsItem);
      return;
    }

    results.reverse().forEach((result) => {
      const listItem = document.createElement("li");
      listItem.classList.add("result-item");

      const colorText = document.createElement("p");
      colorText.textContent = result.colorHexcode;
      listItem.appendChild(colorText);

      const innerColor = document.createElement("div");
      innerColor.classList.add("inner-color");
      innerColor.style.backgroundColor = result.colorHexcode;
      listItem.appendChild(innerColor);

      resultsList.appendChild(listItem);


      listItem.addEventListener("click", function() {
        this.selectedColorState.setState(result.colorHexcode);
      }.bind(this));
    });
  }
}
