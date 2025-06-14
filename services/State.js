export default class State {
  #subscribers = [];

  #state;
  #stateName;

  constructor(stateName, initialState = null) {
    this.#state = initialState;
    this.#stateName = stateName;
  }

  get state() {
    return this.#state;
  }

  setState(stateOrArrowFunction) {
    if (typeof stateOrArrowFunction === "function") {
      this.#state = stateOrArrowFunction(this.#state);
    } else {
      this.#state = stateOrArrowFunction;
    }
    this.#notify();
  }
  set(key, value) {
    this.state[key] = value;
    this.#notify(key, value);
  }

  #notify() {
    this.#subscribers.forEach((callback) => {
      const event = new CustomEvent(this.#stateName + "Change", {
        detail: this.#state,
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
