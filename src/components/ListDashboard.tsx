/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TodoList, TodoItem, PokemonMascot } from "../types";
import { POKEMON_MASCOTS, getMascotById } from "../pokemonData";
import { PokemonAvatar } from "./PokemonAvatar";
import { Plus, Trash2, ArrowRight, FolderPlus, Sparkles, AlertCircle } from "lucide-react";

interface ListDashboardProps {
  lists: TodoList[];
  items: TodoItem[];
  onCreateList: (name: string, pokemonId: string, type: "Normal" | "Shiny") => void;
  onDeleteList: (id: string) => void;
  onSelectList: (id: string) => void;
  user: { email: string; name: string };
  onLogout: () => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({
  lists,
  items,
  onCreateList,
  onDeleteList,
  onSelectList,
  user,
}) => {
  const [showCreator, setShowCreator] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>("");
  const [selectedMascotId, setSelectedMascotId] = useState<string>("bulbasaur");
  const [listType, setListType] = useState<"Normal" | "Shiny">("Normal");
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [mascotTab, setMascotTab] = useState<"classicos" | "customizados">("classicos");
  const [deletingListId, setDeletingListId] = useState<string | null>(null);

  // Filter tasks belonging to a list and return progress counts
  const getListProgress = (listId: string) => {
    const listItems = items.filter((item) => item.listId === listId);
    const total = listItems.length;
    const completed = listItems.filter((item) => item.completed).length;
    return { total, completed };
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);

    const trimmed = newListName.trim();
    if (!trimmed) {
      setErrorFeedback("Dê um nome para a sua nova lista de tarefas.");
      return;
    }

    if (trimmed.length > 20) {
      setErrorFeedback("O nome da lista deve ter no máximo 20 caracteres.");
      return;
    }

    // Call state modifier
    onCreateList(trimmed, selectedMascotId, listType);

    // Reset values & close creator panel
    setNewListName("");
    setSelectedMascotId("bulbasaur");
    setListType("Normal");
    setShowCreator(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8" id="list-dashboard-container">
      
      {/* Header Panel with Creator Switch */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-poke-black-card border-3 border-zinc-900 dark:border-zinc-800 p-5 rounded-2xl shadow-md">
        <div>
          <span className="text-poke-red dark:text-red-400 font-display text-xs font-bold uppercase tracking-widest block mb-1">
            Painel do Treinador
          </span>
          <h2 className="text-2xl font-bold font-sans text-zinc-800 dark:text-zinc-100">
            Olá, <span className="text-poke-red font-display">{user.name}</span>!
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Você possui <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lists.length}</span> listas capturadas
          </p>
        </div>

        <button
          onClick={() => setShowCreator(!showCreator)}
          className={`px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            showCreator
              ? "bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-950 text-white"
              : "bg-poke-red hover:bg-poke-red-hover text-white shadow-lg poke-glow-btn"
          }`}
          id="toggle-creator-btn"
        >
          {showCreator ? (
            <>Cancelar</>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Capturar Nova Lista</span>
            </>
          )}
        </button>
      </div>

      {/* List Creator Pokédex Panel */}
      {showCreator && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-white dark:bg-poke-black-card border-3 border-poke-red rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden animate-fade-in"
          id="new-list-form"
        >
          {/* Subtle design block */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-poke-red opacity-10 rounded-bl-full pointer-events-none" />

          <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <FolderPlus className="w-5 h-5 text-poke-red" />
            <span>Adicionar Entrada na Pokédex</span>
          </h3>

          {errorFeedback && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* List Name Input */}
              <div>
                <label htmlFor="list-title" className="block text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Nome da Lista (ex: Faculdade, Compras)
                </label>
                <input
                  id="list-title"
                  type="text"
                  placeholder="Ex: Treinos de Halterofilia"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-poke-black rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-poke-red text-zinc-800 dark:text-zinc-100 transition-colors text-sm font-sans"
                  required
                />
              </div>

              {/* Version Type Option (OIP 1 webp styled) */}
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Tema da Carta (Versão)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setListType("Normal")}
                    className={`p-3.5 rounded-xl border-2 font-display text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      listType === "Normal"
                        ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-700 text-zinc-900 dark:text-zinc-100 scale-102 font-extrabold shadow-sm"
                        : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400"
                    }`}
                  >
                    Normal (Claro)
                  </button>
                  <button
                    type="button"
                    onClick={() => setListType("Shiny")}
                    className={`p-3.5 rounded-xl border-2 font-display text-xs font-bold tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      listType === "Shiny"
                        ? "bg-amber-400/10 border-amber-500 text-amber-500 scale-102 font-extrabold shadow-sm"
                        : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Shiny (Sparkle)
                  </button>
                </div>
              </div>
            </div>

            {/* Mascot Grid Selector with Tab Navigation */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                <label className="block text-zinc-650 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  Selecione o Mascote Pokémon
                </label>
                
                {/* Visual tabs to split Clássicos from Customizados */}
                <div className="inline-flex p-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto shrink-0 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setMascotTab("classicos");
                      if (selectedMascotId.match(/\.(webp|png|jpg|jpeg|gif|pnj)$/i)) {
                        setSelectedMascotId("bulbasaur");
                      }
                    }}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      mascotTab === "classicos"
                        ? "bg-white dark:bg-zinc-800 text-poke-red shadow"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    Clássicos (Retro/SVG)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMascotTab("customizados");
                      if (!selectedMascotId.match(/\.(webp|png|jpg|jpeg|gif|pnj)$/i)) {
                        setSelectedMascotId("gengar.webp");
                      }
                    }}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                      mascotTab === "customizados"
                        ? "bg-white dark:bg-zinc-800 text-poke-red shadow"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    Customizados (Aba 2)
                  </button>
                </div>
              </div>

              {/* Grid content filtered by selected tab */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 bg-zinc-50 dark:bg-poke-black p-3 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 max-h-36 overflow-y-auto">
                {POKEMON_MASCOTS.filter((m) => {
                  const isWebpOrPng = m.id.match(/\.(webp|png|jpg|jpeg|gif|pnj)$/i);
                  return mascotTab === "customizados" ? isWebpOrPng : !isWebpOrPng;
                }).map((mascot) => (
                  <button
                    key={mascot.id}
                    type="button"
                    onClick={() => setSelectedMascotId(mascot.id)}
                    className={`aspect-square rounded-xl p-1.5 transition-all flex flex-col items-center justify-center border-2 cursor-pointer ${
                      selectedMascotId === mascot.id
                        ? "bg-white dark:bg-zinc-800 border-poke-red shadow scale-102"
                        : "bg-transparent border-transparent grayscale hover:grayscale-0 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                    title={mascot.name}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <PokemonAvatar pokemonId={mascot.id} isShiny={listType === "Shiny"} size={32} />
                    </div>
                    <span className="text-[9px] font-semibold mt-1 text-zinc-650 dark:text-zinc-400 block truncate w-full text-center leading-none">
                      {mascot.name.replace(" WebP", "").replace(" PNG", "")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
            <button
              type="submit"
              className="px-6 py-3 bg-poke-red hover:bg-poke-red-hover text-white font-display font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
            >
              Capturar
            </button>
          </div>
        </form>
      )}

      {/* Main Grid View simulating OIP (1).webp split-card design */}
      {lists.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-poke-black-card border-3 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8" id="empty-dashboard-state">
          <div className="w-16 h-16 mx-auto bg-zinc-100 dark:bg-poke-black rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4 border border-zinc-200 dark:border-zinc-800">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 font-sans">Nenhuma lista ativa</h3>
          <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
            Todas as listas capturadas serão organizadas aqui. Clique em "Capturar Nova Lista" para dar início às tarefas!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="lists-card-grid">
          {lists.map((list) => {
            const mascot = getMascotById(list.pokemonId);
            const isShiny = list.type === "Shiny";
            const progress = getListProgress(list.id);
            const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

            return (
              <div
                key={list.id}
                role="button"
                onClick={() => onSelectList(list.id)}
                className={`group border-3 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative flex flex-col ${
                  isShiny
                    ? "bg-poke-black-card text-white border-amber-500/80 hover:border-amber-400/100 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                    : "bg-white text-zinc-800 border-zinc-900/100 hover:border-poke-red dark:bg-[#eaeaea] dark:border-zinc-800 dark:text-zinc-900 dark:hover:border-poke-red shadow-md"
                }`}
              >
                {/* Visual Ribbon Header styled normal vs shiny */}
                <div
                  className={`px-4 py-2 text-xs font-display font-black uppercase tracking-wider flex justify-between items-center ${
                    isShiny
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950"
                      : "bg-[#717171] text-white border-b-2 border-zinc-900"
                  }`}
                >
                  <span>{isShiny ? "Shiny Card Version" : "Normal Card Version"}</span>
                  {isShiny && <Sparkles className="w-3.5 h-3.5 animate-bounce" />}
                </div>

                {/* Submersion Content block with absolute background details */}
                <div className="p-5 flex-1 flex flex-col pokemon-card-bg relative">
                  <div className="flex gap-4 items-stretch relative z-10">
                    
                    {/* Visual Mascot Container Box */}
                    <div
                      className={`w-28 h-28 rounded-2xl flex items-center justify-center p-2 border-2 shrink-0 ${
                        isShiny
                          ? "bg-zinc-950/80 border-zinc-800"
                          : "bg-zinc-100/90 border-zinc-900 dark:bg-zinc-200"
                      }`}
                    >
                      <PokemonAvatar pokemonId={list.pokemonId} isShiny={isShiny} size={80} />
                    </div>

                    {/* Text Details Table designed after pokemon specs in OIP (1).webp */}
                    <div className="flex-1 flex flex-col justify-between font-mono text-xs text-left">
                      <div>
                        {/* Number specs */}
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-poke-red tracking-wider mb-1">
                          <span>Nº: {mascot.number}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${isShiny ? 'bg-amber-400/20 text-amber-300' : 'bg-zinc-800 text-white'}`}>
                            {list.pokemonId}
                          </span>
                        </div>
                        {/* Custom Name */}
                        <div className="mb-1 leading-snug">
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold font-sans">Nome:</span>
                          <span className="text-sm font-display font-black text-zinc-900 dark:text-white dark:group-hover:text-poke-red group-hover:text-poke-red uppercase tracking-wider">
                            {list.name}
                          </span>
                        </div>
                        {/* Japanese Name */}
                        <div className="leading-tight">
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-sans">Nome Japonês:</span>
                          <span className="text-zinc-630 dark:text-zinc-300 font-semibold">{mascot.japaneseName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Progression bar */}
                  <div className="mt-5 space-y-1.5 relative z-10">
                    <div className="flex justify-between text-[10px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                      <span>Metas Atendidas</span>
                      <span className="font-mono">{progress.completed} / {progress.total} Pokemons</span>
                    </div>
                    {/* Progress tracking line */}
                    <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-poke-red rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/70 dark:bg-zinc-900/30 flex justify-between items-center relative z-10">
                  {deletingListId === list.id ? (
                    <div className="flex items-center justify-between w-full animate-fade-in" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">Soltar Pokémon?</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteList(list.id);
                            setDeletingListId(null);
                          }}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                        >
                          Sim
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingListId(null);
                          }}
                          className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-650 text-zinc-700 dark:text-zinc-200 rounded-lg text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                        >
                          Não
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingListId(list.id);
                        }}
                        className="p-2 text-zinc-400 hover:text-poke-red hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Soltar Pokémon (Apagar Lista)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <span className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-poke-red dark:text-red-400 uppercase tracking-widest bg-white dark:bg-poke-black px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:bg-poke-red group-hover:text-white group-hover:border-transparent transition-all">
                        <span>Detalhes</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
