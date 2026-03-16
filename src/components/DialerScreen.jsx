import { useState, useEffect } from "react";

const MISSED_COLOR = "#e74c3c";
const CALL_TYPES   = { outgoing:"📞", incoming:"📲", missed:"❌" };

function DialerScreen({ initialNumber = "", onCall }) {
  const [number,     setNumber]     = useState(initialNumber);
  const [recentCalls,setRecentCalls]= useState(() => {
    try { return JSON.parse(localStorage.getItem("recent_calls")) || []; }
    catch { return []; }
  });
  const [tab, setTab] = useState("dialer"); // "dialer" | "recent"

  useEffect(() => { setNumber(initialNumber); }, [initialNumber]);

  function saveCall(num, type) {
    const entry = {
      number: num,
      type,
      time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
      date: new Date().toLocaleDateString([], { month:"short", day:"numeric" }),
    };
    const updated = [entry, ...recentCalls].slice(0, 20);
    setRecentCalls(updated);
    localStorage.setItem("recent_calls", JSON.stringify(updated));
  }

  function handleCall() {
    if (!number.trim()) return;
    navigator.vibrate?.(40);
    saveCall(number, "outgoing");
    onCall(number);
  }

  function handlePress(digit) {
    navigator.vibrate?.(10);
    setNumber(prev => prev + digit);
  }

  function clearRecent() {
    setRecentCalls([]);
    localStorage.removeItem("recent_calls");
  }

  const missedCount = recentCalls.filter(c => c.type === "missed").length;

  return (
    <div className="dialer">
      {/* Tabs */}
      <div className="dialer-tabs">
        <button className={`dialer-tab ${tab === "dialer" ? "active" : ""}`}
          onClick={() => setTab("dialer")}>Keypad</button>
        <button className={`dialer-tab ${tab === "recent" ? "active" : ""}`}
          onClick={() => setTab("recent")}>
          Recent
          {missedCount > 0 && <span className="missed-badge">{missedCount}</span>}
        </button>
      </div>

      {tab === "dialer" && (
        <>
          <div className="dialer-display">{number || "Enter number"}</div>
          <div className="dialer-keys">
            {["1","2","3","4","5","6","7","8","9","*","0","#"].map(d => (
              <button key={d} onClick={() => handlePress(d)}>{d}</button>
            ))}
          </div>
          <div className="dialer-actions">
            <button onClick={() => setNumber(p => p.slice(0,-1))}
              style={{ background:"#333" }}>⌫</button>
            <button onClick={handleCall}
              style={{ background:"#25d366" }}>📞</button>
          </div>
        </>
      )}

      {tab === "recent" && (
        <div className="recent-calls">
          {recentCalls.length === 0 && (
            <div className="recent-empty">No recent calls</div>
          )}
          {recentCalls.map((c, i) => (
            <div key={i} className="recent-row">
              <span className="recent-type">{CALL_TYPES[c.type]}</span>
              <div className="recent-info">
                <div className="recent-number" style={{ color: c.type === "missed" ? MISSED_COLOR : "white" }}>
                  {c.number}
                </div>
                <div className="recent-time">{c.date} · {c.time}</div>
              </div>
              <button className="recent-call-btn"
                onClick={() => { setNumber(c.number); setTab("dialer"); }}>📞</button>
            </div>
          ))}
          {recentCalls.length > 0 && (
            <button onClick={clearRecent} className="clear-recent-btn">Clear All</button>
          )}
        </div>
      )}
    </div>
  );
}

export default DialerScreen;