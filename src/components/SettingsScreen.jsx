const WALLPAPERS = [
  { id:"default", label:"Default", bg:"#111" },
  { id:"sunset",  label:"Sunset",  bg:"linear-gradient(135deg,#f093fb,#f5576c)" },
  { id:"ocean",   label:"Ocean",   bg:"linear-gradient(135deg,#4facfe,#00f2fe)" },
  { id:"forest",  label:"Forest",  bg:"linear-gradient(135deg,#43e97b,#38f9d7)" },
  { id:"night",   label:"Night",   bg:"linear-gradient(135deg,#0f0c29,#302b63)" },
];

const LANGUAGES = ["English","Hindi","Telugu","Tamil","Kannada","Marathi"];
const FONT_SIZES = ["Small","Medium","Large"];

function SettingsScreen({ settings, setSettings }) {
  function toggle(key) {
    navigator.vibrate?.(15);
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function set(key, val) { setSettings(prev => ({ ...prev, [key]: val })); }

  const fontSize = settings.fontSize || "Medium";
  const language = settings.language || "English";

  const fontPx = { Small:9, Medium:11, Large:13 }[fontSize];

  return (
    <div className="settings-screen" style={{ fontSize: fontPx }}>
      <h3>Settings</h3>

      {/* System */}
      <div className="settings-section-label">System</div>
      <div className="setting-item">
        <span>🔒 Lock Screen</span>
        <input type="checkbox" checked={!!settings.lockEnabled} onChange={() => toggle("lockEnabled")} />
      </div>
      <div className="setting-item">
        <span>🔔 Notifications</span>
        <input type="checkbox" checked={!!settings.notifications} onChange={() => toggle("notifications")} />
      </div>
      <div className="setting-item">
        <span>🔊 Sound</span>
        <input type="checkbox" checked={!!settings.sound} onChange={() => toggle("sound")} />
      </div>
      <div className="setting-item">
        <span>📳 Vibration</span>
        <input type="checkbox" checked={!!settings.vibration} onChange={() => toggle("vibration")} />
      </div>

      {/* Connectivity */}
      <div className="settings-section-label">Connectivity</div>
      <div className="setting-item">
        <span>📶 WiFi</span>
        <input type="checkbox" checked={!!settings.wifi} onChange={() => toggle("wifi")} />
      </div>
      <div className="setting-item">
        <span>🔵 Bluetooth</span>
        <input type="checkbox" checked={!!settings.bluetooth} onChange={() => toggle("bluetooth")} />
      </div>
      <div className="setting-item">
        <span>✈️ Airplane Mode</span>
        <input type="checkbox" checked={!!settings.airplane} onChange={() => toggle("airplane")} />
      </div>

      {/* Display */}
      <div className="settings-section-label">Display</div>
      <div className="setting-item">
        <span>🌙 Dark Mode</span>
        <input type="checkbox" checked={!!settings.darkMode} onChange={() => toggle("darkMode")} />
      </div>
      <div className="setting-item" style={{ flexDirection:"column", alignItems:"flex-start", gap:4 }}>
        <span>🔤 Font Size</span>
        <div style={{ display:"flex", gap:4 }}>
          {FONT_SIZES.map(f => (
            <button key={f} onClick={() => set("fontSize", f)}
              style={{
                background: fontSize === f ? "#1e90ff" : "#222",
                border:"none", color:"white", fontSize:6,
                borderRadius:5, padding:"2px 6px", cursor:"pointer"
              }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Wallpaper */}
      <div className="settings-section-label">Wallpaper</div>
      <div className="wallpaper-row" style={{ flexShrink:0, width:"100%" }}>
        {WALLPAPERS.map(w => (
          <div key={w.id}
            className={`wallpaper-swatch ${(settings.wallpaper === w.id || (!settings.wallpaper && w.id === "default")) ? "selected" : ""}`}
            style={{ background: w.bg }}
            onClick={() => set("wallpaper", w.id)}
            title={w.label}
          />
        ))}
      </div>

      {/* Language */}
      <div className="settings-section-label">Language</div>
      <div className="setting-item">
        <span>🌐 Language</span>
        <select value={language} onChange={e => set("language", e.target.value)}
          style={{ background:"#222", border:"none", color:"white", fontSize:7, borderRadius:5, padding:"2px 4px" }}>
          {LANGUAGES.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="divider" />

      {/* About */}
      <div className="settings-section-label">About</div>
      <div className="about">
        <div><strong>Device</strong>: React Phone</div>
        <div><strong>Developer</strong>: BANDI</div>
        <div><strong>OS</strong>: v3.0 · React 18</div>
        <div><strong>Build</strong>: Stable · Production</div>
        <div><strong>Language</strong>: {language}</div>
        <div><strong>Font</strong>: {fontSize}</div>
        <div><strong>WiFi</strong>: {settings.wifi ? "Connected" : "Off"}</div>
        <div><strong>Bluetooth</strong>: {settings.bluetooth ? "On" : "Off"}</div>
      </div>
    </div>
  );
}

export default SettingsScreen;