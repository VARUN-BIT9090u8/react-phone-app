import { useState, useRef } from "react";

const PALETTE = [
  { bg:"linear-gradient(135deg,#f093fb,#f5576c)", emoji:"🌅", label:"Sunset",    album:"Nature"    },
  { bg:"linear-gradient(135deg,#4facfe,#00f2fe)", emoji:"🏖️", label:"Beach",     album:"Travel"    },
  { bg:"linear-gradient(135deg,#43e97b,#38f9d7)", emoji:"☁️", label:"Sky",       album:"Nature"    },
  { bg:"linear-gradient(135deg,#fa709a,#fee140)", emoji:"🌸", label:"Flowers",   album:"Nature"    },
  { bg:"linear-gradient(135deg,#a18cd1,#fbc2eb)", emoji:"⛰️", label:"Mountains", album:"Travel"    },
  { bg:"linear-gradient(135deg,#ffecd2,#fcb69f)", emoji:"🌲", label:"Forest",    album:"Nature"    },
  { bg:"linear-gradient(135deg,#667eea,#764ba2)", emoji:"🏙️", label:"City",      album:"Travel"    },
  { bg:"linear-gradient(135deg,#f6d365,#fda085)", emoji:"🏜️", label:"Desert",    album:"Travel"    },
  { bg:"linear-gradient(135deg,#89f7fe,#66a6ff)", emoji:"❄️", label:"Snow",      album:"Nature"    },
  { bg:"linear-gradient(135deg,#fddb92,#d1fdff)", emoji:"🌊", label:"Ocean",     album:"Nature"    },
  { bg:"linear-gradient(135deg,#a1c4fd,#c2e9fb)", emoji:"🌻", label:"Garden",    album:"Nature"    },
  { bg:"linear-gradient(135deg,#d4fc79,#96e6a1)", emoji:"🌄", label:"Sunrise",   album:"Nature"    },
];

const ALBUMS = ["All", "Nature", "Travel", "Camera Roll"];

function GalleryScreen({ cameraPhotos = [] }) {
  const [photos,   setPhotos]   = useState(() =>
    PALETTE.map((p, i) => ({ ...p, id: i, type:"stock" }))
  );
  const [album,    setAlbum]    = useState("All");
  const [preview,  setPreview]  = useState(null);
  const fileRef = useRef(null);

  // Merge camera roll
  const allPhotos = [
    ...photos,
    ...cameraPhotos.map((src, i) => ({
      id: "cam-" + i, bg:"#111", emoji:"", label:"Photo " + (i+1),
      album:"Camera Roll", type:"camera", src,
    })),
  ];

  const filtered = album === "All" ? allPhotos : allPhotos.filter(p => p.album === album);

  function deletePhoto(id) {
    setPhotos(prev => prev.filter(p => p.id !== id));
    setPreview(null);
  }

  function handleImport(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          bg: "#111", emoji: "", label: file.name.replace(/\.[^.]+$/,""),
          album: "Camera Roll", type:"import", src: ev.target.result,
        }]);
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="gallery-screen">
      {/* Full-screen preview */}
      {preview && (
        <div className="gallery-preview-overlay"
          style={{ background: preview.src ? "#000" : preview.bg }}
          onClick={() => setPreview(null)}>
          {preview.src
            ? <img src={preview.src} alt={preview.label} style={{ maxWidth:"100%", maxHeight:"70%", objectFit:"contain", borderRadius:6 }} />
            : <div className="gallery-preview-emoji">{preview.emoji}</div>}
          <div className="gallery-preview-label">{preview.label}</div>
          {preview.album && <div style={{ fontSize:6, opacity:0.5, color:"white" }}>{preview.album}</div>}
          <button className="gallery-preview-delete"
            onClick={e => { e.stopPropagation(); deletePhoto(preview.id); }}>
            🗑 Delete
          </button>
          <div className="gallery-preview-close">✕ Tap to close</div>
        </div>
      )}

      {/* Header */}
      <div className="gallery-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span>🖼️ Gallery ({filtered.length})</span>
        <button onClick={() => fileRef.current.click()}
          style={{ background:"#1e90ff", border:"none", color:"white", fontSize:6, borderRadius:6, padding:"2px 5px", cursor:"pointer" }}>
          ＋ Import
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleImport} />
      </div>

      {/* Album tabs */}
      <div className="group-tabs" style={{ padding:"3px 4px" }}>
        {ALBUMS.map(a => (
          <button key={a} className={`group-tab ${album === a ? "active" : ""}`}
            onClick={() => setAlbum(a)}>{a}
            {a === "Camera Roll" && cameraPhotos.length > 0 &&
              <span style={{ marginLeft:2, background:"#e74c3c", borderRadius:"50%", padding:"0 2px", fontSize:5 }}>
                {cameraPhotos.length}
              </span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="gallery-empty">
          {album === "Camera Roll" ? "No camera photos yet.\nUse the Camera app to take photos." : "No photos"}
        </div>
      )}

      <div className="gallery-grid">
        {filtered.map(p => (
          <div key={p.id} className="gallery-tile"
            style={{ background: p.src ? "#000" : p.bg }}
            onClick={() => setPreview(p)}>
            {p.src
              ? <img src={p.src} alt={p.label} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:3 }} />
              : <span className="gallery-tile-emoji">{p.emoji}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryScreen;