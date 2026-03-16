import { useState, useRef } from "react";

const DEFAULT_CONTACTS = [
  { id: 1, name: "BANDI",  number: "9876543210", favourite: true,  group: "Friends",  photo: null },
  { id: 2, name: "VARUN",  number: "9123456780", favourite: false, group: "Work",     photo: null },
  { id: 3, name: "KUMAR",  number: "9988776655", favourite: true,  group: "Family",   photo: null },
  { id: 4, name: "RAHUL",  number: "9000011111", favourite: false, group: "Friends",  photo: null },
  { id: 5, name: "SURESH", number: "9012345678", favourite: false, group: "Work",     photo: null },
];

const GROUPS = ["All", "Favourites", "Friends", "Family", "Work"];
const GROUP_COLORS = { Friends:"#1e90ff", Family:"#25d366", Work:"#ff9500", Others:"#888" };

function ContactsScreen({ onCall, onMessage }) {
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [search,   setSearch]   = useState("");
  const [group,    setGroup]    = useState("All");
  const [showAdd,  setShowAdd]  = useState(false);
  const [newName,  setNewName]  = useState("");
  const [newNum,   setNewNum]   = useState("");
  const [newGroup, setNewGroup] = useState("Friends");
  const [newPhoto, setNewPhoto] = useState(null);
  const fileRef = useRef();

  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.number.includes(search);
    const matchGroup  = group === "All" ? true : group === "Favourites" ? c.favourite : c.group === group;
    return matchSearch && matchGroup;
  });

  function addContact() {
    if (!newName.trim() || !newNum.trim()) return;
    setContacts(prev => [...prev, {
      id: Date.now(), name: newName.trim().toUpperCase(),
      number: newNum.trim(), favourite: false,
      group: newGroup, photo: newPhoto,
    }]);
    setNewName(""); setNewNum(""); setNewPhoto(null); setShowAdd(false);
  }

  function deleteContact(id) {
    setContacts(prev => prev.filter(c => c.id !== id));
  }

  function toggleFav(id) {
    navigator.vibrate?.(30);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, favourite: !c.favourite } : c));
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNewPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="contacts-screen">
      {/* Search + Add */}
      <div className="contacts-search-row">
        <input className="contacts-search" placeholder="🔍 Search" value={search}
          onChange={e => setSearch(e.target.value)} />
        <button className="contacts-add-btn" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? "✕" : "＋"}
        </button>
      </div>

      {/* Group tabs */}
      <div className="group-tabs">
        {GROUPS.map(g => (
          <button key={g} className={`group-tab ${group === g ? "active" : ""}`}
            onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="contacts-add-form">
          <div className="add-photo-row">
            <div className="add-photo-preview" onClick={() => fileRef.current.click()}>
              {newPhoto
                ? <img src={newPhoto} alt="photo" style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%" }} />
                : <span style={{ fontSize:16 }}>📷</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
              onChange={handlePhotoUpload} />
            <div style={{ display:"flex", flexDirection:"column", gap:3, flex:1 }}>
              <input className="add-input" placeholder="Name" value={newName}
                onChange={e => setNewName(e.target.value)} />
              <input className="add-input" placeholder="Number" value={newNum} type="tel"
                onChange={e => setNewNum(e.target.value)} />
            </div>
          </div>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <select className="add-input" value={newGroup} onChange={e => setNewGroup(e.target.value)}
              style={{ flex:1, background:"#222", color:"white", border:"none" }}>
              {["Friends","Family","Work","Others"].map(g => <option key={g}>{g}</option>)}
            </select>
            <button className="add-save-btn" onClick={addContact}>Save</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="contacts-list">
        {filtered.length === 0 && (
          <div style={{ padding:8, fontSize:7, opacity:0.4, textAlign:"center" }}>No contacts</div>
        )}
        {filtered.map(c => (
          <div key={c.id} className="contact-card">
            <div className="contact-avatar" style={{ background: GROUP_COLORS[c.group] || "#555" }}>
              {c.photo
                ? <img src={c.photo} alt={c.name} style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%" }} />
                : c.name[0]}
            </div>
            <div className="contact-info">
              <div className="contact-name">
                {c.name}
                {c.favourite && <span style={{ marginLeft:3, fontSize:7, color:"#f6c90e" }}>★</span>}
              </div>
              <div className="contact-number">{c.number}</div>
              <div style={{ fontSize:5.5, opacity:0.4, marginTop:1 }}>{c.group}</div>
            </div>
            <div className="contact-actions">
              <button onClick={() => toggleFav(c.id)} style={{ color: c.favourite ? "#f6c90e":"#555" }}>★</button>
              <button onClick={() => onCall(c)}>📞</button>
              <button onClick={() => onMessage(c)}>💬</button>
              <button onClick={() => deleteContact(c.id)} style={{ color:"#e74c3c" }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactsScreen;