import WebComponent from "../../Webcomponent.js";

export default class MixerSection extends WebComponent {
  constructor() {
    super(MixerSection.html, MixerSection.css);
  }

  connectedCallback() {
    this.form = this.shadowRoot.querySelector("x-mixerform");

    // this.seedList();

    this.form.addEventListener("submitSucces", (event) => {
    //   const ingredient = event.detail.data;

    //   const ingredientListItemElement = document.createElement(
    //     "x-ingredientlistitem"
    //   );
    //   ingredientListItemElement.ingredient = ingredient;

    //   this.ingredientListElement.prepend(ingredientListItemElement);

      this.form.hidePopover();
    });
  }
}
