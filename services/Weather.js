export default class Weather {
  static async configure(apiKey) {
    Weather.apiKey = apiKey;

    // Wrap geolocation in a Promise
    const location = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error)
      );
    });

    console.log(location);
    Weather.currentWeather = await Weather.fetchCurrentWeather(location);

    console.log(Weather.currentWeather);
  }

  static async fetchCurrentWeather(location) {
    if (!Weather.apiKey) {
      throw new Error(
        "Weather API key is not configured. Please call Weather.configure(apiKey) first."
      );
    }

    console.log(location);

    if (!location || !location.latitude || !location.longitude) {
      throw new Error("Location must be provided with latitude and longitude.");
    }

    console.log(location);

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${Weather.apiKey}&q=${location.latitude},${location.longitude}&aqi=no`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch current weather data");
    }

    const data = await response.json();
    return data.current
  }

  constructor() {
    if (!Weather.apiKey) {
      throw new Error(
        "Weather API key is not configured. Please call Weather.configure(apiKey) first."
      );
    }
  }
}
