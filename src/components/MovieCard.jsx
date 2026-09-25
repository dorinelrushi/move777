"use client";

import { Play, Star, Calendar, Bookmark, Heart } from "lucide-react";
import { IMAGE_BASE_URL } from "@/lib/tmdb";
import { useState } from "react";

export default function MovieCard({ movie, onSelectMovie }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const title = movie.title || movie.name || "Untitled";
  const releaseDate = movie.release_date || movie.first_air_date || "";
  const year = releaseDate ? releaseDate.split("-")[0] : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const isTV = movie.first_air_date || movie.media_type === "tv";
  const mediaType = isTV ? "TV" : "Movie";

  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80";

  return (
    <div
      onClick={() => onSelectMovie(movie)}
      className="group relative bg-[#121622] rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/50 shadow-lg hover:shadow-2xl hover:shadow-red-950/40 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col h-full"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={poster}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
          
          {/* Top Row Bookmark Action */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-red-500 hover:bg-slate-800 transition-all"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          {/* Center Play Button Overlay */}
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-900/80 transform group-hover:scale-110 transition-all duration-300">
              <Play className="w-7 h-7 fill-white ml-1" />
            </div>
          </div>

          {/* Bottom Hover Details */}
          <div className="text-left">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-red-600/90 text-white mb-1">
              Watch Now
            </span>
          </div>
        </div>

        {/* Rating Badge Top Left */}
        {rating && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-400 font-bold text-xs shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{rating}</span>
          </div>
        )}

        {/* Media Type Badge Top Right */}
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-purple-950/80 backdrop-blur-md border border-purple-500/30 text-purple-300 font-semibold text-[11px] uppercase tracking-wider shadow-md">
          {mediaType}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-gradient-to-b from-[#121622] to-[#0d101a]">
        <div>
          <h3 className="font-bold text-sm text-slate-100 group-hover:text-red-400 transition-colors line-clamp-1 mb-1">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-white/5">
          {year && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              {year}
            </span>
          )}
          <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
            Click to watch &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
