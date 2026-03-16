import { useEffect, useState } from "react";

function CallScreen({ name, onEnd }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!name) return; // ⛔ DO NOT START TIMER WITHOUT NAME

    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [name]);

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  // ⛔ HARD GUARD — prevents blank screen forever
  if (!name) {
    return (
      <div className="call-screen">
        <div className="call-top">
          <div className="call-name">No contact</div>
        </div>
        <div className="call-actions">
          <button className="call-end" onClick={onEnd}>⛔</button>
        </div>
      </div>
    );
  }

  return (
    <div className="call-screen">
      <div className="call-top">
        <div className="call-name">{name}</div>
        <div className="call-status">
          Calling… {formatTime(seconds)}
        </div>
      </div>

      <div className="call-avatar">
        {name.charAt(0)}
      </div>

      <div className="call-actions">
        <button className="call-end" onClick={onEnd}>📞</button>
      </div>
    </div>
  );
}

export default CallScreen;
