import State from "../../../services/State.js";
import EndResults from "../../../database/models/ResultColor.js";
import Color from "../../../services/Color.js";
import Page from "../Page.js";

export default class ColorTesting extends Page {
  constructor() {
    super();

    this.selectedColor = new State("selectedColor", null);

    const columns = 6;
    const rows = 4;
    this._initializeGrid(columns, rows);

    EndResults.subscribeToModel(this._initializeResults.bind(this));
    this._initializeResults();

    this.selectedColor.subscribe(this._handleCurrentColorChange.bind(this));
  }

  _handleCurrentColorChange(event) {
    const newColor = event.detail && new Color(event.detail);
    const palette = this.shadowRoot.getElementById("color-palette");

    if (palette) {
      palette.style.backgroundColor = newColor
        ? newColor.hexCode
        : "transparent";

      if (newColor) {
        palette.style.color = newColor.hsl.l > 50 ? "black" : "white";
        palette.innerHTML = `hsl(${newColor.hsl.h}, ${newColor.hsl.s}%, ${newColor.hsl.l}%) <br>
            rgb(${newColor.rgb.r}, ${newColor.rgb.g}, ${newColor.rgb.b}) <br>
            hex: ${newColor.hexCode}`;
      } else {
        palette.innerHTML = "";
      }
    }
  }

  _initializeGrid(columns, rows) {
    const grid = this.shadowRoot.getElementById("grid");

    for (let row = 0; row < rows; row++) {
      const gridRow = document.createElement("div");
      gridRow.classList.add("grid-row");
      for (let column = 0; column < columns; column++) {
        const cell = document.createElement("x-colortestingcell");
        cell.addEventListener(
          "click",
          function (event) {
            const currentColor = this.selectedColor.state;
            if (!currentColor) {
              return;
            }
            cell.color = currentColor;
            this.selectedColor.setState(null);
          }.bind(this)
        );
        cell.setAttribute("row", row);
        cell.setAttribute("column", column);
        gridRow.appendChild(cell);
      }
      grid.appendChild(gridRow);
    }
  }

  async _initializeResults() {
    const endresultsElement = this.shadowRoot.querySelector("x-endresults");
    if (endresultsElement) {
      endresultsElement.selectedColorState.subscribe((event) => {
        const selectedColor = event.detail;
        if (selectedColor) {
          this.selectedColor.setState(selectedColor);
        } else {
          this.selectedColor.setState(null);
        }
      });
    } else {
      console.error("EndResults component not found in the shadow DOM.");
    }
  }
}
