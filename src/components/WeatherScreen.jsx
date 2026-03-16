import { useState } from "react";

const CITIES = [
  { city: "Hyderabad", temp: 34, feels: 37, condition: "Sunny", humidity: 42, wind: 14, icon: "☀️" },
  { city: "Mumbai",    temp: 29, feels: 33, condition: "Cloudy", humidity: 78, wind: 20, icon: "⛅" },
  { city: "Delhi",     temp: 38, feels: 42, condition: "Hazy",   humidity: 35, wind: 8,  icon: "🌫️" },
  { city: "Bangalore", temp: 26, feels: 27, condition: "Breezy", humidity: 60, wind: 18, icon: "🌤️" },
];

function WeatherScreen() {
  const [idx, setIdx] = useState(0);
  const w = CITIES[idx];

  return (
    <div className="weather-screen">
      {/* City selector */}
      <div className="weather-cities">
        {CITIES.map((c, i) => (
          <button
            key={c.city}
            className={`city-btn ${i === idx ? "active" : ""}`}
            onClick={() => setIdx(i)}
          >
            {c.city}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div className="weather-card">
        <div className="weather-icon">{w.icon}</div>
        <div className="weather-temp">{w.temp}°C</div>
        <div className="weather-condition">{w.condition}</div>
        <div className="weather-city">{w.city}</div>
      </div>

      {/* Detail row */}
      <div className="weather-details">
        <div className="w-detail">
          <span className="w-label">Feels</span>
          <span className="w-value">{w.feels}°</span>
        </div>
        <div className="w-detail">
          <span className="w-label">Humidity</span>
          <span className="w-value">{w.humidity}%</span>
        </div>
        <div className="w-detail">
          <span className="w-label">Wind</span>
          <span className="w-value">{w.wind} km/h</span>
        </div>
      </div>

      {/* Hourly forecast */}
      <div className="hourly-row">
        {["Now","1pm","2pm","3pm","4pm"].map((t, i) => (
          <div key={t} className="hourly-item">
            <div className="h-time">{t}</div>
            <div className="h-icon">{i % 2 === 0 ? w.icon : "🌤️"}</div>
            <div className="h-temp">{w.temp - i}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherScreen;
