import { useState, useRef, useEffect } from "react";

const DEFAULT_SONGS = [
  { id:1, title:"Night Drive",  artist:"Synth Wave", src:"/music/song1.mp3", emoji:"🌙" },
  { id:2, title:"Calm Breeze",  artist:"LoFi Beats",  src:"/music/song2.mp3", emoji:"🌊" },
  { id:3, title:"Deep Focus",   artist:"Chillhop",    src:"/music/song3.mp3", emoji:"🌿" },
];

const EQ_BANDS = ["60Hz","250Hz","1kHz","4kHz","16kHz"];

function MusicScreen() {
  const [songs,    setSongs]    = useState(DEFAULT_SONGS);
  const [current,  setCurrent]  = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle,  setShuffle]  = useState(false);
  const [repeat,   setRepeat]   = useState(false); // false | 'one' | 'all'
  const [showEQ,   setShowEQ]   = useState(false);
  const [eqBands,  setEqBands]  = useState([0, 0, 0, 0, 0]);
  const audioRef  = useRef(null);
  const fileRef   = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => {});
    else audio.pause();
  }, [playing, current]);

  function togglePlay() { setPlaying(p => !p); navigator.vibrate?.(20); }

  function nextSong() {
    const n = songs.length;
    if (shuffle) setCurrent(Math.floor(Math.random() * n));
    else setCurrent(p => (p + 1) % n);
    setProgress(0);
  }

  function prevSong() {
    setCurrent(p => (p === 0 ? songs.length - 1 : p - 1));
    setProgress(0);
  }

  function onEnded() {
    if (repeat === "one") { audioRef.current.currentTime = 0; audioRef.current.play(); }
    else if (repeat === "all" || shuffle) nextSong();
    else if (current < songs.length - 1) nextSong();
    else setPlaying(false);
  }

  function updateProgress() {
    const a = audioRef.current;
    setProgress((a.currentTime / a.duration) * 100 || 0);
  }

  function seek(e) {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * a.duration;
  }

  function cycleRepeat() {
    setRepeat(r => r === false ? "all" : r === "all" ? "one" : false);
  }

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newSong = {
      id: Date.now(),
      title: file.name.replace(/\.[^.]+$/, ""),
      artist: "Uploaded",
      src: url,
      emoji: "🎵",
    };
    setSongs(prev => [...prev, newSong]);
    setCurrent(songs.length);
    setPlaying(true);
    setProgress(0);
  }

  const song = songs[current] || songs[0];
  const repeatIcon = repeat === "one" ? "🔂" : repeat === "all" ? "🔁" : "↩️";

  return (
    <div className="music-screen">
      {/* Album art */}
      <div className="music-cover">
        <div className={`music-disc ${playing ? "spinning" : ""}`}>{song.emoji}</div>
      </div>

      {/* Info */}
      <div className="music-info">
        <div className="music-title">{song.title}</div>
        <div className="music-artist">{song.artist}</div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" onClick={seek} style={{ cursor:"pointer" }}>
        <div className="progress" style={{ width:`${progress}%` }} />
      </div>

      {/* Controls */}
      <div className="music-controls">
        <button className={`music-ctrl-btn ${shuffle ? "active" : ""}`} onClick={() => setShuffle(s => !s)}>🔀</button>
        <button className="music-ctrl-btn" onClick={prevSong}>⏮</button>
        <button className="music-play-btn" onClick={togglePlay}>{playing ? "⏸" : "▶"}</button>
        <button className="music-ctrl-btn" onClick={nextSong}>⏭</button>
        <button className={`music-ctrl-btn ${repeat ? "active" : ""}`} onClick={cycleRepeat}>{repeatIcon}</button>
      </div>

      {/* EQ + Upload row */}
      <div className="music-actions-row">
        <button className={`music-action-btn ${showEQ ? "active" : ""}`} onClick={() => setShowEQ(v => !v)}>
          🎚 EQ
        </button>
        <button className="music-action-btn" onClick={() => fileRef.current.click()}>
          ＋ Upload
        </button>
        <input ref={fileRef} type="file" accept="audio/*" style={{ display:"none" }} onChange={handleUpload} />
      </div>

      {/* EQ panel */}
      {showEQ && (
        <div className="eq-panel">
          {EQ_BANDS.map((band, i) => (
            <div key={band} className="eq-band">
              <div className="eq-label">{eqBands[i] > 0 ? "+" : ""}{eqBands[i]}dB</div>
              <input
                type="range" min="-12" max="12" value={eqBands[i]} step="1"
                className="eq-slider"
                onChange={e => {
                  const v = Number(e.target.value);
                  setEqBands(prev => prev.map((b, j) => j === i ? v : b));
                }}
              />
              <div className="eq-freq">{band}</div>
            </div>
          ))}
        </div>
      )}

      {/* Playlist */}
      <div className="playlist">
        {songs.map((s, i) => (
          <div key={s.id} className={`track ${i === current ? "active" : ""}`}
            onClick={() => { setCurrent(i); setPlaying(true); setProgress(0); }}>
            <span style={{ fontSize:10, marginRight:4 }}>{s.emoji}</span>
            <span style={{ flex:1 }}>{s.title}</span>
            <span className="small">{s.artist}</span>
          </div>
        ))}
      </div>

      <audio ref={audioRef} src={song.src} onTimeUpdate={updateProgress} onEnded={onEnded} />
    </div>
  );
}

export default MusicScreen;