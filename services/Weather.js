import State from "./State.js";

export default class Weather {
  static currentWeather = new State("weather", null);
  static location = new State("locaton", null);
  static weatherEffects = new State("weatherEffects", null);

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

    let query = location;

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

    Weather.currentWeather.setState(data.current);
    
    Weather._updateWeatherEffects();
  }

  static _updateWeatherEffects() {
    /**
     * - [ ] Als het regent of sneeuwt, wordt de mengtijd met 10% verhoogd.
- [ ] Bij een temperatuur boven de 35 graden mag er maximaal per hal 1 mengmachine draaien.
- [ ] Als de temperatuur onder de 10 graden ligt, wordt de mengtijd met 15% verhoogd.
     */

    let mixingTimeMultiplier = 1;
    let maxMixingMachines = 5;

    const weather = Weather.currentWeather.state;
    if (!weather) {
      Weather.weatherEffects.setState({
        mixingTimeMultiplier,
        maxMixingMachines,
      });
      return;
    }

    if (
      weather.condition.text.toLowerCase().includes("rain") ||
      weather.condition.text.toLowerCase().includes("snow")
    ) {
      mixingTimeMultiplier *= 1.1;
    }
    if (weather.temp_c > 35) {
      maxMixingMachines = 1;
    } else if (weather.temp_c < 10) {
      mixingTimeMultiplier *= 1.15;
    }

    Weather.weatherEffects.setState({
      mixingTimeMultiplier,
      maxMixingMachines,
    });
  }

  constructor() {
    throw new Error("Weather is a static class and cannot be instantiated.");
  }
}
