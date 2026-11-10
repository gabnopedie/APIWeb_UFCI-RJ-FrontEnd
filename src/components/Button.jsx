export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      className="botao-primario botao-completo"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
