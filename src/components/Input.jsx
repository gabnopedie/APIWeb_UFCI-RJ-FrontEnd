import { useId } from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
  step,
}) {
  const generatedId = useId();

  return (
    <div className="grupo-formulario">
      {label && (
        <label className="rotulo-padrao" htmlFor={generatedId}>
          {label}
        </label>
      )}
      <input
        className="input-padrao"
        id={generatedId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
