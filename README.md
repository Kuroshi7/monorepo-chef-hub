# Chef-Hub

Chef-Hub é um sistema de gerenciamento para restaurantes, projetado para simplificar a administração de produtos, pedidos e mesas. A interface de frontend é construída com Next.js e Tailwind CSS, oferecendo uma experiência de usuário moderna e responsiva.

## Funcionalidades Implementadas

A aplicação atualmente conta com um módulo de gerenciamento de produtos com as funcionalidades:

*   **Autenticação de Rota:** A página de protegidas via JWT.
*   **Listagem de Produtos:** Exibe todos os produtos cadastrados.
*   **Criação de Produtos:** Formulário para adicionar novos produtos, com validação.
*   **Edição de Produtos:** Edição dos dados de um produto cadastrado.
*   **Exclusão de Produtos:** Remover um produto do sistema.
*   **Busca:** Campo de busca para filtrar produtos pelo nome dinamicamente.

## Estrutura do Projeto

O projeto está organizado com frontend e backend separados.

```
backend/
├── src/
|   |── entities/          # Entidades do banco
│   ├── modules/            # Módulos da aplicação
│   │   ├── auth/          # Autenticação
│   │   ├── users/         # Usuários
│   │   ├── products/      # Produtos
│   │   └── orders/        # Pedidos
│   

frontend/
├── src/
│   ├── app/                    # Páginas da aplicação
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── produtos/         # Gestão de produtos
│   │   ├── pedidos/         # Gestão de pedidos
│   │   └── novo-pedido/     # Criação de pedidos
│   ├── components/          # Componentes reutilizáveis
│   └── layout/             # Componentes de layout


```

## Como Rodar o Projeto

### Pré-requisitos

*   Node.js (v18 ou superior)
*   npm ou yarn

### 1. Backend

O backend precisa estar em execução para que o frontend possa consumir a API, por default na porta 3001, 
verificar se outras aplicacoes estao utilizando essa porta, alterar o (listen) no backend se necessario e as rotas no front.

```bash
# 1. Na raiz do projeto ir até a pasta do backend
cd backend

# 2. Instalar as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run start:dev
```

### 2. Frontend
Por default esta na porta 3000, assim como o backend verificar e ajustar conforme necessario

```bash
# 1. Em outro terminal, navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará acessível em `http://localhost:3000`.

## Decisões Técnicas

*   **Frontend Framework:** **Next.js (App Router)** escolhido por sua performance, renderização no servidor (SSR/SSG).
*   **UI e Estilização:** **Tailwind CSS** para desenvolvimento da interface. Componentes reutilizáveis, como `Button`, seguindo as melhores práticas do **shadcn/ui**.
*   **Gerenciamento de Formulários:** A combinação de **React Hook Form** e **Zod** solução robusta e eficiente para gerenciamento de formulários e validação de schemas. Garante maior segurança de tipos.
*   **Gerenciamento de Estado:** Para a complexidade atual da página de produtos, o uso de hooks nativos do React (`useState`, `useEffect`) é suficiente e mantém o código simples. Para funcionalidades mais complexas avaliar uma outra biblioteca.
*   **Autenticação:** JWT (JSON Web Token)  com armazenado no `localStorage` do navegador.
*   **Token Blacklist:** Black list de token para logout
  
## Considerações de Performance (N+1)

O problema N+1 é uma preocupação comum em aplicações que lidam com dados relacionais. Ele ocorre quando uma consulta inicial busca uma lista de itens (consulta "1") e são feitas "N" consultas para buscar dados relacionados para cada um dos itens.

**Exemplo no Contexto do Chef-Hub:**
Imagine uma tela que lista todos os **Pedidos**. Cada pedido contém "many" **Produtos**.

*   **Abordagem Ineficiente (N+1):**
    1.  `GET /orders` -> Busca todos os pedidos.
    2.  Para cada pedido retornado, fazer um `GET /products/:id` para cada produto dentro do pedido.
    Isso resultaria em um número excessivo de chamadas de API.

*   **Solução (Backend):**
    A solução deve ser implementada no backend. Ao desenvolver o endpoint que retorna os pedidos, deve-se usar a funcionalidade de "populate" ou "JOIN" para incluir os dados relacionados em uma única consulta ao banco de dados.

    O frontend faz apenas uma chamada (`GET /orders`) e recebe todos os dados.

## Testes

O projeto inclui testes, utilizando **Jest**.

Para rodar os testes, execute o seguinte comando na pasta `backend`:

```bash
npm run test:e2e
```

## Melhorias Identificadas e Próximos Passos

*   **Adicionar Múltiplos Itens a um Pedido:** Refatorar o DTO de Pedidos para suportar a adição de mais de 1 item do mesmo produto.
*   **Gerenciamento de Estado Global:** Para funcionalidades como o carrinho de pedidos.
*   **Otimização de API com SWR/React Query:** Substituir o `fetch` padrão por uma biblioteca de data fetching como SWR ou React Query para obter cache automático.
*   **Componentização:** Refatorar a lógica de edição em linha para um componente separado para tornar a página de produtos mais limpa e reutilizável.
*   **WebSockets:** Para a tela de acompanhamento de pedidos na cozinha, WebSockets para atualizações, novos pedidos apareçem instantaneamente sem a precisar recarregar a página (polling).
