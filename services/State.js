/**\
 *  @abstract
 */
class State {
  _state = null;
  _callbacks = [];

  constructor(defaultValue = null) {
    this._state = defaultValue;
  }

  setState(newState) {
    throw new Error(
      "setState is not implemented in State class. Use a subclass instead."
    );
  }

  get state() {
    return this._state;
  }
}

class Notifications extends State {
  constructor() {
    super([]);
  }

  //   setState(newState) {
  //     this._state = newState;
  //     this._callbacks.forEach((callback) => callback(this._state));
  //   }

  /**
   *
   * @param {HTMLElement} notification
   */
  push(notification) {
    this._state.push(notification);
    this._callbacks.forEach((callback) => callback(this._state));
    // remove the notification after 5 seconds
    setTimeout(() => {
      this._state.shift();
      this._callbacks.forEach((callback) => callback(this._state));
    }, 4000);
  }

  onChange(callback) {
    this._callbacks.push(callback);
  }
}
const notifications = new Notifications();
export { notifications };
