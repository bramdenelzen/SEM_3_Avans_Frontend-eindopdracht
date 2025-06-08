export default class Weather {
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

    Weather.currentWeather = await Weather.fetchCurrentWeather(location);
  }

  static async fetchCurrentWeather(location) {
    if (!Weather.apiKey) {
      throw new Error(
        "Weather API key is not configured. Please call Weather.configure(apiKey) first."
      );
    }

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

    Weather.location = {
      city: data.location.name,
      country: data.location.country,
      latitude: data.location.lat,
      longitude: data.location.lon,
    };
    
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
