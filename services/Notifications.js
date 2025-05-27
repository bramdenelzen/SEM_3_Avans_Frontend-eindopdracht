
export class Notification {
  constructor(message, type = "info", displayTime = 4000) {
    if (!['info','success','warning','error'].includes(type)) {
      throw new Error("Invalid notification type");
    }
    if (typeof displayTime !== 'number' || displayTime <= 0) {
      throw new Error("Display time must be a positive number");
    }

    this.message = message;
    this.type = type;
    this.displayTime = displayTime; 
  }
}

export default class Notifications {
  static notifications = [];
  static callbacks = [];

  /**
   * @param {Notification} notification 
   */
  static notify(notification) {
    if (!(notification instanceof Notification)) {
      throw new Error("Notification must be an instance of Notification class");
    }
    if (this.notifications.length >= 5) {
      this.notifications.shift(); 
    }
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
