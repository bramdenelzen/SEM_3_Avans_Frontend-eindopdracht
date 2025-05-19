import WebComponent from "../../Webcomponent.js";

export default class Button extends WebComponent {
   
  constructor() {
    super(Button.html, Button.css);

    this.shadowRoot
      .querySelector("button")
      .addEventListener("click", this._handleClick.bind(this));
  }

  _handleClick() {
    console.log("Button clicked!");
  }
}
