import WebComponent from "../../Webcomponent.js";

export default class InputField extends WebComponent {
  static extendedFromElement = HTMLInputElement;
  

  constructor(h) {
    super(InputField.html, InputField.css);

    this.attachShadow({ mode: "open" });
  }

  // connectedCallback() {
  //   this.inputElement.addEventListener("input", this._handleChange);

  //   this.value = this._value;

  //   this.inputElement.focus();
  // }

  // disconnectedCallback() {
  //   if (this.inputElement) {
  //     this.inputElement.removeEventListener("input", this._handleChange);
  //   }
  // }

  // _handleChange(event) {
  //   const val = this.inputElement.value;

  //   this._value = val;
  //   this._internals.setFormValue(val);
  //   this._updateInputValue();

  //   const isValid = this.inputElement.checkValidity();
  //   this._internals.setValidity(
  //     isValid ? {} : this.inputElement.validity,
  //     this.inputElement.validationMessage,
  //     this.inputElement
  //   );

  //   this._updateErrorMessage();

  //   this.dispatchEvent(
  //     new CustomEvent("value-changed", {
  //       detail: { value: val },
  //       bubbles: true,
  //       composed: true,
  //     })
  //   );
  // }

  // _updateInputValue() {
  //   if (this.inputElement) {
  //     this.inputElement.value = this._value;
  //   }
  // }

  // _updateErrorMessage() {
  //   const errorBox = this.shadowRoot.querySelector(".error");
  //   if (errorBox) {
  //     errorBox.textContent = this.inputElement.validationMessage;
  //   }
  // }

  // get value() {
  //   return this._value;
  // }

  // set value(val) {
  //   this._value = val ?? "";
  //   this._updateInputValue();
  //   this._internals.setFormValue(this._value);

  //   const isValid = this.inputElement.checkValidity();
  //   this._internals.setValidity(
  //     isValid ? {} : this.inputElement.validity,
  //     this.inputElement.validationMessage,
  //     this.inputElement
  //   );
  //   this._updateErrorMessage();
  // }

  // formResetCallback() {
  //   this.value = "";
  // }

  // checkValidity() {
  //   return this.inputElement.checkValidity();
  // }

  // reportValidity() {
  //   return this.inputElement.reportValidity();
  // }

  // get validity() {
  //   return this.inputElement.validity;
  // }

  // get validationMessage() {
  //   return this.inputElement.validationMessage;
  // }

  // focus() {
  //   this.inputElement.focus();
  // }
}
