
export class Notification {
  constructor(message, type = "info", displayTime = 4000) {
    this.message = message;
    this.type = type; // 'info', 'success', 'warning', 'error'
    this.displayTime = displayTime; // Time in milliseconds to display the notification
  }
}

export default class Notifications {
  static notifications = [];
  static callbacks = [];

  /**
   * 
   * @param {Notification} notification 
   */
  static notify(notification) {
    this.notifications.push(notification);
    this.callbacks.forEach((callback) => callback(this.notifications));

    setTimeout(() => {
      this.notifications.shift();
      this.callbacks.forEach((callback) => callback(this.notifications));
    }, notification.displayTime);
  }

  static onChange(callback) {
    this.callbacks.push(callback);
  }


}
