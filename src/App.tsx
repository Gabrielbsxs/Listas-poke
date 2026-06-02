/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { User, TodoList, TodoItem } from "./types";
import { LoginScreen } from "./components/LoginScreen";
import { ListDashboard } from "./components/ListDashboard";
import { TaskInspector } from "./components/TaskInspector";
import { POKEMON_MASCOTS } from "./pokemonData";
import { Sun, Moon, LogOut, ShieldAlert } from "lucide-react";
import pokesLogo from "./assets/images/pokes_logo_1780062027808.png";

export default function App() {
  // --- GERENCIAMENTO DE ESTADOS GLOBAIS ---
  
  // Estado de tela principal: 'login' | 'dashboard' | 'inspector'
  const [currentScreen, setCurrentScreen] = useState<"login" | "dashboard" | "inspector">("login");
  
  // Usuário autenticado ativo
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Lista de todas as listas de tarefas criadas
  const [lists, setLists] = useState<TodoList[]>([]);
  
  // Lista de todos os itens de tarefas criados
  const [items, setItems] = useState<TodoItem[]>([]);
  
  // Identificador da lista atualmente selecionada para inspeção
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  
  // Modo visual de cores: 'dark' (padrão devido ao Vermelho/Preto) ou 'light'
  const [theme, setTheme] = useState<string>("dark");

  // --- CARREGAMENTO INICIAL E SINCRONIZAÇÃO COM LOCALSTORAGE ---

  useEffect(() => {
    // 1. Inicializa o Tema Visual (Escuro por padrão pelas cores de destaque Vermelho/Preto)
    const storedTheme = localStorage.getItem("pokes_app_theme") || "dark";
    setTheme(storedTheme);
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 2. Tenta recuperar sessão de login persistida no localStorage ou realizar entrada automática
    const savedUser = localStorage.getItem("pokes_session_user");
    const autoLoginEnabled = localStorage.getItem("pokes_remember_me") === "true";
    const savedEmail = localStorage.getItem("pokes_saved_email");
    const savedName = localStorage.getItem("pokes_saved_name") || "Treinador";

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setCurrentScreen("dashboard");
      
      // Carrega os dados específicos para esse usuário autenticado
      loadUserData(parsedUser.email);
    } else if (autoLoginEnabled && savedEmail) {
      const autoUser = { email: savedEmail, name: savedName };
      setCurrentUser(autoUser);
      setCurrentScreen("dashboard");
      
      // Carrega os dados específicos para esse usuário autenticado
      loadUserData(savedEmail);
    }
  }, []);

  // Função auxiliar para carregar listas e itens de um usuário no localstorage
  const loadUserData = (email: string) => {
    const normEmail = email.toLowerCase();
    
    // Recupera listas salvos para este usuário
    const storedLists = localStorage.getItem(`pokes_lists_${normEmail}`);
    const storedItems = localStorage.getItem(`pokes_todos_${normEmail}`);

    if (storedLists && storedItems) {
      setLists(JSON.parse(storedLists));
      setItems(JSON.parse(storedItems));
    } else {
      // Se não houver dados, e for o usuário de teste, injeta dados pré-definidos interessantes
      if (normEmail === "eu@eu.com") {
        injectTestAccountData();
      } else {
        // Para novos usuários limpos
        setLists([]);
        setItems([]);
      }
    }
  };

  // Injetor de dados realísticos e de alta fidelidade para demonstrar as colunas Normal e Shiny
  const injectTestAccountData = () => {
    const listEmail = "eu@eu.com";
    
    const defaultLists: TodoList[] = [
      {
        id: "test-list-1",
        userId: listEmail,
        name: "Capturas Diárias",
        pokemonId: "pikachu",
        pokemonName: "Pikachu",
        japaneseName: "Pikachu",
        number: "025",
        type: "Normal", // Tema claro
        createdAt: new Date().toISOString(),
      },
      {
        id: "test-list-2",
        userId: listEmail,
        name: "Metas de Desenvolvimento",
        pokemonId: "bulbasaur",
        pokemonName: "Bulbasaur",
        japaneseName: "Fushigidane",
        number: "001",
        type: "Shiny", // Tema escuro e cintilante
        createdAt: new Date().toISOString(),
      },
      {
        id: "test-[#test-3]",
        userId: listEmail,
        name: "Lista de Compras",
        pokemonId: "jigglypuff",
        pokemonName: "Jigglypuff",
        japaneseName: "Purin",
        number: "039",
        type: "Normal", // Tema claro
        createdAt: new Date().toISOString(),
      },
    ];

    const defaultItems: TodoItem[] = [
      {
        id: "item-1a",
        listId: "test-list-1",
        text: "Organizar Pokédex Regional",
        completed: true,
        order: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "item-1b",
        listId: "test-list-1",
        text: "Passar no Ginásio de Pewter (Líder Brock)",
        completed: true,
        order: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "item-1c",
        listId: "test-list-1",
        text: "Estudar técnicas de Choque do Trovão",
        completed: false,
        order: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: "item-2a",
        listId: "test-list-2",
        text: "Entregar relatórios semanais da Equipe Rocket",
        completed: false,
        order: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "item-2b",
        listId: "test-list-2",
        text: "Limpar o laboratório do Professor Carvalho",
        completed: true,
        order: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "item-3a",
        listId: "test-[#test-3]",
        text: "Hiper Poção de Cura (Hyper Potion)",
        completed: true,
        order: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "item-3b",
        listId: "test-[#test-3]",
        text: "5x Ultra Balls no PokéMart",
        completed: false,
        order: 2,
        createdAt: new Date().toISOString(),
      }
    ];

    setLists(defaultLists);
    setItems(defaultItems);

    localStorage.setItem(`pokes_lists_${listEmail}`, JSON.stringify(defaultLists));
    localStorage.setItem(`pokes_todos_${listEmail}`, JSON.stringify(defaultItems));
  };

  // --- ACTIONS & OPERAÇÕES DE PERSISTÊNCIA ---

  // Trata Login com sucesso
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen("dashboard");
    localStorage.setItem("pokes_session_user", JSON.stringify(user));
    loadUserData(user.email);
  };

  // Trata Desconexão (Logout)
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen("login");
    setSelectedListId(null);
    setLists([]);
    setItems([]);
    localStorage.removeItem("pokes_session_user");
  };

  // Criação de uma Nova Lista (Salva no localStorage específico)
  const handleCreateList = (name: string, pokemonId: string, type: "Normal" | "Shiny") => {
    if (!currentUser) return;
    const emailKey = currentUser.email.toLowerCase();

    // Cria as propriedades do Pokémon Mascote correspondente
    const selectedMascot = POKEMON_MASCOTS.find((p) => p.id === pokemonId) || POKEMON_MASCOTS[0];

    const newList: TodoList = {
      id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: emailKey,
      name,
      pokemonId,
      pokemonName: selectedMascot.name,
      japaneseName: selectedMascot.japaneseName,
      number: selectedMascot.number,
      type,
      createdAt: new Date().toISOString(),
    };

    const updatedLists = [newList, ...lists];
    setLists(updatedLists);
    localStorage.setItem(`pokes_lists_${emailKey}`, JSON.stringify(updatedLists));
  };

  // Deleta uma Lista e todos os seus Itens agregados
  const handleDeleteList = (listId: string) => {
    if (!currentUser) return;
    const emailKey = currentUser.email.toLowerCase();

    // Filtra as listas removendo a escolhida
    const updatedLists = lists.filter((l) => l.id !== listId);
    setLists(updatedLists);
    localStorage.setItem(`pokes_lists_${emailKey}`, JSON.stringify(updatedLists));

    // Remove também as tarefas vinculadas àquela lista
    const updatedItems = items.filter((item) => item.listId !== listId);
    setItems(updatedItems);
    localStorage.setItem(`pokes_todos_${emailKey}`, JSON.stringify(updatedItems));

    if (selectedListId === listId) {
      setSelectedListId(null);
      setCurrentScreen("dashboard");
    }
  };

  // Atualização de uma Lista existente (Editar nome, mascote, tipo)
  const handleUpdateList = (listId: string, name: string, pokemonId: string, type: "Normal" | "Shiny") => {
    if (!currentUser) return;
    const emailKey = currentUser.email.toLowerCase();

    const selectedMascot = POKEMON_MASCOTS.find((p) => p.id === pokemonId) || POKEMON_MASCOTS[0];

    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          name,
          pokemonId,
          pokemonName: selectedMascot.name,
          japaneseName: selectedMascot.japaneseName,
          number: selectedMascot.number,
          type,
        };
      }
      return list;
    });

    setLists(updatedLists);
    localStorage.setItem(`pokes_lists_${emailKey}`, JSON.stringify(updatedLists));
  };

  // Cria um Novo Item de Tarefa dentro de uma Lista
  const handleAddTask = (text: string, pokemonIcon?: string, dayOfWeek?: string, daysOfWeek?: string[]) => {
    if (!currentUser || !selectedListId) return;
    const emailKey = currentUser.email.toLowerCase();

    // Obtém o maior atributo 'order' atual de itens nesta mesma lista
    const listItems = items.filter((i) => i.listId === selectedListId);
    const maxOrder = listItems.reduce((max, item) => (item.order > max ? item.order : max), 0);

    const newItem: TodoItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      listId: selectedListId,
      text,
      completed: false,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      pokemonIcon,
      dayOfWeek,
      daysOfWeek,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem(`pokes_todos_${emailKey}`, JSON.stringify(updatedItems));
  };

  // Alterna o status Concluído / Pendente de uma tarefa (Captura)
  const handleToggleTask = (itemId: string) => {
    if (!currentUser) return;
    const emailKey = currentUser.email.toLowerCase();

    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem(`pokes_todos_${emailKey}`, JSON.stringify(updatedItems));
  };

  // Deleta um item específico de tarefa da lista
  const handleDeleteTask = (itemId: string) => {
    if (!currentUser) return;
    const emailKey = currentUser.email.toLowerCase();

    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    localStorage.setItem(`pokes_todos_${emailKey}`, JSON.stringify(updatedItems));
  };

  // REORDENAÇÃO MANUAL DE TAREFAS (Organização)
  // Troca a prioridade de exibição aumentando/reduzindo o valor de 'order'
  const handleReorderTask = (itemId: string, direction: "up" | "down") => {
    if (!currentUser || !selectedListId) return;
    const emailKey = currentUser.email.toLowerCase();

    // Filtra apenas os itens da lista corrente
    const listItems = items.filter((i) => i.listId === selectedListId);
    const sortedListItems = [...listItems].sort((a, b) => a.order - b.order);

    // Encontra o index do elemento que foi acionado
    const targetIndex = sortedListItems.findIndex((i) => i.id === itemId);
    if (targetIndex === -1) return;

    let swapIndex = -1;
    if (direction === "up" && targetIndex > 0) {
      swapIndex = targetIndex - 1;
    } else if (direction === "down" && targetIndex < sortedListItems.length - 1) {
      swapIndex = targetIndex + 1;
    }

    if (swapIndex !== -1) {
      // Troca os atributos 'order' entre os dois itens
      const targetItem = sortedListItems[targetIndex];
      const swapItem = sortedListItems[swapIndex];
      
      const tempOrder = targetItem.order;
      targetItem.order = swapItem.order;
      swapItem.order = tempOrder;

      // Re-injeta esses itens modificados na lista global
      const updatedGlobalItems = items.map((item) => {
        if (item.id === targetItem.id) return { ...item, order: targetItem.order };
        if (item.id === swapItem.id) return { ...item, order: swapItem.order };
        return item;
      });

      setItems(updatedGlobalItems);
      localStorage.setItem(`pokes_todos_${emailKey}`, JSON.stringify(updatedGlobalItems));
    }
  };

  // Alternador de Temas (Claro / Escuro)
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("pokes_app_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // --- SELETOR DINÂMICO DE COMPONENTES DE TELA ---

  const renderActiveWidget = () => {
    switch (currentScreen) {
      case "dashboard":
        return currentUser ? (
          <ListDashboard
            lists={lists}
            items={items}
            onCreateList={handleCreateList}
            onDeleteList={handleDeleteList}
            onSelectList={(id) => {
              setSelectedListId(id);
              setCurrentScreen("inspector");
            }}
            user={currentUser}
            onLogout={handleLogout}
          />
        ) : null;

      case "inspector":
        // Localiza a lista ativa atual que o usuário clicou para inspecionar
        const activeList = lists.find((l) => l.id === selectedListId);
        const activeListTodos = items.filter((i) => i.listId === selectedListId);

        return activeList && currentUser ? (
          <TaskInspector
            list={activeList}
            items={activeListTodos}
            onAddItem={handleAddTask}
            onToggleItem={handleToggleTask}
            onDeleteItem={handleDeleteTask}
            onReorderItem={handleReorderTask}
            onUpdateList={handleUpdateList}
            onGoBack={() => {
              setSelectedListId(null);
              setCurrentScreen("dashboard");
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
            <ShieldAlert className="w-12 h-12 mb-3" />
            <p className="font-heading font-bold">Falha ao rastrear a lista pretendida.</p>
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="mt-4 px-4 py-2 bg-poke-red text-white rounded-lg font-bold"
            >
              Ir ao Painel
            </button>
          </div>
        );

      case "login":
      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-poke-black text-zinc-800 dark:text-zinc-100 transition-colors duration-300 font-sans flex flex-col justify-between relative overflow-hidden">
      
      {/* Luz de fundo do Pokemons Hub (Aparência cênica e estilizada) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-poke-red opacity-10 dark:opacity-5 blur-[120px] rounded-full pointer-events-none" />

      {/* --- CABEÇALHO GLOBAL DO APLICATIVIVO --- */}
      <header className="w-full max-w-5xl mx-auto py-5 px-4 flex justify-between items-center relative z-20">
        <div 
          onClick={() => currentUser && setCurrentScreen("dashboard")}
          className={`flex items-center gap-3 cursor-pointer select-none transition-transform active:scale-95 ${currentUser ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          {/* Circular vector logo badge or standard user logo */}
          <div className="w-10 h-10 rounded-xl bg-poke-red p-1 flex items-center justify-center shadow-lg border border-zinc-900/10 dark:border-zinc-800">
            <img
              src={pokesLogo}
              referrerPolicy="no-referrer"
              alt="Logo Pokes"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <span translate="no" className="notranslate font-display text-lg font-black tracking-widest text-zinc-900 dark:text-white uppercase">
            Poké<span className="text-poke-red">Tarefas</span>
          </span>
        </div>

        {/* Global Control bar containing the theme switch and disconnect links */}
        <div className="flex items-center gap-2">
          {/* Botão DISCRETO com apenas Ícone para alternância de Modo Dark / Light */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-poke-black-card hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-500 dark:text-amber-400 hover:text-poke-red dark:hover:text-amber-300 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-poke-red shadow-sm"
            title={theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            id="theme-toggle-btn"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
          </button>

          {/* Logout controls */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white dark:bg-poke-black-card hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 dark:text-zinc-400 hover:text-poke-red border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer focus:outline-none shadow-sm"
              title="Desconectar do Aplicativo"
              id="logout-btn"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </header>

      {/* --- CONTEÚDO DINÂMICO PRINCIPAL --- */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-6 px-4 flex items-center justify-center relative z-10">
        {renderActiveWidget()}
      </main>

      {/* --- RODAPÉ GLOBAL DO PORTAL --- */}
      <footer className="w-full max-w-5xl mx-auto py-6 px-4 text-center border-t border-zinc-200/50 dark:border-zinc-900/50 text-[10px] font-mono tracking-wider text-zinc-400 dark:text-zinc-500 relative z-20">
        <p translate="no" className="notranslate">&copy; {new Date().getFullYear()} POKÉTAREFAS INC. CAPTURA DE TAREFAS OPERACIONAL</p>
      </footer>
    </div>
  );
}
