/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PokemonMascot } from "./types";
import gengarImg from "./assets/images/gengar_custom_1780062275844.png";
import venusaurImg from "./assets/images/venusaur_custom_1780062297352.png";
import charizardFlyingImg from "./assets/images/charizard_flying_1780062314903.png";
import charizardXImg from "./assets/images/charizard_x_1780062333769.png";
import charizardStdImg from "./assets/images/charizard_std_1780062352366.png";
import machampImg from "./assets/images/machamp_avatar_1780062751085.png";
import lucarioImg from "./assets/images/lucario_avatar_1780062775139.png";
import pangoroImg from "./assets/images/pangoro_avatar_1780062793697.png";
import blazikenImg from "./assets/images/blaziken_avatar_1780062811933.png";
import baixadosImg from "./assets/images/baixados.png";
import baixados1Img from "./assets/images/baixados (1).png";
import baixados2Img from "./assets/images/baixados (2).png";
import baixados3Img from "./assets/images/baixados (3).png";

export const CUSTOM_IMAGE_MAP: Record<string, string> = {
  "gengar.webp": gengarImg,
  "gengar.png": gengarImg,
  "venusaur.webp": venusaurImg,
  "charizardx.webp": charizardXImg,
  "charizard.webp": charizardStdImg,
  "charizard_flying.png": charizardFlyingImg,
  "machamp.png": machampImg,
  "lucario.png": lucarioImg,
  "pangoro.png": pangoroImg,
  "blaziken.png": blazikenImg,
  "baixados.png": baixadosImg,
  "baixados (1).png": baixados1Img,
  "baixados (2).png": baixados2Img,
  "baixados (3).png": baixados3Img,
};

export const POKEMON_MASCOTS: PokemonMascot[] = [
  {
    id: "bulbasaur",
    name: "Bulbasaur",
    japaneseName: "Fushigidane",
    number: "001",
    normalImage: "#3EBF9C", // Teal/Green
    shinyImage: "#A1E053",  // Lime Yellow
    primaryColor: "from-teal-400 to-emerald-600",
  },
  {
    id: "charmander",
    name: "Charmander",
    japaneseName: "Hitokage",
    number: "004",
    normalImage: "#FF7C33", // Orange
    shinyImage: "#FFCC33",  // Gold
    primaryColor: "from-orange-400 to-red-500",
  },
  {
    id: "squirtle",
    name: "Squirtle",
    japaneseName: "Zenigame",
    number: "007",
    normalImage: "#5DB9FF", // Aqua Blue
    shinyImage: "#3CDCB3",  // Teal Light
    primaryColor: "from-blue-400 to-indigo-500",
  },
  {
    id: "pikachu",
    name: "Pikachu",
    japaneseName: "Pikachu",
    number: "025",
    normalImage: "#FFDE1E", // Electric Yellow
    shinyImage: "#FFAA1D",  // Warm Orange
    primaryColor: "from-yellow-300 to-amber-500",
  },
  {
    id: "jigglypuff",
    name: "Jigglypuff",
    japaneseName: "Purin",
    number: "039",
    normalImage: "#FFA3D1", // Candy Pink
    shinyImage: "#EAB6FF",  // Lavender
    primaryColor: "from-pink-300 to-purple-400",
  },
  {
    id: "gengar",
    name: "Gengar",
    japaneseName: "Gangar",
    number: "094",
    normalImage: "#6C2273", // Purple
    shinyImage: "#4E5D94",  // Dark Slate Gray-Blue
    primaryColor: "from-purple-600 to-slate-800",
  },
  {
    id: "eevee",
    name: "Eevee",
    japaneseName: "Iibui",
    number: "133",
    normalImage: "#B37D4E", // Soft Brown
    shinyImage: "#EAD0B3",  // Beige/Silver
    primaryColor: "from-amber-600 to-orange-800",
  },
  {
    id: "gengar.png",
    name: "Gengar",
    japaneseName: "Gangar Custom",
    number: "094",
    normalImage: "gengar.png",
    shinyImage: "gengar.png",
    primaryColor: "from-purple-600 to-indigo-950",
  },
  {
    id: "venusaur.webp",
    name: "Venusaur",
    japaneseName: "Fushigibana Custom",
    number: "003",
    normalImage: "venusaur.webp",
    shinyImage: "venusaur.webp",
    primaryColor: "from-teal-600 to-emerald-800",
  },
  {
    id: "charizard_flying.png",
    name: "Charizard Aero",
    japaneseName: "Rizaadon Sky",
    number: "006",
    normalImage: "charizard_flying.png",
    shinyImage: "charizard_flying.png",
    primaryColor: "from-amber-500 to-orange-700",
  },
  {
    id: "charizardx.webp",
    name: "Charizard X",
    japaneseName: "Rizaadon X",
    number: "006",
    normalImage: "charizardx.webp",
    shinyImage: "charizardx.webp",
    primaryColor: "from-slate-705 to-zinc-900",
  },
  {
    id: "charizard.webp",
    name: "Charizard Standard",
    japaneseName: "Rizaadon Retro",
    number: "006",
    normalImage: "charizard.webp",
    shinyImage: "charizard.webp",
    primaryColor: "from-orange-500 to-red-600",
  },
  {
    id: "machamp.png",
    name: "Machamp",
    japaneseName: "Kairiky Custom",
    number: "068",
    normalImage: "machamp.png",
    shinyImage: "machamp.png",
    primaryColor: "from-slate-400 to-zinc-650",
  },
  {
    id: "lucario.png",
    name: "Lucario",
    japaneseName: "Rukario Custom",
    number: "448",
    normalImage: "lucario.png",
    shinyImage: "lucario.png",
    primaryColor: "from-blue-500 to-slate-900",
  },
  {
    id: "pangoro.png",
    name: "Pangoro",
    japaneseName: "Goronda Custom",
    number: "675",
    normalImage: "pangoro.png",
    shinyImage: "pangoro.png",
    primaryColor: "from-zinc-700 to-black",
  },
  {
    id: "blaziken.png",
    name: "Blaziken",
    japaneseName: "Bashamo Custom",
    number: "257",
    normalImage: "blaziken.png",
    shinyImage: "blaziken.png",
    primaryColor: "from-red-500 to-yellow-600",
  },
  {
    id: "baixados.png",
    name: "Mascote 1",
    japaneseName: "Mascote Baixado 1",
    number: "991",
    normalImage: "baixados.png",
    shinyImage: "baixados.png",
    primaryColor: "from-indigo-600 to-pink-700",
  },
  {
    id: "baixados (1).png",
    name: "Mascote 2",
    japaneseName: "Mascote Baixado 2",
    number: "992",
    normalImage: "baixados (1).png",
    shinyImage: "baixados (1).png",
    primaryColor: "from-teal-600 to-blue-800",
  },
  {
    id: "baixados (2).png",
    name: "Mascote 3",
    japaneseName: "Mascote Baixado 3",
    number: "993",
    normalImage: "baixados (2).png",
    shinyImage: "baixados (2).png",
    primaryColor: "from-orange-600 to-red-800",
  },
  {
    id: "baixados (3).png",
    name: "Mascote 4",
    japaneseName: "Mascote Baixado 4",
    number: "994",
    normalImage: "baixados (3).png",
    shinyImage: "baixados (3).png",
    primaryColor: "from-purple-600 to-fuchsia-800",
  }
];

export function getMascotById(id: string): PokemonMascot {
  return POKEMON_MASCOTS.find((p) => p.id === id) || POKEMON_MASCOTS[0];
}
