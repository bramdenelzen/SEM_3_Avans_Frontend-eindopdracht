import State from "./State.js";

export default class Weather {
  static currentWeather = new State("weather", null);
  static location = new State("locaton", null);

  static async configure(apiKey) {
    Weather.apiKey = apiKey;

    // Wrap geolocation in a Promise
    const location = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Geolocation position:", position);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error)
      );
    });

    await Weather.updateCurrentWeather(location);
    return true; 
  }

  static async updateCurrentWeather(location) {
    if (!Weather.apiKey) {
      throw new Error(
        "Weather API key is not configured. Please call Weather.configure(apiKey) first."
      );
    }

    let query = location

    if (!location) {
      throw new Error("Location must be provided.");
    }

    if (location.latitude && location.longitude) {
      query = `${location.latitude},${location.longitude}`;
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${Weather.apiKey}&q=${query}&aqi=no`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch current weather data");
    }

    const data = await response.json();

    Weather.location.setState({
      city: data.location.name,
      country: data.location.country,
      latitude: data.location.lat,
      longitude: data.location.lon,
    });

    Weather.currentWeather.setState(data.current)
    console.log("Current weather updated:", data);
  }

  constructor() {
    if (!Weather.apiKey) {
      throw new Error(
        "Weather API key is not configured. Please call Weather.configure(apiKey) first."
      );
    }
  }
}
