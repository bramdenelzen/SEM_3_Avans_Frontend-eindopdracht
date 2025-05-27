import { notifications } from "../../../services/State.js";
import WebComponent from "../../Webcomponent.js";

export default class ToastList extends WebComponent {
  constructor() {
    super(ToastList.html, ToastList.css);

    notifications.onChange(this._manageToasts.bind(this));
  }

  _manageToasts(toasts) {
    const list = this.shadowRoot.querySelector("ul");
    list.innerHTML = "";
    for (const toast of toasts) {
      list.appendChild(toast);
    }
  }
}
