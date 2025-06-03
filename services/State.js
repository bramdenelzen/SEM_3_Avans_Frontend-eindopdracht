export default class State {
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
    const event = new CustomEvent(this._stateName + "Change", {
      detail: this._state,
    });
    console.log("State changed:", this._stateName, this._state);
    document.dispatchEvent(event);
  }
}