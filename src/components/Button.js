export default function Button({ children, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: '#ffffff',
        color: '#111111',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        letterSpacing: '0.5px',
        fontWeight: '600',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        width: '100%',
        opacity: disabled ? 0.7 : 1
      }}
    >
      {children}
    </button>
  );
}