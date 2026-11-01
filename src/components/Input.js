export default function Input({ label, type = 'text', value, onChange, placeholder, required = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && (
        <label style={{ 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
          fontSize: '13px', 
          letterSpacing: '0.5px', 
          color: '#d1d1d1', 
          fontWeight: '500' 
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{ 
          padding: '14px', 
          borderRadius: '8px', 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          backgroundColor: 'rgba(0, 0, 0, 0.4)', 
          color: '#ffffff', 
          fontSize: '15px', 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}