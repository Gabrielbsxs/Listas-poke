/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { getMascotById, CUSTOM_IMAGE_MAP } from "../pokemonData";

interface PokemonAvatarProps {
  pokemonId: string;
  isShiny: boolean;
  size?: number;
}

export const PokemonAvatar: React.FC<PokemonAvatarProps> = ({
  pokemonId,
  isShiny,
  size = 120,
}) => {
  const [hasError, setHasError] = useState(false);

  if (pokemonId.match(/\.(webp|png|jpg|jpeg|gif|pnj)$/i)) {
    const imgSrc = CUSTOM_IMAGE_MAP[pokemonId] || pokemonId;

    if (hasError) {
      // Create a beautiful custom placeholder badge so that it NEVER looks transparent!
      const displayName = pokemonId
        .replace(".png", "")
        .replace(".webp", "")
        .replace(/\s*\(\d+\)\s*/g, "") // remove (1) etc
        .toUpperCase();

      return (
        <div
          style={{ width: size, height: size }}
          className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${
            isShiny ? "from-amber-500 to-yellow-600 text-zinc-950" : "from-poke-red to-rose-600 text-white"
          } border-2 border-zinc-900 rounded-2xl font-display font-black shadow-md select-none p-1 overflow-hidden pointer-events-none`}
        >
          {/* Subtle decorative circles to mimic a Pokeball/scanner */}
          <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white/20" />
          <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-white/10" />
          
          <span className="text-[10px] font-bold tracking-wider leading-tight text-center truncate max-w-full">
            {displayName.substring(0, 8)}
          </span>
          <span className={`text-[7px] font-mono mt-0.5 tracking-widest ${isShiny ? "text-amber-950/70" : "text-white/70"}`}>
            {isShiny ? "SHINY" : "CUSTOM"}
          </span>
        </div>
      );
    }

    return (
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center transition-all duration-300 pointer-events-none rounded-2xl overflow-hidden p-0.5"
      >
        <img
          src={imgSrc}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          alt={pokemonId}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    );
  }

  const mascot = getMascotById(pokemonId);
  const color = isShiny ? mascot.shinyImage : mascot.normalImage;

  // Render a beautifully crafted vector icon for each mascot representation
  const renderSVGDetails = () => {
    switch (pokemonId) {
      case "bulbasaur":
        return (
          <>
            {/* Bulbasaur's Bulb */}
            <path
              d="M30 65 C 20 45, 35 20, 50 25 C 65 20, 80 45, 70 65 C 80 85, 20 85, 30 65 Z"
              fill={isShiny ? "#A2C343" : "#4E9E7A"}
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Eyes */}
            <ellipse cx="38" cy="55" rx="4" ry="6" fill="#EF4444" />
            <ellipse cx="62" cy="55" rx="4" ry="6" fill="#EF4444" />
            <ellipse cx="37" cy="54" rx="1.5" ry="3" fill="#FFF" />
            <ellipse cx="61" cy="54" rx="1.5" ry="3" fill="#FFF" />
            {/* Cheeks and Mouth */}
            <path
              d="M45 68 Q 50 72 55 68"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Spots */}
            <rect x="25" y="58" width="5" height="5" rx="1" fill="#115E59" opacity="0.3" />
            <rect x="68" y="58" width="6" height="4" rx="1" fill="#115E59" opacity="0.3" />
          </>
        );

      case "charmander":
        return (
          <>
            {/* Charmander outline & tail flame */}
            <circle cx="50" cy="50" r="38" fill={color} opacity="0.15" />
            {/* Head and body simplified */}
            <path
              d="M50 20 C 35 20, 30 35, 32 50 C 35 65, 45 80, 50 80 C 55 80, 65 65, 68 50 C 70 35, 65 20, 50 20 Z"
              fill={color}
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Flame */}
            <path
              d="M60 70 C 65 60, 75 55, 80 65 C 85 75, 75 85, 60 85 C 55 80, 58 75, 60 70 Z"
              fill="#F97316"
              stroke="#EF4444"
              strokeWidth="1.5"
            />
            <path
              d="M62 72 C 65 65, 72 63, 75 68 C 78 73, 72 78, 62 78 Z"
              fill="#FBBF24"
            />
            {/* Eyes */}
            <ellipse cx="43" cy="42" rx="4" ry="6" fill="#1E3A8A" />
            <ellipse cx="57" cy="42" rx="4" ry="6" fill="#1E3A8A" />
            <ellipse cx="42" cy="40" rx="1.5" ry="3" fill="#FFF" />
            <ellipse cx="56" cy="40" rx="1.5" ry="3" fill="#FFF" />
            {/* Smiling Mouth */}
            <path
              d="M44 54 Q 50 60 56 54"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );

      case "squirtle":
        return (
          <>
            {/* Shell circle */}
            <circle cx="50" cy="50" r="36" fill={color} stroke="currentColor" strokeWidth="2.5" />
            {/* Shell details (geometric) */}
            <path
              d="M30 30 L 70 30 M30 70 L 70 70 M20 50 L 80 50 M 50 14 L 50 86"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            {/* Cute Squirtle Eyes */}
            <ellipse cx="36" cy="46" rx="4" ry="6" fill="#7C2D12" />
            <ellipse cx="64" cy="46" rx="4" ry="6" fill="#7C2D12" />
            <circle cx="35" cy="43" r="1.5" fill="#FFF" />
            <circle cx="63" cy="43" r="1.5" fill="#FFF" />
            {/* Round cheeks */}
            <circle cx="28" cy="55" r="3" fill="#FDA4AF" opacity="0.6" />
            <circle cx="72" cy="55" r="3" fill="#FDA4AF" opacity="0.6" />
            {/* Smile */}
            <path
              d="M44 56 Q 50 62 56 56"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );

      case "pikachu":
        return (
          <>
            {/* Pointy Pikachu body */}
            <rect x="22" y="30" width="56" height="50" rx="20" fill={color} stroke="currentColor" strokeWidth="2.5" />
            {/* Ears */}
            <path
              d="M 24 35 L 12 5 C 10 0, 18 0, 28 25 Z"
              fill={color}
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M 76 35 L 88 5 C 90 0, 82 0, 72 25 Z"
              fill={color}
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Ear Tips (Black) */}
            <path d="M 12 5 L 19 12 L 21 8 Z" fill="#121214" />
            <path d="M 88 5 L 81 12 L 79 8 Z" fill="#121214" />
            {/* Red Cheeks */}
            <circle cx="32" cy="62" r="6" fill="#EF4444" />
            <circle cx="68" cy="62" r="6" fill="#EF4444" />
            {/* Eyes */}
            <circle cx="38" cy="46" r="4.5" fill="#121214" />
            <circle cx="62" cy="46" r="4.5" fill="#121214" />
            <circle cx="37" cy="44" r="1.5" fill="#FFF" />
            <circle cx="61" cy="44" r="1.5" fill="#FFF" />
            {/* W-smile */}
            <path
              d="M 44 52 Q 47 55 50 52 Q 53 55 56 52"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );

      case "jigglypuff":
        return (
          <>
            {/* Pink balloon outline */}
            <circle cx="50" cy="50" r="36" fill={color} stroke="currentColor" strokeWidth="2.5" />
            {/* Big green eyes */}
            <circle cx="32" cy="46" r="8" fill="#0D9488" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="68" cy="46" r="8" fill="#0D9488" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="30" cy="42" r="3" fill="#FFF" />
            <circle cx="66" cy="42" r="3" fill="#FFF" />
            {/* Little ears */}
            <polygon points="20,20 12,2 35,16" fill={color} stroke="currentColor" strokeWidth="2" />
            <polygon points="80,20 88,2 65,16" fill={color} stroke="currentColor" strokeWidth="2" />
            {/* Mouth */}
            <path
              d="M 47 58 Q 50 63 53 58"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Curl on forehead */}
            <path
              d="M 43 20 Q 52 14 53 24 Q 48 26 43 20"
              fill={color}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </>
        );

      case "gengar":
        return (
          <>
            {/* Gengar shadow shield */}
            <circle cx="50" cy="50" r="36" fill={color} stroke="currentColor" strokeWidth="2.5" />
            {/* Gengar Spikes */}
            <path
              d="M 18,30 L 10,18 L 30,24 M 82,30 L 90,18 L 70,24 M 50,14 L 50,2 M 34,16 L 30,5 M 66,16 L 70,5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            {/* Red Glowing Eyes (Menacing) */}
            <path
              d="M 28,45 Q 36,44 38,40 Q 32,41 28,45 Z"
              fill="#EF4444"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M 72,45 Q 64,44 62,40 Q 68,41 72,45 Z"
              fill="#EF4444"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Menacing smile showing teeth */}
            <path
              d="M 30,58 Q 50,75 70,58"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 34,60 C 44,65 56,65 66,60"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </>
        );

      case "eevee":
        return (
          <>
            {/* Eevee ears */}
            <path
              d="M 30,28 L 10,2 L 26,20 Z"
              fill={color}
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M 70,28 L 90,2 L 74,20 Z"
              fill={color}
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Main Head */}
            <circle cx="50" cy="52" r="30" fill={color} stroke="currentColor" strokeWidth="2.5" />
            {/* Fluffy collar neck */}
            <path
              d="M 25,75 Q 50,85 75,75 Q 85,62 70,68 C 65,58 55,62 50,56 C 45,62 35,58 30,68 Q 15,62 25,75 Z"
              fill="#FDE047"
              opacity={isShiny ? 0.9 : 0.6}
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Soft big eyes */}
            <ellipse cx="40" cy="46" rx="4" ry="6" fill="#7C2D12" />
            <ellipse cx="60" cy="46" rx="4" ry="6" fill="#7C2D12" />
            <circle cx="39" cy="43" r="1.2" fill="#FFF" />
            <circle cx="59" cy="43" r="1.2" fill="#FFF" />
            {/* Small nose and soft smile */}
            <polygon points="49,52 51,52 50,53" fill="currentColor" />
            <path
              d="M 46,56 Q 50,59 54,56"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );

      default:
        return (
          // Default beautiful Pokeball vector drawing!
          <>
            {/* Pokeball Red Top */}
            <path
              d="M14 50 A 36 36 0 0 1 86 50 Z"
              fill="#EF4444"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            {/* Pokeball White Bottom */}
            <path
              d="M14 50 A 36 36 0 0 0 86 50 Z"
              fill="#F4F4F5"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            {/* Middle Line */}
            <line x1="14" y1="50" x2="86" y2="50" stroke="currentColor" strokeWidth="3.5" />
            {/* Center Outer Button */}
            <circle cx="50" cy="50" r="12" fill="#FFFFFF" stroke="currentColor" strokeWidth="3.5" />
            {/* Center Inner Button */}
            <circle cx="50" cy="50" r="6" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" />
          </>
        );
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center transition-all duration-300 pointer-events-none"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-zinc-800 dark:text-zinc-200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderSVGDetails()}
      </svg>
    </div>
  );
};
