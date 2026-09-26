"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { X, Play, Star, Calendar, Clock, Film, Tv, Layers, ShieldAlert, ArrowLeft } from "lucide-react";
import { BACKDROP_BASE_URL, IMAGE_BASE_URL } from "@/lib/tmdb";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MoviePage({ params, searchParams }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  const id = unwrappedParams.id;
  const mediaType = unwrappedSearchParams.type === "tv" ? "tv" : "movie";

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeServer, setActiveServer] = useState("embed2"); // 'embed2', 'trailer'
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const isTV = mediaType === "tv";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/details/${mediaType}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
      })
      .catch((err) => console.error("Error loading details:", err))
      .finally(() => setLoading(false));
  }, [id, mediaType]);

  const title = details?.title || details?.name || "Loading...";
  const tmdbId = id;
  const imdbId = details?.imdb_id;

  const youtubeTrailerKey = details?.videos?.results?.find(
    (v) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
  )?.key || details?.videos?.results?.[0]?.key;

  const getEmbedUrl = () => {
    if (!tmdbId) return null;

    switch (activeServer) {
      case "embed2":
        return mediaType === "movie"
          ? `https://www.2embed.cc/embed/${tmdbId}`
          : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;

      case "trailer":
        return youtubeTrailerKey
          ? `https://www.youtube.com/embed/${youtubeTrailerKey}?autoplay=1&rel=0`
          : null;

      default:
        return mediaType === "movie"
          ? `https://www.2embed.cc/embed/${tmdbId}`
          : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;
    }
  };

  const embedUrl = getEmbedUrl();
  const backdrop = details?.backdrop_path ? `${BACKDROP_BASE_URL}${details.backdrop_path}` : null;
  const releaseYear = (details?.release_date || details?.first_air_date || "").split("-")[0];
  const rating = details?.vote_average ? details.vote_average.toFixed(1) : null;
  const totalSeasons = details?.number_of_seasons || 1;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>

        <div className="relative w-full bg-[#0b0f19] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e1322]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold text-white truncate max-w-md sm:max-w-xl">
                {title}
              </h2>
              <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200">
                TMDB ID: {tmdbId}
              </span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {embedUrl ? (
                <iframe
                  key={`${embedUrl}-${season}-${episode}`}
                  src={embedUrl}
                  title={title}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="origin"
                  className="w-full h-full border-0"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-cover bg-center relative"
                  style={{ backgroundImage: backdrop ? `url(${backdrop})` : "none" }}
                >
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                  <div className="relative z-10 space-y-3">
                    <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
                    <p className="text-slate-200 font-semibold">
                      Player stream loading or unavailable. Switch server below:
                    </p>
                    <button
                      onClick={() => setActiveServer("embed2")}
                      className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Reload Player
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#121726] p-3 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Switch Player Server:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveServer("embed2")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeServer === "embed2"
                      ? "bg-emerald-600 text-white shadow-md font-bold"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  🎬 2Embed
                </button>
                {/* Trailer button always available now, with a fallback logic */}
                <button
                  onClick={() => setActiveServer("trailer")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeServer === "trailer"
                      ? "bg-amber-600 text-white shadow-md font-bold"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  🎞️ Trailer
                </button>
              </div>
            </div>

            {isTV && (
              <div className="bg-[#121726] p-4 rounded-2xl border border-white/5 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Episode Selector:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-medium">Season:</label>
                  <select
                    value={season}
                    onChange={(e) => {
                      setSeason(Number(e.target.value));
                      setEpisode(1);
                    }}
                    className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s}>
                        Season {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-medium">Episode:</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={episode}
                    onChange={(e) => setEpisode(Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 outline-none focus:border-purple-500 text-center"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {rating && (
                    <span className="flex items-center gap-1 text-amber-400 font-bold text-sm bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-amber-400" />
                      {rating} / 10
                    </span>
                  )}
                  {releaseYear && (
                    <span className="text-slate-300 text-xs bg-white/10 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {releaseYear}
                    </span>
                  )}
                  {details?.runtime && (
                    <span className="text-slate-300 text-xs bg-white/10 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {details.runtime} min
                    </span>
                  )}
                  <span className="text-purple-300 text-xs bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                    {mediaType}
                  </span>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {details?.overview || "No overview available for this title."}
                </p>

                {details?.genres && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-semibold text-slate-400">Genres:</span>
                    {details.genres.map((g) => (
                      <span
                        key={g.id}
                        className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-slate-200"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 bg-[#121726]/60 p-4 rounded-2xl border border-white/5">
                {details?.credits?.cast && details.credits.cast.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Top Cast
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {details.credits.cast.slice(0, 5).map((actor) => (
                        <span
                          key={actor.id}
                          className="text-xs bg-white/5 text-slate-300 px-2.5 py-1 rounded-md"
                        >
                          {actor.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {details?.similar?.results && details.similar.results.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      More Like This
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {details.similar.results.slice(0, 3).map((sim) => {
                        const simPoster = sim.poster_path
                          ? `${IMAGE_BASE_URL}${sim.poster_path}`
                          : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&q=80";
                        return (
                          <div
                            key={sim.id}
                            onClick={() => {
                              const isTv = sim.first_air_date || sim.media_type === "tv";
                              router.push(`/movie/${sim.id}?type=${isTv ? 'tv' : 'movie'}`);
                            }}
                            className="group cursor-pointer rounded-xl overflow-hidden relative aspect-[2/3] bg-slate-900 border border-white/5 hover:border-red-500 transition-all"
                          >
                            <img
                              src={simPoster}
                              alt={sim.title || sim.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
