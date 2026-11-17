export default function StatusBadge({ status, tipo = "" }) {
  const statusTexto = String(status || "PENDENTE");
  return (
    <span
      className="badge-status"
      data-status={statusTexto.toUpperCase()}
      data-tipo={tipo}
    >
      {statusTexto.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}
