import { useState, useEffect } from "react";

// 🔑 Free API from Open-Meteo — no API key needed!
// Uses Open-Meteo (open-meteo.com) for weather + WMO weather codes

const CITIES = [
  { city: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { city: "Mumbai",    lat: 19.0760, lon: 72.8777 },
  { city: "Delhi",     lat: 28.6139, lon: 77.2090 },
  { city: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { city: "Chennai",   lat: 13.0827, lon: 80.2707 },
];

function wmoIcon(code) {
  if (code === 0)           return "☀️";
  if (code <= 2)            return "⛅";
  if (code <= 3)            return "☁️";
  if (code <= 48)           return "🌫️";
  if (code <= 57)           return "🌦️";
  if (code <= 65)           return "🌧️";
  if (code <= 77)           return "❄️";
  if (code <= 82)           return "🌧️";
  if (code <= 86)           return "🌨️";
  if (code <= 99)           return "⛈️";
  return "🌡️";
}

function wmoLabel(code) {
  if (code === 0)  return "Clear Sky";
  if (code <= 2)   return "Partly Cloudy";
  if (code <= 3)   return "Overcast";
  if (code <= 48)  return "Foggy";
  if (code <= 57)  return "Drizzle";
  if (code <= 65)  return "Rainy";
  if (code <= 77)  return "Snowy";
  if (code <= 82)  return "Showers";
  if (code <= 86)  return "Snow Showers";
  if (code <= 99)  return "Thunderstorm";
  return "Unknown";
}

function WeatherScreen() {
  const [cityIdx, setCityIdx] = useState(0);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetchWeather(CITIES[cityIdx]);
  }, [cityIdx]);

  async function fetchWeather(c) {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${c.lat}&longitude=${c.lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode` +
        `&hourly=temperature_2m,weathercode` +
        `&timezone=auto&forecast_days=1`;
      const res  = await fetch(url);
      const data = await res.json();
      const cur  = data.current;
      // pick next 5 hours
      const now   = new Date();
      const hIdx  = data.hourly.time.findIndex(t => new Date(t) >= now);
      const hours = Array.from({ length: 5 }, (_, i) => ({
        time:  data.hourly.time[hIdx + i]
                 ? new Date(data.hourly.time[hIdx + i]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                 : "--",
        temp:  data.hourly.temperature_2m[hIdx + i] ?? "--",
        code:  data.hourly.weathercode[hIdx + i]    ?? 0,
      }));

      setWeather({
        temp:     Math.round(cur.temperature_2m),
        feels:    Math.round(cur.apparent_temperature),
        humidity: cur.relative_humidity_2m,
        wind:     Math.round(cur.wind_speed_10m),
        code:     cur.weathercode,
        hours,
      });
    } catch (e) {
      setError("Failed to load. Check connection.");
    } finally {
      setLoading(false);
    }
  }

  const city = CITIES[cityIdx];

  return (
    <div className="weather-screen">
      {/* city tabs */}
      <div className="weather-cities">
        {CITIES.map((c, i) => (
          <button
            key={c.city}
            className={`city-btn ${i === cityIdx ? "active" : ""}`}
            onClick={() => setCityIdx(i)}
          >{c.city}</button>
        ))}
      </div>

      {loading && (
        <div className="weather-loading">
          <div className="weather-spinner">⟳</div>
          <div style={{ fontSize: 7, opacity: 0.6, marginTop: 4 }}>Loading live data…</div>
        </div>
      )}

      {error && (
        <div className="weather-error">
          <div style={{ fontSize: 18 }}>⚠️</div>
          <div style={{ fontSize: 7, marginTop: 4 }}>{error}</div>
          <button className="city-btn active" style={{ marginTop: 8 }} onClick={() => fetchWeather(city)}>
            Retry
          </button>
        </div>
      )}

      {weather && !loading && (
        <>
          <div className="weather-card">
            <div className="weather-icon">{wmoIcon(weather.code)}</div>
            <div className="weather-temp">{weather.temp}°C</div>
            <div className="weather-condition">{wmoLabel(weather.code)}</div>
            <div className="weather-city">{city.city} · Live</div>
          </div>

          <div className="weather-details">
            <div className="w-detail">
              <span className="w-label">Feels</span>
              <span className="w-value">{weather.feels}°</span>
            </div>
            <div className="w-detail">
              <span className="w-label">Humidity</span>
              <span className="w-value">{weather.humidity}%</span>
            </div>
            <div className="w-detail">
              <span className="w-label">Wind</span>
              <span className="w-value">{weather.wind} km/h</span>
            </div>
          </div>

          <div className="hourly-row">
            {weather.hours.map((h, i) => (
              <div key={i} className="hourly-item">
                <div className="h-time">{h.time}</div>
                <div className="h-icon">{wmoIcon(h.code)}</div>
                <div className="h-temp">{Math.round(h.temp)}°</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 5, opacity: 0.3, textAlign: "center", marginTop: 4 }}>
            Data: Open-Meteo.com
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherScreen;