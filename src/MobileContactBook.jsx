import { useState, useEffect, useRef, useMemo } from "react";

import ContactsScreen  from "./components/ContactsScreen";
import CameraScreen    from "./components/CameraScreen";
import GridScreen      from "./components/GridScreen";
import CalculatorScreen from "./components/CalculatorScreen";
import NotesScreen     from "./components/NotesScreen";
import DialerScreen    from "./components/DialerScreen";
import CallScreen      from "./components/CallScreen";
import MessageChat     from "./components/MessageChat";
import MessageList     from "./components/MessageList";
import GalleryScreen   from "./components/GalleryScreen";
import MusicScreen     from "./components/MusicScreen";
import SettingsScreen  from "./components/SettingsScreen";
import WeatherScreen   from "./components/WeatherScreen";
import AlarmScreen     from "./components/AlarmScreen";

/* ── ROUTES ── */
const ROUTES = {
  HOME:null, CONTACTS:"Contacts", MESSAGE:"Message", CAMERA:"Camera",
  GRID:"Grid", DIALER:"Dialer", CALL:"Call", CALCULATOR:"Calculator",
  NOTES:"Notes", GALLERY:"Gallery", MUSIC:"Music", SETTINGS:"Settings",
  WEATHER:"Weather", ALARM:"Alarm",
};

const CONTACTS_DATA = [
  { name:"BANDI",  number:"9876543210" },
  { name:"VARUN",  number:"9123456780" },
  { name:"KUMAR",  number:"9988776655" },
  { name:"RAHUL",  number:"9000011111" },
  { name:"SURESH", number:"9012345678" },
];
const contactMap = Object.fromEntries(CONTACTS_DATA.map(c=>[c.number,c.name]));

const WALLPAPER_BG = {
  default:"#111",
  sunset:"linear-gradient(135deg,#f093fb,#f5576c)",
  ocean:"linear-gradient(135deg,#4facfe,#00f2fe)",
  forest:"linear-gradient(135deg,#43e97b,#38f9d7)",
  night:"linear-gradient(135deg,#0f0c29,#302b63)",
};

const CORRECT_PIN = "1234";

