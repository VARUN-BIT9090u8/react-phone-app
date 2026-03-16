function MessageList({ chats = {}, contactMap = {}, onOpenChat }) {
  if (!chats || Object.keys(chats).length === 0) {
    return (
      <div className="message-list">
        <div className="empty" style={{ padding: 12, fontSize: 8, opacity: 0.6, textAlign: "center" }}>
          No conversations yet
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {Object.keys(chats).map((number) => {
        const messages = chats[number] || [];
        const lastMsg = messages[messages.length - 1];
        const name = contactMap[number] || number;

        return (
          <div
            key={number}
            className="message-row"
            onClick={() => onOpenChat(number)}
          >
            <div className="avatar">{name[0]}</div>

            <div className="msg-info">
              <div className="msg-name">{name}</div>
              <div className="msg-number">{number}</div>
              <div className="msg-preview">
                {lastMsg?.text || "No messages yet"}
              </div>
            </div>

            <div className="msg-time">{lastMsg?.time || ""}</div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
