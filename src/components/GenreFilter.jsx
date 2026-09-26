"use client";

import { Sparkles } from "lucide-react";

export default function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
        <button
          onClick={() => onSelectGenre(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
            !selectedGenre
              ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/60"
              : "bg-[#151a26] text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
          }`}
        >
          All Genres
        </button>

        {genres.map((genre) => {
          const isSelected = selectedGenre?.id === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => onSelectGenre(genre)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/60 font-bold"
                  : "bg-[#151a26] text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
