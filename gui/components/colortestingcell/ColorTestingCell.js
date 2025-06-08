import Color from "../../../services/Color.js";
import WebComponent from "../../Webcomponent.js";

export default class ColorTestingCell extends WebComponent{
    constructor() {
        super();
    }


    set color(color){
        this.style.backgroundColor = color;

        const colorFields = this.shadowRoot.querySelectorAll(".color");

        console.log(colorFields)

        colorFields.forEach((field, i) => {
            field.style.backgroundColor = new Color(color).TriadicColors[i] ?? "N/A";
        }); 
    }
}