# 📱 React Phone App

A fully functional **mobile phone UI** built with React + Vite that simulates real smartphone behavior.

🔗 **Live Demo**: [your-app.netlify.app](https://your-app.netlify.app)

---

## 🚀 Features

### Apps
| App | Features |
|-----|----------|
| 📇 Contacts | Add, delete, search, favourite, groups, photo upload |
| 💬 Messages | Chat, emoji picker, image sharing, read receipts ✓✓ |
| 📞 Dialer | Keypad, recent calls, missed call badge |
| 📷 Camera | Live camera, capture photos, save to gallery |
| 🖼️ Gallery | Albums, camera roll, import photos, full preview |
| 🎵 Music | Upload audio, EQ, shuffle, repeat modes |
| 🧮 Calculator | Basic + Scientific mode (sin, cos, log, √) |
| 📝 Notes | Multiple notes, titles, search, word count |
| 🌤️ Weather | Live API data, 5 cities, hourly forecast |
| ⏰ Alarm | Set alarms, repeat days, snooze, sound selector |
| ⚙️ Settings | Theme, wallpaper, font size, language, WiFi/BT |

### OS Level
- 🔐 PIN Lock Screen (code: 1234)
- 🔔 Notification Center (swipe down)
- 📱 App Switcher (hold home button)
- 🎨 Animated Wallpapers
- 🔋 Battery simulation with charging
- 🌙 Dark / Light mode
- 📳 Vibration feedback
- 🖱️ Drag to reorder apps
- 📲 PWA — installable on mobile

---

## 🛠️ Tech Stack

- **React 18** — Component architecture, Hooks
- **Vite** — Build tool
- **CSS** — Custom mobile UI styling
- **localStorage** — Persistent data
- **Open-Meteo API** — Free live weather data
- **Web APIs** — Camera, Vibration, Service Worker

---

## 💻 Run Locally

```bash
git clone https://github.com/YOURUSERNAME/react-phone-app.git
cd react-phone-app
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 📦 Build & Deploy

```bash
npm run build
# drag dist/ folder to netlify.com/drop
```

---

## 🧠 What I Learned

- State-based custom routing (no React Router)
- Production debugging — first-render undefined state issues
- Defensive rendering and safe localStorage parsing
- PWA setup with service workers and manifest
- Real API integration (Open-Meteo, no API key needed)
- Mobile UI simulation with CSS animations

---

Built by **BANDI** 🚀
