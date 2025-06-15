import Notifications from "../../../services/Notifications.js"
import WebComponent from "../../Webcomponent.js";

export default class ToastList extends WebComponent {
  constructor() {
    super();
    Notifications.onChange(this.#manageToasts.bind(this));
  }

  /**
   * @param {[Notification]} notification 
   */
  #manageToasts(notifications) {
    const list = this.shadowRoot.querySelector("ul");
    list.innerHTML = "";
    for (const notification of notifications) {
      const toastElement = document.createElement("x-toast");
      toastElement.message = notification.message;
      toastElement.type = notification.type 
      list.appendChild(toastElement);
    }
  }
}
