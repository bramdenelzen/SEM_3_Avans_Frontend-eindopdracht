import Notifications from "../../../services/Notifications.js"
import WebComponent from "../../Webcomponent.js";

export default class ToastList extends WebComponent {
  constructor() {
    super(ToastList.html, ToastList.css);
    Notifications.onChange(this._manageToasts.bind(this));
  }

  /**
   * @param {[Notification]} notification 
   */
  _manageToasts(notifications) {
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
