import Input from "./Input";
import { OPCOES_STATUS_ALUGUEL } from "../constants/opcoes";

export default function FiltroAluguel({ filtros, atualizarFiltro }) {
  return (
    <section
      className="area-filtros-glass filtros-alugueis"
      aria-label="Filtros de contratos"
    >
      <select
        className="entrada-filtro"
        aria-label="Filtrar por status"
        value={filtros.status}
        onChange={(evento) => atualizarFiltro("status", evento.target.value)}
      >
        <option value="">Todos os status</option>
        {OPCOES_STATUS_ALUGUEL.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      <Input
        type="number"
        placeholder="ID do cliente"
        value={filtros.id_usuario}
        onChange={(evento) => atualizarFiltro("id_usuario", evento.target.value)}
      />
      <Input
        type="number"
        placeholder="ID do jogo"
        value={filtros.id_jogo}
        onChange={(evento) => atualizarFiltro("id_jogo", evento.target.value)}
      />
    </section>
  );
}
