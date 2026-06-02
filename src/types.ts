/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TodoItem {
  id: string;
  listId: string;
  text: string;
  completed: boolean;
  order: number; // Used for re-ordering or sorting lists
  createdAt: string;
  pokemonIcon?: string; // Icon image like 'gengar.webp', 'charizardx.webp', 'charizard.webp'
  dayOfWeek?: string; // Scheduled day of the week for Agenda (e.g., "Seg", "Ter", "Qua", etc.)
  daysOfWeek?: string[]; // Multiple scheduled days of the week for Agenda
}

export interface TodoList {
  id: string;
  userId: string;
  name: string; // Custom name given by the user (e.g. "Trabalho")
  pokemonId: string; // Mascot identifier (e.g., "bulbasaur", "charmander", "squirtle", "pikachu", "eevee", "gengar")
  pokemonName: string; // Mascot name
  japaneseName: string; // Mascot Japanese name (e.g., "Fushigidane")
  number: string; // Mascot PokeDex Number (e.g., "001")
  type: "Normal" | "Shiny"; // The version style of the PokeDex Card as seen in OIP (1).webp
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
  password?: string;
}

export interface PokemonMascot {
  id: string;
  name: string;
  japaneseName: string;
  number: string;
  normalImage: string; // Placeholder or generated SVG path
  shinyImage: string;  // Placeholder or generated SVG path
  primaryColor: string; // Tailwind class color
}
