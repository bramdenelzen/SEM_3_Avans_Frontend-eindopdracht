import State from "../../../services/State.js";
import EndResults from "../../../database/models/ResultColor.js";
import WebComponent from "../../Webcomponent.js";
import ResultColor from "../../../database/models/ResultColor.js";
import Color from "../../../services/Color.js";
import { Notification } from "../../../services/Notifications.js";

export default class ColorTesting extends WebComponent {
  constructor() {
    super(ColorTesting.html, ColorTesting.css);
    this.selectedColor = new State("selectedColor", null);

    const columns = 6;
    const rows = 4;
    this._initializeGrid(columns, rows);

    EndResults.subscribeToModel(this._initializeResults.bind(this));
    this._initializeResults();

    this.selectedColor.subscribe(this._handleCurrentColorChange.bind(this));
  }

  _handleCurrentColorChange(event) {
    const newColor = new Color(event.detail);
    const palette = this.shadowRoot.getElementById("color-palette");

    if (palette) {
      palette.style.backgroundColor = newColor.hexCode ?? "transparent";
    
    }

    const selectedColorElement =
      this.shadowRoot.getElementById("selected-color");

    if (selectedColorElement) {
      selectedColorElement.style.backgroundColor = newColor ?? "transparent";
      selectedColorElement.textContent = newColor.hexCode ?? "Select a color";
    }
  }

  _initializeGrid(columns, rows) {
    const grid = this.shadowRoot.getElementById("grid");

    for (let row = 0; row < rows; row++) {
      const gridRow = document.createElement("div");
      gridRow.classList.add("grid-row");
      for (let column = 0; column < columns; column++) {
        const cell = document.createElement("x-colortestingcell");
        cell.addEventListener("click", function(event){
          const currentColor = this.selectedColor.state;
          if (!currentColor) {
            new Notification(
              "Please select a color from the palette first.","error"
              
            );
            return;
          }
          cell.color = currentColor;
          this.selectedColor.setState(null)
        }.bind(this));
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

    list.innerHTML = ""; // Clear existing content
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
      listItem.classList.add("result-item");

      listItem.addEventListener("click", () => {
        this.selectedColor.setState(result.colorHexcode);
        console.log("Selected Color:", result.colorHexcode);
      });
      list.appendChild(listItem);
    });
  }
}
