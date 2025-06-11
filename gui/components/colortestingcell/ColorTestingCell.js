import Color from "../../../services/Color.js";
import WebComponent from "../../Webcomponent.js";

export default class ColorTestingCell extends WebComponent{
    constructor() {
        super();
    }


    set color(color){
        const betterColor = new Color(color);
        this.style.backgroundColor = betterColor.hexCode;

        const colorFields = this.shadowRoot.querySelectorAll(".color");

        this.shadowRoot.querySelector(".cell").classList.remove("empty");

        colorFields.forEach((field, i) => {
            field.style.backgroundColor = betterColor.TriadicColors[i] ?? "N/A";
            field.innerHTML =`hsl(${betterColor.hsl.h},${betterColor.hsl.s},${betterColor.hsl.l}) <br>
            rgb(${betterColor.rgb.r},${betterColor.rgb.g},${betterColor.rgb.b}) <br>
            hex: ${betterColor.hexCode}`;
            field.style.color = betterColor.hsl.l > 50 ? "black" : "white";
        }); 
    }
}