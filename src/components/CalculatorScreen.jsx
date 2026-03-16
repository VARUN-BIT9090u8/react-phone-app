import { useState, useEffect } from "react";

const BASIC_KEYS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

const SCI_KEYS = [
  ["sin", "cos", "tan", "√"],
  ["log", "ln",  "x²", "xʸ"],
  ["π",   "e",   "(",  ")"],
  ["C",   "±",   "%",  "÷"],
  ["7",   "8",   "9",  "×"],
  ["4",   "5",   "6",  "-"],
  ["1",   "2",   "3",  "+"],
  ["0",   ".",   "⌫",  "="],
];

function CalculatorScreen() {
  const [input, setInput]     = useState("");
  const [history, setHistory] = useState([]);
  const [sci, setSci]         = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("calc_history"));
      if (Array.isArray(saved)) setHistory(saved);
    } catch {}
  }, []);

  function saveHistory(h) {
    setHistory(h);
    localStorage.setItem("calc_history", JSON.stringify(h));
  }

  function press(key) {
    if (key === "C")  { setInput(""); return; }
    if (key === "⌫")  { setInput(p => p.slice(0, -1)); return; }
    if (key === "±")  { setInput(p => p.startsWith("-") ? p.slice(1) : "-" + p); return; }
    if (key === "π")  { setInput(p => p + Math.PI.toFixed(8)); return; }
    if (key === "e")  { setInput(p => p + Math.E.toFixed(8)); return; }

    if (["sin","cos","tan","log","ln","√"].includes(key)) {
      setInput(p => key + "(" + p);
      return;
    }
    if (key === "x²") { setInput(p => "(" + p + ")**2"); return; }
    if (key === "xʸ") { setInput(p => p + "**"); return; }

    if (key === "=") {
      try {
        let expr = input
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/sin\(/g,  "Math.sin(Math.PI/180*")
          .replace(/cos\(/g,  "Math.cos(Math.PI/180*")
          .replace(/tan\(/g,  "Math.tan(Math.PI/180*")
          .replace(/log\(/g,  "Math.log10(")
          .replace(/ln\(/g,   "Math.log(")
          .replace(/√\(/g,    "Math.sqrt(");
        // eslint-disable-next-line no-new-func
        const result = new Function("return " + expr)();
        const rounded = parseFloat(result.toFixed(10)).toString();
        const entry = input + " = " + rounded;
        const newH = [entry, ...history].slice(0, 20);
        saveHistory(newH);
        setInput(rounded);
      } catch {
        setInput("Error");
      }
      return;
    }

    if (key === "%") { setInput(p => p + "/100"); return; }
    setInput(p => p + key);
  }

  const KEYS = sci ? SCI_KEYS : BASIC_KEYS;

  return (
    <div className="calculator">
      {/* mode toggle */}
      <div className="calc-mode-row">
        <button
          className={`calc-mode-btn ${!sci ? "active" : ""}`}
          onClick={() => setSci(false)}
        >Basic</button>
        <button
          className={`calc-mode-btn ${sci ? "active" : ""}`}
          onClick={() => setSci(true)}
        >Scientific</button>
      </div>

      <div className="calc-display">{input || "0"}</div>

      <div className={`calc-grid ${sci ? "calc-grid-sci" : ""}`}>
        {KEYS.flat().map((k, i) => (
          <button
            key={i}
            className={`calc-btn ${
              ["="].includes(k) ? "calc-btn-eq" :
              ["+","-","×","÷"].includes(k) ? "calc-btn-op" :
              ["sin","cos","tan","log","ln","√","x²","xʸ","π","e"].includes(k) ? "calc-btn-sci" :
              ["C","⌫","±","%"].includes(k) ? "calc-btn-util" : ""
            }`}
            onClick={() => press(k)}
          >{k}</button>
        ))}
      </div>

      <div className="calc-history">
        {history.slice(0, 5).map((h, i) => <div key={i}>{h}</div>)}
      </div>
    </div>
  );
}

export default CalculatorScreen;