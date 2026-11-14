import Input from "./Input";
import {
  OPCOES_FORMA_PAGAMENTO,
  OPCOES_STATUS_PAGAMENTO,
} from "../constants/opcoes";

export default function FiltroPagamento({ filtros, atualizarFiltro }) {
  return (
    <section
      className="area-filtros-glass filtros-pagamentos"
      aria-label="Filtros de pagamentos"
    >
      <select
        className="entrada-filtro"
        aria-label="Filtrar por status"
        value={filtros.status}
        onChange={(evento) => atualizarFiltro("status", evento.target.value)}
      >
        <option value="">Todos os status</option>
        {OPCOES_STATUS_PAGAMENTO.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      <select
        className="entrada-filtro"
        aria-label="Filtrar por forma de pagamento"
        value={filtros.forma_pagamento}
        onChange={(evento) =>
          atualizarFiltro("forma_pagamento", evento.target.value)
        }
      >
        <option value="">Todas as formas</option>
        {OPCOES_FORMA_PAGAMENTO.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      <Input
        label="Data inicial"
        type="date"
        value={filtros.startDate}
        onChange={(evento) => atualizarFiltro("startDate", evento.target.value)}
      />
      <Input
        label="Data final"
        type="date"
        value={filtros.endDate}
        onChange={(evento) => atualizarFiltro("endDate", evento.target.value)}
      />
    </section>
  );
}
