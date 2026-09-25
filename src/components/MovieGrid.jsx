"use client";

import MovieCard from "./MovieCard";
import { Film, AlertCircle, Sparkles } from "lucide-react";

export default function MovieGrid({ title, subtitle, movies, isLoading, onSelectMovie, onLoadMore, hasMore }) {
  return (
    <section className="mb-12">
      {/* Section Header */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-white/10 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span className="w-2 h-7 rounded-full bg-gradient-to-b from-red-500 to-purple-600 inline-block" />
              {title}
            </h2>
            {subtitle && <p className="text-slate-400 text-sm mt-1 ml-4">{subtitle}</p>}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {movies?.length ? `${movies.length} titles showing` : ""}
          </div>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {isLoading && (!movies || movies.length === 0) ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-[#121622] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
              <div className="aspect-[2/3] bg-slate-800/60" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                <div className="h-3 bg-slate-800/50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : movies && movies.length > 0 ? (
        <>
          {/* Movie Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${index}`}
                movie={movie}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && onLoadMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={onLoadMore}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-red-600 hover:text-white text-slate-200 font-bold text-sm border border-white/10 transition-all duration-300 shadow-xl disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading More...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Load More Movies
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-[#121622]/50 rounded-3xl border border-white/5">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No movies found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Try adjusting your search criteria or select another genre category.
          </p>
        </div>
      )}
    </section>
  );
}
