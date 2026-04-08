function AlertMessage({ type = "success", message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        ...containerStyle,
        ...(type === "success" ? successStyle : errorStyle)
      }}
    >
      <span>{message}</span>

      {onClose && (
        <button onClick={onClose} style={closeButtonStyle}>
          ×
        </button>
      )}
    </div>
  );
}

const containerStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px"
};

const successStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  border: "1px solid #86efac"
};

const errorStyle = {
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  border: "1px solid #fca5a5"
};

const closeButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "18px",
  lineHeight: 1
};

export default AlertMessage;