function MobileContactBook() {
  /* ── core state ── */
  const [activeApp,   setActiveApp]   = useState(ROUTES.HOME);
  const [prevApps,    setPrevApps]    = useState([]);          // history for switcher
  const [lockState,   setLockState]   = useState("locked");   // "locked"|"pin"|"unlocked"
  const [pinInput,    setPinInput]    = useState("");
  const [pinError,    setPinError]    = useState(false);
  const [query,       setQuery]       = useState("");
  const [now,         setNow]         = useState(new Date());
  const [battery,     setBattery]     = useState(78);
  const [charging,    setCharging]    = useState(false);
  const [callTarget,  setCallTarget]  = useState(null);
  const [activeChat,  setActiveChat]  = useState(null);
  const [showNotifs,  setShowNotifs]  = useState(false);
  const [notifClosing,setNotifClosing]= useState(false);
  const [showSwitcher,setShowSwitcher]= useState(false);
  const [cameraPhotos,setCameraPhotos]= useState([]);
  const [appOrder,    setAppOrder]    = useState([
    {name:ROUTES.CONTACTS,icon:"📇"},{name:ROUTES.CAMERA,icon:"📷"},
    {name:ROUTES.MESSAGE, icon:"💬"},{name:ROUTES.GALLERY,icon:"🖼️"},
    {name:ROUTES.MUSIC,   icon:"🎵"},{name:ROUTES.CALCULATOR,icon:"🧮"},
    {name:ROUTES.NOTES,   icon:"📝"},{name:ROUTES.WEATHER,icon:"🌤️"},
    {name:ROUTES.ALARM,   icon:"⏰"},{name:ROUTES.SETTINGS,icon:"⚙️"},
  ]);
  const [dragIdx,   setDragIdx]   = useState(null);
  const [dragOver,  setDragOver]  = useState(null);
  const homeHoldRef = useRef(null);

  /* ── persistent state ── */
  const [chats, setChats] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chats")) || {}; } catch { return {}; }
  });
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("settings")) || {
        darkMode:true, lockEnabled:true, sound:true, vibration:true,
        wifi:true, bluetooth:false, airplane:false, notifications:true,
        wallpaper:"default", fontSize:"Medium", language:"English",
      };
    } catch {
      return {
        darkMode:true, lockEnabled:true, sound:true, vibration:true,
        wifi:true, bluetooth:false, airplane:false, notifications:true,
        wallpaper:"default", fontSize:"Medium", language:"English",
      };
    }
  });

  useEffect(()=>{ localStorage.setItem("chats", JSON.stringify(chats)); },[chats]);
  useEffect(()=>{ localStorage.setItem("settings", JSON.stringify(settings)); },[settings]);

  /* ── live clock ── */
  useEffect(()=>{
    const t = setInterval(()=> setNow(new Date()), 1000);
    return ()=> clearInterval(t);
  },[]);

  /* ── battery drain simulation ── */
  useEffect(()=>{
    const t = setInterval(()=>{
      setBattery(b => {
        if (charging) return Math.min(100, b + 1);
        return Math.max(5, b - 0.05);
      });
    }, 30000);
    return ()=> clearInterval(t);
  },[charging]);

  /* ── notifications ── */
  const [notifications, setNotifications] = useState([
    { id:1, app:"Messages", text:"BANDI: Hey, are you free?", time:"10:30", icon:"💬" },
    { id:2, app:"Alarm",    text:"Alarm in 1 hour",           time:"09:00", icon:"⏰" },
    { id:3, app:"Weather",  text:"Rain expected today",       time:"08:00", icon:"🌧️" },
  ]);

  function addNotification(app, text, icon) {
    if (!settings.notifications) return;
    const n = { id:Date.now(), app, text, time:now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), icon };
    setNotifications(prev => [n, ...prev].slice(0, 10));
  }

  function clearNotif(id) { setNotifications(prev => prev.filter(n => n.id !== id)); }

  /* ── unread badge ── */
  const unreadCount = useMemo(() =>
    Object.values(chats).filter(msgs=>{ const l=msgs[msgs.length-1]; return l&&l.from==="bot"; }).length
  ,[chats]);

  /* ── vibrate helper ── */
  function vibe(ms=20){ if(settings.vibration) navigator.vibrate?.(ms); }

  /* ── PIN lock ── */
  function handlePinPress(d) {
    vibe(10);
    const next = pinInput + d;
    setPinInput(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        setLockState("unlocked");
        setPinInput("");
        setPinError(false);
      } else {
        setPinError(true);
        vibe([100,50,100]);
        setTimeout(()=>{ setPinInput(""); setPinError(false); }, 600);
      }
    }
  }

  /* ── navigation ── */
  function openApp(route) {
    vibe(20);
    if (activeApp) setPrevApps(prev => [...prev, activeApp].slice(-5));
    setActiveApp(route);
    setShowSwitcher(false);
    setNotifClosing(true);
    setTimeout(()=>{ setShowNotifs(false); setNotifClosing(false); }, 240);
  }

  function goHome() {
    vibe(15);
    setActiveApp(ROUTES.HOME);
    setActiveChat(null);
    setShowSwitcher(false);
    setShowNotifs(false);
  }

  function goBack() {
    if (prevApps.length > 0) {
      const prev = prevApps[prevApps.length - 1];
      setPrevApps(p => p.slice(0,-1));
      setActiveApp(prev);
    } else {
      goHome();
    }
  }

  /* ── home button hold → app switcher ── */
  function onHomePress()  { homeHoldRef.current = setTimeout(()=> setShowSwitcher(true), 500); }
  function onHomeRelease(){ clearTimeout(homeHoldRef.current); }

  /* ── drag-to-reorder ── */
  function onDragStart(i) { setDragIdx(i); }
  function onDragEnter(i) { setDragOver(i); }
  function onDragEnd() {
    if (dragIdx !== null && dragOver !== null && dragIdx !== dragOver) {
      const updated = [...appOrder];
      const [moved] = updated.splice(dragIdx, 1);
      updated.splice(dragOver, 0, moved);
      setAppOrder(updated);
    }
    setDragIdx(null); setDragOver(null);
  }

  /* ── wallpaper ── */
  const wallBg = WALLPAPER_BG[settings.wallpaper] || "#111";

  /* ── battery color ── */
  const battColor = battery < 20 ? "#e74c3c" : battery < 40 ? "#f39c12" : "#25d366";

  /* ── font size ── */
  const fontPx = { Small:8, Medium:10, Large:12 }[settings.settings?.fontSize || "Medium"] || 10;

  /* ── ROUTER ── */
  function renderScreen() {
    switch (activeApp) {
      case ROUTES.CONTACTS:
        return <ContactsScreen
          onCall={c=>{ setCallTarget(c.number); openApp(ROUTES.DIALER); }}
          onMessage={c=>{ setActiveChat(c.number); openApp(ROUTES.MESSAGE); }} />;

      case ROUTES.MESSAGE:
        return activeChat
          ? <MessageChat contact={activeChat} contactName={contactMap[activeChat]}
              chats={chats} setChats={setChats} onBack={()=>setActiveChat(null)} />
          : <MessageList chats={chats} contactMap={contactMap}
              onOpenChat={num=>{ setActiveChat(num); }} />;

      case ROUTES.CAMERA:
        return <CameraScreen onBack={goHome}
          onSend={photo=>{ setCameraPhotos(p=>[...p,photo]); addNotification("Gallery","Photo saved to camera roll","📷"); goHome(); }} />;

      case ROUTES.GRID:
        return <GridScreen apps={appOrder} unreadCount={unreadCount}
          onOpenApp={openApp}
          dragIdx={dragIdx} dragOver={dragOver}
          onDragStart={onDragStart} onDragEnter={onDragEnter} onDragEnd={onDragEnd} />;

      case ROUTES.DIALER:
        return <DialerScreen initialNumber={callTarget}
          onCall={num=>{ setCallTarget(num||callTarget); openApp(ROUTES.CALL); }} />;

      case ROUTES.CALL:
        return callTarget
          ? <CallScreen name={contactMap[callTarget]||callTarget} onEnd={goHome} />
          : <div style={{padding:12}}>No call target</div>;

      case ROUTES.CALCULATOR: return <CalculatorScreen />;
      case ROUTES.NOTES:      return <NotesScreen onBack={goHome} />;
      case ROUTES.GALLERY:    return <GalleryScreen cameraPhotos={cameraPhotos} />;
      case ROUTES.MUSIC:      return <MusicScreen />;
      case ROUTES.WEATHER:    return <WeatherScreen />;
      case ROUTES.ALARM:      return <AlarmScreen />;
      case ROUTES.SETTINGS:   return <SettingsScreen settings={settings} setSettings={setSettings} />;
      default: return <div style={{padding:12,fontSize:9}}>App: {String(activeApp)}</div>;
    }
  }

  /* ── dark/light mode class ── */
  const themeClass = settings.darkMode ? "theme-dark" : "theme-light";

  return (
    <div className={`phone ${activeApp?"phone-open":""} ${themeClass}`}
      style={{ background: activeApp ? undefined : wallBg }}>

      {/* Animated wallpaper particles (home only) */}
      {!activeApp && (
        <div className="wallpaper-anim">
          {[...Array(6)].map((_,i)=><div key={i} className={`wp-particle wp-p${i}`} />)}
        </div>
      )}

      {/* STATUS BAR */}
      <div className="status-bar">
        <div className="status-left" style={{display:"flex",gap:2,fontSize:6,color:"white",paddingLeft:3,alignItems:"center"}}>
          {settings.wifi      && <span>📶</span>}
          {settings.bluetooth && <span>🔵</span>}
          {settings.airplane  && <span>✈️</span>}
          {unreadCount > 0    && <span style={{background:"#e74c3c",borderRadius:"50%",padding:"0 2px",fontSize:5}}>{unreadCount}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:3}}>
          <span style={{fontSize:5,color:"white",opacity:.7}}
            onClick={()=>setCharging(c=>!c)}>
            {charging?"⚡":""}
          </span>
          <span style={{fontSize:5.5,color:battColor}}>
            {"█".repeat(Math.ceil(battery/20))}{"░".repeat(5-Math.ceil(battery/20))} {Math.round(battery)}%
          </span>
        </div>
      </div>

      {/* CLOCK CARD */}
      <div className="card" style={{transition:"opacity .2s", opacity: activeApp ? 0 : 1, pointerEvents: activeApp ? "none" : "auto"}}>
        <div className="time">
          <span className="status-time">
            {now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
          </span>
        </div>
        <div className="day">
          {now.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-box" style={{opacity:activeApp?0:1,pointerEvents:activeApp?"none":"auto",transition:"opacity .2s"}}>
        <span className="icon-left">🔍</span>
        <input type="text" placeholder="Search Google" value={query}
          onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&query.trim()){ window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`,"_blank"); setQuery(""); }}} />
        <span className="icon-right">🎤</span>
      </div>

      {/* NOTIFICATION CENTER — swipe down simulation via button */}
      {showNotifs && (
        <div className={`notif-center ${notifClosing?"closing":""}`}>
          <div className="notif-header">
            <span style={{fontSize:7,fontWeight:700}}>Notifications</span>
            <button onClick={()=>setNotifications([])} className="notif-clear-btn">Clear all</button>
          </div>
          {notifications.length === 0 && <div className="notif-empty">No notifications</div>}
          {notifications.map(n=>(
            <div key={n.id} className="notif-item">
              <span className="notif-icon">{n.icon}</span>
              <div className="notif-body">
                <div className="notif-app">{n.app}</div>
                <div className="notif-text">{n.text}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2}}>
                <span className="notif-time">{n.time}</span>
                <button onClick={()=>clearNotif(n.id)} className="notif-dismiss">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APP SWITCHER */}
      {showSwitcher && (
        <div className="app-switcher">
          <div className="switcher-title">Recent Apps</div>
          <div className="switcher-cards">
            {prevApps.slice().reverse().map((app,i)=>(
              <div key={i} className="switcher-card" onClick={()=>{ setActiveApp(app); setShowSwitcher(false); }}>
                <div className="switcher-app-name">{app}</div>
              </div>
            ))}
            {prevApps.length===0 && <div style={{fontSize:7,opacity:.4,padding:8}}>No recent apps</div>}
          </div>
          <button onClick={()=>setShowSwitcher(false)} className="switcher-close">✕</button>
        </div>
      )}

      {/* PIN LOCK SCREEN */}
      {lockState==="pin" && settings.lockEnabled && (
        <div className="pin-screen">
          <div className="pin-time">{now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
          <div className="pin-label">Enter PIN</div>
          <div className="pin-dots">
            {[0,1,2,3].map(i=>(
              <div key={i} className={`pin-dot ${pinInput.length>i?"filled":""} ${pinError?"error":""}`} />
            ))}
          </div>
          {pinError && <div className="pin-error">Wrong PIN</div>}
          <div className="pin-grid">
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d,i)=>(
              <button key={i} className="pin-btn"
                onClick={()=>{ if(d==="⌫") setPinInput(p=>p.slice(0,-1)); else if(d) handlePinPress(d); }}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAP LOCK SCREEN */}
      {lockState==="locked" && settings.lockEnabled && (
        <div className="lock-screen" onClick={()=>{ vibe(30); setLockState("pin"); }}>
          <div className="lock-time">{now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
          <div className="lock-date">{now.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}</div>
          <div className="lock-hint">Tap to unlock</div>
        </div>
      )}

      {/* MAIN SCREEN */}
      <div className={`screen ${activeApp?"screen-open":""}`}>
        {renderScreen()}
      </div>

      {/* DOCK */}
      {!activeApp && (
        <div className="app-dock">
          <button onClick={()=>openApp(ROUTES.CONTACTS)}>📇</button>
          <button onClick={()=>openApp(ROUTES.MESSAGE)} style={{position:"relative"}}>
            💬
            {unreadCount>0 && <span className="dock-badge">{unreadCount}</span>}
          </button>
          <button onClick={()=>openApp(ROUTES.CAMERA)}>📷</button>
          <button onClick={()=>openApp(ROUTES.GRID)}>☰</button>
          <button onClick={()=>openApp(ROUTES.DIALER)}>📞</button>
        </div>
      )}

      {/* SYSTEM NAV */}
      {activeApp && (
        <div className="system-nav">
          <button onClick={goBack}>◀︎</button>
          <button
            onMouseDown={onHomePress} onMouseUp={onHomeRelease}
            onTouchStart={onHomePress} onTouchEnd={onHomeRelease}
            onClick={goHome}>⏺︎</button>
          <button onClick={()=>setShowSwitcher(v=>!v)}>☰</button>
        </div>
      )}

      {/* NOTIF PULL TAB (always visible) */}
      <div className="notif-tab" onClick={()=>{
          vibe(10);
          if(showNotifs){
            setNotifClosing(true);
            setTimeout(()=>{ setShowNotifs(false); setNotifClosing(false); }, 240);
          } else {
            setShowNotifs(true);
          }
        }}>
        {notifications.length>0 && <span className="notif-tab-count">{notifications.length}</span>}
        {showNotifs ? "▲" : "▼"}
      </div>
    </div>
  );
}

export default MobileContactBook;