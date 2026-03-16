function GridScreen({ apps, onOpenApp, unreadCount=0, dragIdx, dragOver, onDragStart, onDragEnter, onDragEnd }) {
  return (
    <div className="grid-screen">
      {apps.map((app, i) => (
        <div
          key={app.name}
          className={`grid-app ${dragOver===i?"drag-over":""} ${dragIdx===i?"dragging":""}`}
          draggable
          onDragStart={()=>onDragStart(i)}
          onDragEnter={()=>onDragEnter(i)}
          onDragEnd={onDragEnd}
          onDragOver={e=>e.preventDefault()}
          onClick={()=>onOpenApp(app.name)}
        >
          <div className="grid-icon" style={{position:"relative"}}>
            {app.icon}
            {app.name==="Message" && unreadCount>0 && (
              <span className="grid-badge">{unreadCount}</span>
            )}
          </div>
          <div className="grid-name">{app.name}</div>
        </div>
      ))}
      <div style={{gridColumn:"1/-1",fontSize:5.5,opacity:.3,textAlign:"center",padding:"4px 0"}}>
        Hold &amp; drag icons to reorder
      </div>
    </div>
  );
}

export default GridScreen;