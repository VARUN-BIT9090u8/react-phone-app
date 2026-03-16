import { useState, useRef, useEffect } from "react";

const EMOJIS = ["😀","😂","❤️","👍","🔥","😭","🙏","😍","🤔","😎","👋","🎉","💯","😅","🥺"];

const AUTO_REPLIES = ["Okay 👍","Sounds good!","Busy now, talk later","Sure thing!","On my way","Call me later","👍","Got it!","Will do!","Noted"];

function MessageChat({ contact, contactName, chats, setChats, onBack }) {
  const [text,        setText]        = useState("");
  const [showEmoji,   setShowEmoji]   = useState(false);
  const [readMap,     setReadMap]     = useState({});
  const endRef   = useRef(null);
  const fileRef  = useRef(null);

  const messages = chats[contact] ?? [];

  // Mark bot messages as read when opened
  useEffect(() => {
    const map = {};
    messages.forEach((m, i) => { if (m.from === "bot") map[i] = true; });
    setReadMap(map);
  }, [contact]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function time() {
    return new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  }

  function pushMsg(msg) {
    setChats(prev => ({
      ...prev,
      [contact]: [...(prev[contact] || []), msg],
    }));
  }

  function sendMessage() {
    if (!text.trim()) return;
    navigator.vibrate?.(20);
    pushMsg({ text, from:"me", time: time(), type:"text" });
    setText("");
    setShowEmoji(false);
    autoReply();
  }

  function sendImage(src) {
    pushMsg({ text:"📷 Photo", from:"me", time: time(), type:"image", src });
    autoReply();
  }

  function autoReply() {
    setTimeout(() => {
      pushMsg({
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        from: "bot", time: time(), type:"text",
      });
    }, 1200);
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => sendImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="chat">
      {/* Header */}
      <div className="chat-header">
        <button onClick={onBack} style={{ background:"none", border:"none", color:"white", fontSize:10, cursor:"pointer" }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:8 }}>{contactName || contact}</div>
          <div style={{ fontSize:5.5, opacity:0.6 }}>online</div>
        </div>
        <span style={{ fontSize:9 }}>📞</span>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {messages.length === 0 && (
          <div style={{ textAlign:"center", fontSize:6.5, opacity:0.4, padding:10 }}>
            Say hi to {contactName || contact}!
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from}`}>
            {m.type === "image"
              ? <img src={m.src} alt="img" style={{ width:60, borderRadius:4, display:"block" }} />
              : m.text}
            <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:2, marginTop:1 }}>
              <span className="time">{m.time}</span>
              {m.from === "me" && (
                <span style={{ fontSize:5, color: readMap[i] ? "#4fc3f7" : "rgba(255,255,255,0.4)" }}>✓✓</span>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="emoji-picker">
          {EMOJIS.map(e => (
            <button key={e} className="emoji-btn" onClick={() => setText(t => t + e)}>{e}</button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="chat-input">
        <button className="chat-icon-btn" onClick={() => setShowEmoji(v => !v)}>😊</button>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Message"
        />
        <button className="chat-icon-btn" onClick={() => fileRef.current.click()}>📷</button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImageUpload} />
        <button onClick={sendMessage} style={{ background:"#25d366", border:"none", borderRadius:"50%", width:18, height:18, fontSize:9, cursor:"pointer" }}>➤</button>
      </div>
    </div>
  );
}

export default MessageChat;