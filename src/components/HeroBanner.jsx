"use client";

import { Play, Info, Star, Flame, Calendar, Sparkles } from "lucide-react";
import { BACKDROP_BASE_URL } from "@/lib/tmdb";

export default function HeroBanner({ movie, onSelectMovie }) {
  if (!movie) return null;

  const title = movie.title || movie.name || "Featured Title";
  const backdrop = movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80";

  const releaseDate = movie.release_date || movie.first_air_date || "";
  const year = releaseDate ? releaseDate.split("-")[0] : "2025";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "8.5";
  const mediaType = movie.media_type === "tv" ? "TV Series" : "Movie";

  return (
    <div className="relative w-full h-[75vh] min-h-[550px] max-h-[750px] overflow-hidden rounded-3xl mb-10 shadow-2xl border border-white/10 group">
      {/* Backdrop Image */}
      <img
        src={backdrop}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
      />

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/80 to-transparent w-full md:w-3/4" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 max-w-4xl z-10">
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-950/60 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-white" />
            #1 Trending
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 font-semibold text-xs">
            {mediaType}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {rating} / 10
          </span>
          {year && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-300 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {year}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
          {title}
        </h1>

        {/* Overview */}
        <p className="text-slate-300 text-sm sm:text-base line-clamp-3 max-w-2xl mb-8 leading-relaxed drop-shadow">
          {movie.overview || "Stream this amazing movie and enjoy full high-definition video playback with rich surround sound."}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => onSelectMovie(movie)}
            className="flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-base shadow-xl shadow-red-900/40 hover:scale-105 hover:shadow-red-600/50 transition-all duration-300 group/btn cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <span>Watch Now</span>
          </button>

          <button
            onClick={() => onSelectMovie(movie)}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-semibold text-base transition-all duration-300 cursor-pointer"
          >
            <Info className="w-5 h-5 text-slate-300" />
            <span>More Info</span>
          </button>
        </div>

      </div>
    </div>
  );
}
