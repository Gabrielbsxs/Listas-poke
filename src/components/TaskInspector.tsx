/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TodoList, TodoItem } from "../types";
import { getMascotById, CUSTOM_IMAGE_MAP } from "../pokemonData";
import { PokemonAvatar } from "./PokemonAvatar";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  MinusCircle,
  Edit,
  FolderPlus,
  AlertCircle
} from "lucide-react";
import { POKEMON_MASCOTS } from "../pokemonData";

interface TaskInspectorProps {
  list: TodoList;
  items: TodoItem[];
  onAddItem: (text: string, pokemonIcon?: string, dayOfWeek?: string, daysOfWeek?: string[]) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onReorderItem: (id: string, direction: "up" | "down") => void;
  onUpdateList: (listId: string, name: string, pokemonId: string, type: "Normal" | "Shiny") => void;
  onGoBack: () => void;
}

export const TaskInspector: React.FC<TaskInspectorProps> = ({
  list,
  items,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onReorderItem,
  onUpdateList,
  onGoBack,
}) => {
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string>("machamp.png");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Sempre"]);
  const [selectedTab, setSelectedTab] = useState<"lista" | "agenda">("lista");
  const [filterDay, setFilterDay] = useState<string>("Todos");
  const [quickTaskTexts, setQuickTaskTexts] = useState<Record<string, string>>({});

  // States for list editing
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(list.name);
  const [editMascotId, setEditMascotId] = useState<string>(list.pokemonId);
  const [editType, setEditType] = useState<"Normal" | "Shiny">(list.type);
  const [editMascotTab, setEditMascotTab] = useState<"classicos" | "customizados">(
    list.pokemonId.match(/\.(webp|png|jpg|jpeg|gif|pnj)$/i) ? "customizados" : "classicos"
  );
  const [editError, setEditError] = useState<string | null>(null);

  const mascot = getMascotById(list.pokemonId);
  const isShiny = list.type === "Shiny";

  // Days mapping dictionary
  const DAYS_MAP: Record<string, string> = {
    "Sempre": "Daily / Todo Dia",
    "Seg": "Segunda-feira",
    "Ter": "Terça-feira",
    "Qua": "Quarta-feira",
    "Qui": "Quinta-feira",
    "Sex": "Sexta-feira",
    "Sáb": "Sábado",
    "Dom": "Domingo",
  };

  // Sort tasks by order attribute so manual reordering is honored perfectly
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  // Apply scheduling day filtering to general view
  const filteredItems = sortedItems.filter((item) => {
    if (filterDay === "Todos") return true;
    const itemDays = item.daysOfWeek && item.daysOfWeek.length > 0
      ? item.daysOfWeek
      : [item.dayOfWeek || "Sempre"];
    if (filterDay === "Sempre") {
      return itemDays.includes("Sempre");
    }
    return itemDays.includes(filterDay) || itemDays.includes("Sempre");
  });

  const progressTotal = items.length;
  const progressCompleted = items.filter((i) => i.completed).length;
  const progressPercentage = progressTotal > 0 ? (progressCompleted / progressTotal) * 100 : 0;

  const handleOpenEdit = () => {
    setEditName(list.name);
    setEditMascotId(list.pokemonId);
    setEditType(list.type);
    setEditMascotTab(list.pokemonId.match(/\.(webp|png|jpg|jpeg|gif|pnj)$/i) ? "customizados" : "classicos");
    setEditError(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    const trimmed = editName.trim();
    if (!trimmed) {
      setEditError("Preencha o nome da lista.");
      return;
    }
    if (trimmed.length > 20) {
      setEditError("O nome deve ter até 20 caracteres.");
      return;
    }
    onUpdateList(list.id, trimmed, editMascotId, editType);
    setShowEditModal(false);
  };

  const handleToggleDay = (dayId: string) => {
    if (dayId === "Sempre") {
      setSelectedDays(["Sempre"]);
    } else {
      let nextDays = selectedDays.filter((d) => d !== "Sempre");
      if (nextDays.includes(dayId)) {
        nextDays = nextDays.filter((d) => d !== dayId);
      } else {
        nextDays.push(dayId);
      }
      if (nextDays.length === 0) {
        nextDays = ["Sempre"];
      }
      setSelectedDays(nextDays);
    }
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);

    const trimmed = newTaskText.trim();
    if (!trimmed) {
      setErrorFeedback("Escreva o nome de uma tarefa antes de adicioná-la.");
      return;
    }

    if (trimmed.length > 80) {
      setErrorFeedback("Ufa! Esse nome é grande. Resuma em até 80 caracteres.");
      return;
    }

    // Call callback to inject item with selected icon and day tracking
    onAddItem(trimmed, selectedIcon, selectedDays.join(", "), selectedDays);
    setNewTaskText("");
    setSelectedDays(["Sempre"]);
  };

  const handleQuickAdd = (day: string) => {
    const text = quickTaskTexts[day] || "";
    const trimmed = text.trim();
    if (!trimmed) return;

    onAddItem(trimmed, selectedIcon, day, [day]);
    setQuickTaskTexts((prev) => ({ ...prev, [day]: "" }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-fade-in" id="task-inspector-panel">
      {/* Back navigation Row */}
      <div className="flex justify-between items-center bg-white dark:bg-poke-black-card border-3 border-zinc-900 dark:border-zinc-800 px-4 py-3 rounded-2xl shadow-sm">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 group text-xs font-display font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-poke-red dark:hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
          id="back-to-dashboard-btn"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Painel</span>
        </button>

        <div className="flex items-center gap-2">
          {isShiny ? (
            <span className="px-3 py-1 bg-amber-400/10 border border-amber-500 rounded-full text-amber-500 text-[10px] uppercase tracking-widest font-black inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Shiny Edition</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
              Normal Edition
            </span>
          )}
        </div>
      </div>

      {/* Hero card showing chosen pokemon details */}
      <div
        className={`w-full overflow-hidden border-3 rounded-3xl p-5 md:p-6 transition-all duration-300 relative flex flex-col items-center sm:flex-row gap-6 ${
          isShiny
            ? "bg-poke-black-card text-white border-amber-500 shadow-lg"
            : "bg-white text-zinc-800 border-zinc-900 dark:bg-[#eaeaea] dark:border-zinc-800 dark:text-zinc-900"
        }`}
      >
        {/* Background visual texture */}
        <div className="absolute inset-0 pokemon-card-bg opacity-40 pointer-events-none" />

        {/* Mascot Circle */}
        <div
          className={`w-36 h-36 rounded-2xl flex items-center justify-center p-3 border-2 shrink-0 select-none relative z-10 ${
            isShiny
              ? "bg-zinc-950/80 border-zinc-800"
              : "bg-zinc-50 border-zinc-300 dark:bg-zinc-100"
          }`}
        >
          <PokemonAvatar pokemonId={list.pokemonId} isShiny={isShiny} size={110} />
        </div>

        {/* Informational PokeDex metadata */}
        <div className="flex-1 space-y-4 text-center sm:text-left relative z-10 w-full font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black tracking-widest text-poke-red uppercase mb-1">
                Registro Nº: {mascot.number}
              </div>
              <h1 className="font-display text-2xl md:text-3.5xl font-black uppercase text-zinc-900 dark:text-white leading-tight tracking-wide">
                {list.name}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-sans font-medium text-xs mt-1">
                Mascote Oficial: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{mascot.name}</span> ({mascot.japaneseName})
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleOpenEdit}
              className="self-center sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-95 transition-all text-white text-[10px] font-display font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-md border border-zinc-750 dark:border-zinc-700"
            >
              <Edit className="w-3.5 h-3.5 text-rose-500" />
              <span>Editar Lista</span>
            </button>
          </div>

          {/* Master Goals Tracker Progress */}
          <div className="space-y-1 bg-zinc-50/10 p-3 rounded-2xl border border-zinc-400/20 max-w-md">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <span>Metas Concluídas</span>
              <span className="font-bold">{progressCompleted} / {progressTotal} Capturas ({Math.round(progressPercentage)}%)</span>
            </div>
            <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-poke-red rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks management dashboard split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Add task Panel & Tips */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick item creator */}
          <div className="bg-white dark:bg-poke-black-card border-3 border-zinc-900 dark:border-zinc-800 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Plus className="w-4 h-4 text-poke-red" />
              <span>Adicionar Tarefa</span>
            </h3>

            {errorFeedback && (
              <p className="p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-500 text-xs font-semibold">
                {errorFeedback}
              </p>
            )}

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-zinc-655 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  Nome da Atividade
                </label>
                <input
                  type="text"
                  placeholder="Ex: Treinar Machamp"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-poke-black rounded-xl border-2 border-zinc-250 dark:border-zinc-800 focus:outline-none focus:border-poke-red text-zinc-850 dark:text-zinc-100 transition-colors text-sm font-sans"
                  required
                />
              </div>

              {/* Day of the Week selection (agenda) */}
              <div className="space-y-2">
                <label className="block text-zinc-650 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>Agendar para (Dia):</span>
                  <span className="text-[9px] lowercase font-mono font-medium text-poke-red">Mais de 1 dia permitido!</span>
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: "Sempre", label: "Diário" },
                    { id: "Seg", label: "Seg" },
                    { id: "Ter", label: "Ter" },
                    { id: "Qua", label: "Qua" },
                    { id: "Qui", label: "Qui" },
                    { id: "Sex", label: "Sex" },
                    { id: "Sáb", label: "Sáb" },
                    { id: "Dom", label: "Dom" },
                  ].map((day) => {
                    const isSelected = selectedDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleToggleDay(day.id)}
                        className={`py-1.5 rounded-lg border-2 text-[10px] uppercase font-mono font-bold tracking-tight cursor-pointer transition-all ${
                          isSelected
                            ? "border-poke-red bg-poke-red text-white shadow-sm"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor do Ícone/Mascote da Tarefa - REPLACED WITH REQUESTED IMAGES */}
              <div className="space-y-2">
                <label className="block text-zinc-655 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>Mascote da Atividade:</span>
                  <span className="text-[9px] text-zinc-400 font-mono">8 Opções</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: "machamp.png", name: "Machamp" },
                    { id: "lucario.png", name: "Lucario" },
                    { id: "pangoro.png", name: "Pangoro" },
                    { id: "blaziken.png", name: "Blaziken" },
                    { id: "baixados.png", name: "Mascote 1" },
                    { id: "baixados (1).png", name: "Mascote 2" },
                    { id: "baixados (2).png", name: "Mascote 3" },
                    { id: "baixados (3).png", name: "Mascote 4" }
                  ].map((pk) => (
                    <button
                      key={pk.id}
                      type="button"
                      onClick={() => setSelectedIcon(pk.id)}
                      className={`flex flex-col items-center p-1 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedIcon === pk.id
                          ? "border-poke-red bg-red-500/5 dark:bg-rose-500/10 font-bold scale-102"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-90 w hover:border-zinc-350 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden mb-1 flex items-center justify-center p-0.5">
                        <PokemonAvatar pokemonId={pk.id} isShiny={false} size={28} />
                      </div>
                      <span className="text-[8px] font-sans font-semibold tracking-tight block truncate w-full text-center text-zinc-600 dark:text-zinc-300 leading-none">
                        {pk.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-poke-red hover:bg-poke-red-hover active:scale-95 text-white font-display font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1 bg-gradient-to-r from-poke-red to-rose-600 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar</span>
              </button>
            </form>
          </div>

          {/* Quick manual tips */}
          <div className="bg-zinc-50 dark:bg-poke-black-card/30 border border-zinc-100 dark:border-zinc-900 p-4 rounded-3xl text-xs font-sans text-zinc-500 space-y-3">
            <div className="flex gap-2 items-center font-bold text-zinc-700 dark:text-zinc-300">
              <HelpCircle className="w-4 h-4 text-poke-red mb-0.5" />
              <span>Agenda de Treino</span>
            </div>
            <ul className="list-disc list-inside space-y-2 pl-1 leading-relaxed font-medium">
              <li>
                Alterne entre visualizações de <strong className="text-poke-red">Lista Geral</strong> e <strong className="text-poke-red">Agenda / Calendário Semanal</strong> no painel ao lado.
              </li>
              <li>
                Selecione um dia da semana para agendar e agrupar tarefas de forma eficiente.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Tab switcher for standard list vs. calendar week agenda */}
        <div className="lg:col-span-2 space-y-5">
          {/* Custom Navigation Tab Selector */}
          <div className="flex bg-zinc-200/50 dark:bg-zinc-900/80 p-1 rounded-2xl border border-zinc-300/30 dark:border-zinc-800/80">
            <button
              onClick={() => setSelectedTab("lista")}
              className={`flex-1 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                selectedTab === "lista"
                  ? "bg-white dark:bg-poke-black-card text-poke-red dark:text-red-400 shadow-sm border border-zinc-300/40 dark:border-zinc-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Lista Geral
            </button>
            <button
              onClick={() => setSelectedTab("agenda")}
              className={`flex-1 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                selectedTab === "agenda"
                  ? "bg-white dark:bg-poke-black-card text-poke-red dark:text-red-400 shadow-sm border border-zinc-300/40 dark:border-zinc-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Agenda Semanal / Calendário
            </button>
          </div>

          {selectedTab === "lista" ? (
            <div className="space-y-4">
              {/* Day horizontal timeline filter layout */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {["Todos", "Sempre", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => {
                  const dayCount = items.filter(item => d === "Todos" ? true : (item.dayOfWeek || "Sempre") === d).length;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFilterDay(d)}
                      className={`px-3 py-1.5 rounded-xl font-semibold text-xs tracking-tight transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                        filterDay === d
                          ? "bg-poke-red text-white shadow-sm font-bold scale-102"
                          : "bg-zinc-150/60 dark:bg-zinc-900/40 text-zinc-650 dark:text-zinc-450 hover:bg-zinc-250 dark:hover:bg-zinc-850 border border-zinc-300/35 dark:border-zinc-800/45"
                      }`}
                    >
                      <span>{d === "Todos" ? "Todos" : d === "Sempre" ? "Diário" : d}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                        filterDay === d
                          ? "bg-white/20 text-white"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500"
                      }`}>
                        {dayCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white dark:bg-poke-black-card border-3 border-zinc-900 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm" id="tasks-list-panel">
                {/* Header statistics of the list */}
                <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10">
                  <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#4d4d4d] dark:text-zinc-400">
                    Visão: {filterDay === "Todos" ? "Todos os compromissos" : DAYS_MAP[filterDay] || filterDay} ({filteredItems.length})
                  </h3>
                  
                  <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 px-2 py-1 rounded">
                    Filtro Ativo
                  </span>
                </div>

                {/* In-list element array */}
                {filteredItems.length === 0 ? (
                  <div className="text-center py-16 px-4 space-y-2">
                    <MinusCircle className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
                    <h4 className="font-bold text-zinc-750 dark:text-zinc-400 text-sm font-sans">Nenhuma tarefa neste filtro</h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Não há atividades marcadas para {filterDay === "Todos" ? "este registro" : DAYS_MAP[filterDay]}. Insira metas agendadas no painel lateral.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/85 max-h-[480px] overflow-y-auto" id="tasks-items-container">
                    {filteredItems.map((item, index) => {
                      const itemIcon = item.pokemonIcon || "machamp.png";
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-4 transition-colors ${
                            item.completed
                              ? "bg-emerald-50/10 dark:bg-[#065f46]/5"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-900/20"
                          }`}
                        >
                          {/* Styled PokeAvatar Checkbox */}
                          <button
                            onClick={() => onToggleItem(item.id)}
                            className="focus:outline-none shrink-0 transition-transform active:scale-95 relative cursor-pointer group"
                            title={item.completed ? "Reabrir Tarefa" : "Marcar como Resolvido"}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all duration-300 relative ${
                                item.completed
                                  ? "border-emerald-500 bg-emerald-500/10 scale-102 shadow"
                                  : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-poke-black hover:border-poke-red"
                              }`}
                            >
                              <PokemonAvatar
                                pokemonId={itemIcon}
                                isShiny={false}
                                size={36}
                              />
                              {/* Success checkmark element on top */}
                              {item.completed && (
                                <div className="absolute inset-0 bg-emerald-500/15 flex items-center justify-center">
                                  <div className="bg-emerald-500 text-white rounded-full p-0.5 border border-white shadow-sm scale-85 animate-bounce">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>

                          {/* Task details */}
                          <div className="flex-1 min-w-0" onClick={() => onToggleItem(item.id)}>
                            <span
                              className={`font-sans text-sm font-medium tracking-wide block truncate cursor-pointer select-none transition-all ${
                                item.completed
                                  ? "line-through text-zinc-400 dark:text-zinc-500 font-normal decoration-poke-red decoration-2"
                                  : "text-zinc-800 dark:text-zinc-200 hover:text-poke-red"
                              }`}
                            >
                              {item.text}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] text-zinc-400 font-mono">
                                #{(index + 1).toString().padStart(3, "0")}
                              </span>
                              <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded text-[8px] font-mono uppercase tracking-wider flex items-center gap-1 flex-wrap">
                                {item.daysOfWeek && item.daysOfWeek.length > 0
                                  ? item.daysOfWeek.map(d => d === "Sempre" ? "Diário" : d).join(" + ")
                                  : (item.dayOfWeek === "Sempre" ? "Diário" : item.dayOfWeek || "Diário")}
                              </span>
                            </div>
                          </div>

                          {/* Reordering controllers */}
                          <div className="flex items-center gap-1 shrink-0 bg-zinc-50 dark:bg-poke-black-card border border-zinc-250 dark:border-zinc-800 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => onReorderItem(item.id, "up")}
                              disabled={index === 0}
                              className={`p-1.5 rounded transition-transform active:scale-95 cursor-pointer ${
                                index === 0
                                  ? "text-zinc-300 dark:text-zinc-800 pointer-events-none"
                                  : "text-zinc-500 hover:text-poke-red dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              }`}
                              title="Mover para cima"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onReorderItem(item.id, "down")}
                              disabled={index === filteredItems.length - 1}
                              className={`p-1.5 rounded transition-transform active:scale-95 cursor-pointer ${
                                index === filteredItems.length - 1
                                  ? "text-zinc-300 dark:text-zinc-800 pointer-events-none"
                                  : "text-zinc-500 hover:text-poke-red dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              }`}
                              title="Mover para baixo"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-2 text-zinc-400 hover:text-poke-red hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Deletar tarefa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* BRAND NEW WEEK AGENDA/CALENDAR GRID VIEW */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom", "Sempre"].map((dayId) => {
                  const dayTasks = sortedItems.filter((i) => {
                    const itemDays = i.daysOfWeek && i.daysOfWeek.length > 0
                      ? i.daysOfWeek
                      : [i.dayOfWeek || "Sempre"];
                    if (dayId === "Sempre") {
                      return itemDays.includes("Sempre");
                    }
                    return itemDays.includes(dayId) || itemDays.includes("Sempre");
                  });
                  const isTodayActive = dayId === selectedDays[0];

                  return (
                    <div
                      key={dayId}
                      className={`p-4 bg-white dark:bg-poke-black-card border-3 rounded-2xl flex flex-col justify-between transition-all relative ${
                        isTodayActive
                          ? "border-poke-red shadow-md ring-1 ring-poke-red/20 opacity-100"
                          : "border-zinc-900/10 dark:border-zinc-800/80 opacity-95 hover:opacity-100 hover:border-zinc-400/40"
                      }`}
                    >
                      <div>
                        {/* Day Card Header with Badge */}
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-3">
                          <span className="font-display text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${dayId === "Sempre" ? "bg-amber-400 animate-pulse" : "bg-poke-red"}`} />
                            {DAYS_MAP[dayId]}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-450">
                            {dayTasks.filter(t => t.completed).length}/{dayTasks.length} Done
                          </span>
                        </div>

                        {/* List of Tasks in Day Card */}
                        {dayTasks.length === 0 ? (
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-550 italic py-3 text-center">
                            Nenhum treino agendado
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
                            {dayTasks.map((task) => {
                              const tIcon = task.pokemonIcon || "machamp.png";
                              return (
                                <div
                                  key={task.id}
                                  className={`flex items-center justify-between p-1.5 rounded-lg border text-[11px] font-sans ${
                                    task.completed
                                      ? "bg-emerald-50/10 border-emerald-500/20 text-zinc-400 dark:text-zinc-500"
                                      : "border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {/* Action checkmark to capture directly from Agenda */}
                                    <button
                                      type="button"
                                      onClick={() => onToggleItem(task.id)}
                                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border cursor-pointer ${
                                        task.completed
                                          ? "bg-emerald-500 border-emerald-600 text-white"
                                          : "bg-zinc-50 dark:bg-poke-black border-zinc-200 dark:border-zinc-700"
                                      }`}
                                    >
                                      {task.completed && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </button>

                                    <div className="w-4 h-4 rounded overflow-hidden shrink-0">
                                      <PokemonAvatar
                                        pokemonId={tIcon}
                                        isShiny={false}
                                        size={16}
                                      />
                                    </div>

                                    <span className={`truncate ${task.completed ? "line-through" : ""}`}>
                                      {task.text}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => onDeleteItem(task.id)}
                                    className="p-1 text-zinc-400 hover:text-poke-red rounded transition-colors cursor-pointer shrink-0"
                                    title="Excluir"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Day Inline Quick Creator Form */}
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Nova tarefa..."
                          value={quickTaskTexts[dayId] || ""}
                          onChange={(e) =>
                            setQuickTaskTexts((prev) => ({ ...prev, [dayId]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleQuickAdd(dayId);
                          }}
                          className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-poke-black rounded-lg border border-zinc-250 dark:border-zinc-800 focus:outline-none text-[11px] font-sans text-zinc-800 dark:text-zinc-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(dayId)}
                          className="px-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-poke-red dark:hover:bg-red-650 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                          title="Agendar Atividade"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* EDIT MODAL FOR EXISTING LIST */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden animate-scale-up">
            <h2 className="font-display text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b-2 border-zinc-100 dark:border-zinc-905">
              <Sparkles className="w-5 h-5 text-poke-red animate-pulse" />
              <span>Editar Detalhes da Pokédex</span>
            </h2>

            {editError && (
              <div className="mb-4 p-2.5 bg-red-50 dark:bg-rose-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-500 text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* List Name Input */}
              <div className="space-y-1.5">
                <label className="block text-zinc-650 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                  Nome da Lista / Desafio:
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-805 focus:outline-none focus:border-poke-red text-zinc-850 dark:text-zinc-100 font-sans text-sm font-medium"
                  required
                />
              </div>

              {/* Theme Theme Selector */}
              <div className="space-y-1.5">
                <label className="block text-zinc-650 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                  Tonalidade / Variante:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditType("Normal")}
                    className={`py-2 px-3 rounded-xl border-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                      editType === "Normal"
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    Normal (Clássico)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType("Shiny")}
                    className={`py-2 px-3 rounded-xl border-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all inline-flex items-center justify-center gap-1.5 ${
                      editType === "Shiny"
                        ? "border-amber-400 bg-amber-400 text-zinc-950 font-black shadow-md scale-102"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Shiny Spec</span>
                  </button>
                </div>
              </div>

              {/* Choice Choice */}
              <div className="space-y-1.5">
                <label className="block text-zinc-650 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                  Escolher Mascote Oficial:
                </label>
                <div className="flex bg-zinc-100 dark:bg-zinc-900/60 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 mb-3">
                  <button
                    type="button"
                    onClick={() => setEditMascotTab("classicos")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-all ${
                      editMascotTab === "classicos"
                        ? "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white shadow-xs"
                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    Clássicos
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMascotTab("customizados")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-all ${
                      editMascotTab === "customizados"
                        ? "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white shadow-xs"
                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    Customizados (Aba 2)
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 bg-zinc-50 dark:bg-zinc-900/20 p-2.5 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl max-h-36 overflow-y-auto">
                  {POKEMON_MASCOTS.filter((m) => {
                    const isWebpOrPng = m.id.match(/\.(webp|png|jpg|jpeg|gif|pnj)$/i);
                    return editMascotTab === "customizados" ? isWebpOrPng : !isWebpOrPng;
                  }).map((itemMascot) => (
                    <button
                      key={itemMascot.id}
                      type="button"
                      onClick={() => setEditMascotId(itemMascot.id)}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                        editMascotId === itemMascot.id
                          ? "border-poke-red bg-red-500/5 dark:bg-amber-400/5 font-bold scale-102"
                          : "border-transparent bg-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                      }`}
                    >
                      <PokemonAvatar pokemonId={itemMascot.id} isShiny={editType === "Shiny"} size={44} />
                      <span className="text-[7.5px] font-sans font-bold text-center block mt-1 truncate w-full text-zinc-650 dark:text-zinc-350">
                        {itemMascot.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 font-display font-medium text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-zinc-900 text-white dark:bg-poke-red hover:bg-zinc-800 hover:scale-102 active:scale-95 transition-all text-xs font-display font-black uppercase tracking-widest rounded-xl cursor-pointer shadow-md bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-poke-red dark:to-rose-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
