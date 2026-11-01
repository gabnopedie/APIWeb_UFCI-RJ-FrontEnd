# 🎲 Sistema de Aluguel de Jogos de Tabuleiro (Front-End)

Interface WeB desenvolvida em **Next.js** para o projeto da P2 da disciplina de **Programação WeB** da UFCI/RJ. O sistema gerencia o acervo, contratos de locação, controle financeiro de pagamentos e autenticação de usuários de uma locadora de jogos de tabuleiro.

---

## 🚀 O que já foi desenvolvido (Até o momento)

* **Autenticação (`/login`):** Tela de acesso, validação de e-mail/senha, tratamento de erros de credenciais e armazenamento  do token JWT no `localStorage`.

* **Módulo de Aluguéis:** Listagem de contratos de locação, visualização de status ativos/pendentes e interface para formalização de novos aluguéis.

* **Módulo de Pagamentos:** Painel financeiro para acompanhar transações, registrar quitações e verificar o status de pagamentos vinculados aos aluguéis.

* **Padronização Visual:** Interface construída com identidade visual (tons de dourado, off-white e preto clássico), utilizando componentes limpos e tipografia refinada (`Playfair Display` + fontes do sistema), tentando  simular um tabuleiro de xadrez.

---

## 🚧 O que ainda falta fazer:

* [ ] **Módulo de Categorias:** Telas de listagem, cadastro e vínculo de categorias aos jogos de tabuleiro.

* [ ] **Módulo de Usuários:** Gestão de perfis de clientes (edição de dados, visualização de histórico individual).

* [ ] **Módulo de Reviews:** Interface para os usuários deixarem notas e comentários sobre os jogos alugados.

---

## 🛠️ Tecnologias Utilizadas

* **Next.js** (App Router)
* **React** (Hooks e manipulação de estado local)
* **CSS Modules / Estilização Nativa**
* **Fetch API** (Comunicação assíncrona com o backend NestJS)

---

## ⚙️ Como Rodar o Projeto Localmente

Certifique-se de que o **Backend (NestJS)** já está clonado na última versão da `main` e rodando na sua máquina (na porta `3000`).

1. Clone este repositório do front-end e entre na pasta:
   git clone https://github.com/gabnopedie/APIWeb_UFCI-RJ-FrontEnd.git
   
   cd APIWeb_UFCI-RJ-FrontEnd

2. Instale as dependências do projeto:
    `npm install`

3. Inicie o servidor de desenvolvimento:
    `npm run dev`

4. Abra o navegador e acesse o endereço indicado no terminal: http://localhost:3001. O BackEnd roda na 3000!
