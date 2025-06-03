import State from "../../../services/State.js";
import EndResults from "../../../database/models/ResultColor.js";
import WebComponent from "../../Webcomponent.js";
import ResultColor from "../../../database/models/ResultColor.js";

export default class ColorTesting extends WebComponent {
  constructor() {
    super(ColorTesting.html, ColorTesting.css);
    this.currentPallet = new State("currentPallete", null);
    this.selectedColor = new State("selectedColor", null);
  }

  async connectedCallback() {
    const columns = 6;
    const rows = 4;
    this._initializeGrid(columns, rows);
    this._initializeResults();
  }
  _initializeGrid(columns, rows) {
    const grid = this.shadowRoot.getElementById("grid");

    grid.addEventListener("click", (event) => {
      this.currentPallet.setState("yay");
    });

    document.addEventListener("currentPalleteChange", (event) => {
      console.log("Current Pallete Changed:", event.detail);
    });

    for (let row = 0; row < rows; row++) {
      const gridRow = document.createElement("div");
      gridRow.classList.add("grid-row");
      for (let column = 0; column < columns; column++) {
        const cell = document.createElement("x-colortestingcell");
        cell.setAttribute("row", row);
        cell.setAttribute("column", column);
        gridRow.appendChild(cell);
      }
      grid.appendChild(gridRow);
    }
  }

  async _initializeResults() {
    const list = this.shadowRoot.getElementById("results-list");
    const results = await ResultColor.find({});

    console.log("Results:", results);
    console.log("list:", list);
    if (!results || results.length === 0) {
      const noResultsItem = document.createElement("li");
      noResultsItem.textContent = "No results found.";
      list.appendChild(noResultsItem);
      return;
    }

    results.forEach((result) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Color: ${result.colorHexcode}`;
      listItem.style.backgroundColor = result.colorHexcode;
      listItem.addEventListener("click", () => {
        this.selectedColor.setState(result.colorHexcode);
        this.currentPallet.setState(result.colorHexcode);
        console.log("Selected Color:", result.colorHexcode);
      });
      list.appendChild(listItem);
    });
  }
}
