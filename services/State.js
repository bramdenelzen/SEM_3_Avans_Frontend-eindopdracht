export default class State {

  #subscribers = []

  constructor(stateName,initialState = null) {
    this._state = initialState;
    this._stateName = stateName;
  }

  get state() {
    return this._state;
  }

  setState(stateOrArrowFunction){
    if (typeof stateOrArrowFunction === "function") {
      this._state = stateOrArrowFunction(this._state);
    } else {
      this._state = stateOrArrowFunction;
    }
    this._notify()
  }
  set(key, value) {
    this.state[key] = value;
    this._notify(key, value);
  }

  _notify() {
   this.#subscribers.forEach((callback) => {
      const event = new CustomEvent(this._stateName + "Change", {
        detail: this._state,
      });

      document.dispatchEvent(event);
      
      callback(event);
    });
  }

  subscribe(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }
    this.#subscribers.push(callback);
  }
}