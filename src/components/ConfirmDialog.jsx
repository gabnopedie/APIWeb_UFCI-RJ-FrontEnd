export default function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  aoConfirmar,
  aoCancelar,
}) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="modal-fundo" role="presentation">
      <section
        className="modal-glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacao"
      >
        <h2 id="titulo-confirmacao">{titulo}</h2>
        <p>{mensagem}</p>
        <div className="acoes-cartao">
          <button className="botao-acao-vazado" type="button" onClick={aoCancelar}>
            Cancelar
          </button>
          <button className="botao-acao" type="button" onClick={aoConfirmar}>
            Confirmar
          </button>
        </div>
      </section>
    </div>
  );
}
