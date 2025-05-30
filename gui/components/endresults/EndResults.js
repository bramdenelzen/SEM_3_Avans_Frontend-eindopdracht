import ResultColor from "../../../database/models/ResultColor.js";
import WebComponent from "../../Webcomponent.js";

export default class EndResults extends WebComponent {
  constructor() {
    super(EndResults.html, EndResults.css);
    this.updateList();

    window.addEventListener("mixing-success", this.updateList.bind(this));
  }
  async updateList() {
    const resultsList = this.shadowRoot.getElementById("results-list");
    resultsList.innerHTML = ""; // Clear existing content

    const results = await ResultColor.find({});
    if (!results || results.length === 0) {
      const noResultsItem = document.createElement("li");
      noResultsItem.textContent = "No results found.";
      resultsList.appendChild(noResultsItem);
      return;
    }
    console.log("results", results);
    results.forEach((result) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Color: ${result.colorHexcode}`;
      listItem.style.backgroundColor = result.colorHexcode;
      resultsList.appendChild(listItem);
    });
  }
}
