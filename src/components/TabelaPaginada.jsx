export default function TabelaPaginada({
  colunas,
  dados,
  carregando,
  erro,
  termoBusca,
  aoMudarBusca,
  paginaAtual,
  totalPaginas,
  aoMudarPagina,
  renderizarAcoes,
}) {
  const listaVazia = !carregando && !erro && dados.length === 0;
  const numeroPaginas = Math.max(totalPaginas || 1, 1);

  return (
    <section className="tabela-glass">
      <label className="grupo-formulario">
        <span className="rotulo-padrao">Buscar registros</span>
        <input
          className="entrada-filtro"
          type="search"
          value={termoBusca}
          onChange={(evento) => aoMudarBusca(evento.target.value)}
          placeholder="Digite para buscar..."
        />
      </label>

      {carregando && <p className="texto-vazio">Carregando dados...</p>}
      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro.message || "Falha na API"}
          {erro.status ? ` (status ${erro.status})` : ""}
        </p>
      )}
      {listaVazia && (
        <p className="texto-vazio">
          Nenhum registro encontrado para os filtros aplicados.
        </p>
      )}

      {!carregando && !erro && dados.length > 0 && (
        <div className="tabela-rolagem">
          <table>
            <thead>
              <tr>
                {colunas.map((coluna) => (
                  <th key={coluna.chave}>{coluna.titulo}</th>
                ))}
                {renderizarAcoes && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {dados.map((item, indice) => (
                <tr key={item.id ?? indice}>
                  {colunas.map((coluna) => (
                    <td key={coluna.chave}>
                      {coluna.renderizar
                        ? coluna.renderizar(item)
                        : item[coluna.chave]}
                    </td>
                  ))}
                  {renderizarAcoes && <td>{renderizarAcoes(item)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="paginacao-glass">
        <button
          className="botao-acao-vazado"
          type="button"
          disabled={paginaAtual <= 1}
          onClick={() => aoMudarPagina(paginaAtual - 1)}
        >
          Anterior
        </button>
        <span>
          Página {paginaAtual} de {numeroPaginas}
        </span>
        <button
          className="botao-acao-vazado"
          type="button"
          disabled={paginaAtual >= numeroPaginas}
          onClick={() => aoMudarPagina(paginaAtual + 1)}
        >
          Próxima
        </button>
      </div>
    </section>
  );
}
