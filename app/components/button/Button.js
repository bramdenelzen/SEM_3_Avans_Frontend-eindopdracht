import WebComponent from '../../Webcomponent.js';

export default class Button extends WebComponent{
    static css;
    static html;

    constructor(label) {
    super(Button.html, Button.css);
    this.label = label;
  }

  render() {
    return `<button>${this.label}</button>`;
  }
}