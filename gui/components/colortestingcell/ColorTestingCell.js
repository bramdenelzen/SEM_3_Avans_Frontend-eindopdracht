import Color from "../../../services/Color.js";
import WebComponent from "../../Webcomponent.js";

export default class ColorTestingCell extends WebComponent {
  constructor() {
    super();
  }

  set color(color) {
    const colorInstance = new Color(color);
    this.style.backgroundColor = colorInstance.hexCode;

    const colorFields = this.shadowRoot.querySelectorAll(".color");

    this.shadowRoot.querySelector(".cell").classList.remove("empty");

    colorFields.forEach((field, i) => {
      const triadicColor = colorInstance.triadicColors[i];
      field.style.backgroundColor = triadicColor.hexCode ?? "N/A";
      field.innerHTML = `hsl(${triadicColor.hsl.h},${triadicColor.hsl.s},${triadicColor.hsl.l}) <br>
            rgb(${triadicColor.rgb.r},${triadicColor.rgb.g},${triadicColor.rgb.b}) <br>
            hex: ${triadicColor.hexCode}`;
      field.style.color = triadicColor.hsl.l >= 50 ? "black" : "white";
    });
  }
}
