import { useState, useEffect, useRef } from "react";

const DAYS  = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const SOUNDS = ["Default","Beep","Chime","Bell","Buzz"];

function AlarmScreen() {
  const [alarms,  setAlarms]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("alarms")) || []; }
    catch { return []; }
  });
  const [newTime,  setNewTime]  = useState("07:00");
  const [newLabel, setNewLabel] = useState("");
  const [newDays,  setNewDays]  = useState([1,2,3,4,5]); // Mon-Fri default
  const [newSound, setNewSound] = useState("Default");
  const [ringing,  setRinging]  = useState(null);
  const [snoozed,  setSnoozed]  = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now   = new Date();
      const hhmm  = now.toTimeString().slice(0, 5);
      const day   = now.getDay();
      alarms.forEach(a => {
        if (a.enabled && a.time === hhmm && !ringing) {
          // check repeat days
          if (a.days.length === 0 || a.days.includes(day)) {
            setRinging(a);
            navigator.vibrate?.([500, 200, 500, 200, 500]);
          }
        }
      });
      // snooze check
      if (snoozed && new Date() >= snoozed.snoozeUntil) {
        setRinging(snoozed);
        setSnoozed(null);
      }
    }, 10000);
    return () => clearInterval(intervalRef.current);
  }, [alarms, ringing, snoozed]);

  function addAlarm() {
    if (!newTime) return;
    setAlarms(prev => [...prev, {
      id: Date.now(), time: newTime,
      label: newLabel || "Alarm",
      days: newDays, sound: newSound,
      enabled: true,
    }]);
    setNewLabel(""); setNewDays([1,2,3,4,5]);
  }

  function toggleAlarm(id) {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  }

  function deleteAlarm(id) {
    setAlarms(prev => prev.filter(a => a.id !== id));
  }

  function toggleDay(d) {
    setNewDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  function dismiss() { setRinging(null); navigator.vibrate?.(0); }

  function snooze() {
    const snoozeUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    setSnoozed({ ...ringing, snoozeUntil });
    setRinging(null);
    navigator.vibrate?.(0);
  }

  return (
    <div className="alarm-screen">
      {/* Ringing overlay */}
      {ringing && (
        <div className="alarm-ringing">
          <div className="ring-icon">⏰</div>
          <div className="ring-time">{ringing.time}</div>
          <div className="ring-label">{ringing.label}</div>
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button className="snooze-btn" onClick={snooze}>💤 Snooze 5m</button>
            <button className="ring-dismiss" onClick={dismiss}>✕ Dismiss</button>
          </div>
        </div>
      )}

      <div className="alarm-header">⏰ Alarms</div>

      {/* Add alarm */}
      <div className="alarm-add">
        <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="alarm-time-input" />
        <input type="text" placeholder="Label" value={newLabel}
          onChange={e => setNewLabel(e.target.value)} className="alarm-label-input" />
        <button className="alarm-add-btn" onClick={addAlarm}>＋</button>
      </div>

      {/* Days selector */}
      <div className="alarm-days-row">
        {DAYS.map((d, i) => (
          <button key={d} className={`day-btn ${newDays.includes(i) ? "active" : ""}`}
            onClick={() => toggleDay(i)}>{d}</button>
        ))}
        <select value={newSound} onChange={e => setNewSound(e.target.value)}
          className="sound-select">
          {SOUNDS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Alarm list */}
      <div className="alarm-list">
        {alarms.length === 0 && <div className="alarm-empty">No alarms set</div>}
        {alarms.map(a => (
          <div key={a.id} className={`alarm-item ${a.enabled ? "on" : "off"}`}>
            <div className="alarm-info">
              <div className="alarm-time">{a.time}</div>
              <div className="alarm-label-text">{a.label}</div>
              <div style={{ fontSize:5.5, opacity:0.4, marginTop:1 }}>
                {a.days.length === 0 ? "Once"
                  : a.days.length === 7 ? "Every day"
                  : a.days.map(d => DAYS[d]).join(" ")}
                {" · "}{a.sound}
              </div>
            </div>
            <div className="alarm-controls">
              <input type="checkbox" checked={a.enabled} onChange={() => toggleAlarm(a.id)} />
              <button className="alarm-delete" onClick={() => deleteAlarm(a.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlarmScreen;