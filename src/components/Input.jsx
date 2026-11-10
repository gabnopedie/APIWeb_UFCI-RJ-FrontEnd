export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div className="grupo-formulario">
      {label && <label className="rotulo-padrao">{label}</label>}
      <input
        className="input-padrao"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
