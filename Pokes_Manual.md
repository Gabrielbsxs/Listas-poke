# 🔴 POKES — Lista de Tarefas Temática Pokémon

Seja bem-vindo ao **Pokes**, um sistema de gerenciamento de listas de tarefas operacional otimizado para web e mobile, desenvolvido com uma identidade visual moderna inspirada no universo Pokémon, focada nas tonalidades **Vermelho e Preto**, com suporte completo a alternação dinâmica de temas claro e escuro.

Este documento fornece uma descrição técnica e de uso do aplicativo, documentando todas as principais ações implementadas em consonância com as suas exigências.

---

## 📱 Estrutura de Telas do Aplicativo

O aplicativo possui uma arquitetura de visualização dinâmica com fluxo contínuo dividido em três telas principais de alta fidelidade:

### 1. Tela Inicial de Login e Cadastro (E-mail & Senha)
* **Logotipo Dinâmico**: Utiliza a imagem `OIP.webp` centralizada como o brasão principal do portal, exibindo efeito de pulsação e rotação suave ao passar o mouse.
* **Usuário de Teste Pré-Configurado**: Configurado com credenciais padrão seguras para acesso imediato:
  * **E-mail**: `eu@eu.com`
  * **Senha**: `1234`
  * *Botão de Auto-Preenchimento*: Um botão discreto permite preencher essas credenciais com um único toque para acelerar os testes.
* **Cadastro de Novos Treinadores**: Formulário completo integrado ao banco de dados virtual do navegador (`localStorage`) que aceita registro de novos utilizadores com verificação de dados e tratamento de duplicados.

### 2. Painel de Controle de Listas (Dashboard Pokedex)
* **Aparência Baseada em `OIP (1).webp`**: As listas criadas pelo usuário são renderizadas como **Cartas de Pokédex** individuais divididas em duas estéticas visuais:
  * **Versão Normal (Tema Claro/Clássico)**: Bordas nítidas, fundo claro, representando o formato padrão do monstrinho.
  * **Versão Shiny (Tema Dark/Especial)**: Borda dourada neon com brilho cintilante (*sparkle*), partículas sutis e fundo preto escovado, combinando com o ícone especial de estrela reativa.
* **Informações Detalhadas**: Cada carta exibe o número de registro oficial na Pokédex (ex: **Nº: 025**), o nome personalizado escolhido pelo usuário para a lista (ex: "Faculdade"), o nome original do mascote Pokémon selecionado, seu nome fonético japonês (ex: **Pikachu / Fushigidane**) e um indicador de progresso das metas.
* **Criação de Listas (Captura)**: Permite dar nome ao registro, selecionar se o tema da carta será "Normal" ou "Shiny", e selecionar um entre 7 mascotes oficiais disponíveis (Bulbasaur, Charmander, Squirtle, Pikachu, Jigglypuff, Gengar ou Eevee).
* **Remoção de Listas**: Opção ilustrada para "Soltar" a lista de tarefas, que a remove do banco local junto a seus respectivos itens mediante consentimento do usuário.

### 3. Tela de Inspeção de Tarefas (List Detail)
* **Visualização da Pokédex Ativa**: Apresenta no cabeçalho um cartão detalhado do mascote Pokémon com o medidor dinâmico de tarefas de alta qualidade (ex: `3 de 5 Capturas`).
* **Inserção de Novas Metas**: Formulário instantâneo com suporte responsivo para cadastrar novas tarefas no inventário da lista corrente.
* **Interação de Pokébola Dinâmica**: Os seletores de tarefas foram customizados com ilustrações exclusivas em formato de Pokébola:
  * *Pendente*: Círculo vazio cinéreo detalhado.
  * *Concluído (Capturado)*: Transforma-se em uma Pokébola nas cores clássicas vermelha e branca com animação ativa, mudando a cor do item para tom cinza sutil e riscando o texto.
* **Mecanismo de Organização Sequencial**: Duas setas dinâmicas em cada item (Mover para Cima / Mover para Baixo) que atualizam o atributo de ordenação (`order`) de forma imediata na visualização. Funciona perfeitamente e sem atrasos tanto no Desktop (cursor) quanto em celulares (toques múltiplos).
* **Deleção Individual**: Um botão de descarte em formato de lixeira permite excluir tarefas irrelevantes.

---

## 🎨 Design System e Funcionalidades Premium

* **Esquema de Cores**: Composição baseada no preto fosco profundo (`#121214`), grafite estrutural, detalhes contrastantes em cinza-claro e o inconfundível **Vibrante Vermelho Pokébola** (`#EF4444`) para botões críticos e marcas seletivas.
* **Alternador de Temas Inteligente (Discreto com Ícone)**: No canto superior direito, há um botão de ícone minimalista (Sol / Lua) que alterna o tema em todo o site. No tema Dark, a tela assume tons sombrios pretos ricos e vermelhos acesos. No tema Light, a folha de estilos muda para superfícies limpas off-white de alto contraste.
* **Total Responsividade Mobile**: Desenvolvido integralmente por meio do framework Utility-First **Tailwind CSS**. A interface se reorganiza em layouts de coluna única em smartphones com dimensões de toque aumentadas para evitar cliques acidentais.
* **Banco de Dados Local Persistente**: Utiliza barramentos redundantes baseados na API `localStorage`, permitindo que listas de tarefas, novos usuários criados e preferências de cores durem mesmo após o fechamento do navegador.

---

## 🛠️ Detalhamento dos Componentes Criados

1. **`src/types.ts`**: Define as tipas de dados para `User` (usuários), `TodoList` (listas de tarefas com número, nome do monstro e japonês), `TodoItem` (tarefas rastreáveis com prioridade `order`) e `PokemonMascot` (dados estruturais dos mascotes).
2. **`src/pokemonData.ts`**: Biblioteca offline com atributos de design para os monstrinhos mascote oficiais do aplicativo:
   * **Bulbasaur #001** (Mágico de Folha, Fushigidane)
   * **Charmander #004** (Chama de Fogo, Hitokage)
   * **Squirtle #007** (Jato de Água, Zenigame)
   * **Pikachu #025** (Estática Elétrica, Pikachu)
   * **Jigglypuff #039** (Canção Macia, Purin)
   * **Gengar #094** (Sombra Fantasma, Gangar)
   * **Eevee #133** (Adaptação Única, Iibui)
3. **`src/components/PokemonAvatar.tsx`**: Renderizador de alta fidelidade que desenha de maneira puramente vetorial (SVG) os ícones de rosto e detalhes característicos específicos para cada mascote, aplicando variação de cores "Shiny" caso solicitado.
4. **`src/components/LoginScreen.tsx`**: Interface de segurança para portal do treinador, validações completas e helper de preenchimento inteligente auto-fill.
5. **`src/components/ListDashboard.tsx`**: O painel de controle do treinador modelado segundo as colunas "Normal" e "Shiny" inspiradas no arquivo de design `OIP (1).webp`.
6. **`src/components/TaskInspector.tsx`**: Área de imersão de tarefas de listas individuais, contendo adição de metas, reordenação de itens por vetor de prioridade, botões de reordenação e deleção.
7. **`src/App.tsx`**: O nucleador principal do estado da aplicação. Gerencia transições de tela, verifica autenticações no log do navegador, organiza o inversor discreto de cores, e pré-carrega listas e tarefas automáticas quando o treinador padrão (`eu@eu.com`) efetua o login inicial para que o site já inicie populado.
