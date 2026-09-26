"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Film, Tv, Compass, Home, X, Sparkles, ChevronDown, Play, Star, Menu } from "lucide-react";
import { IMAGE_BASE_URL } from "@/lib/tmdb";
import Image from "next/image";
export default function Header({
  activeTab,
  setActiveTab,
  selectedGenre,
  setSelectedGenre,
  genres,
  searchQuery,
  setSearchQuery,
  onSelectMovie,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickResults, setQuickResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef(null);

  // Handle header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch quick search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setQuickResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/movies?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setQuickResults(data.results ? data.results.slice(0, 6) : []);
      } catch (err) {
        console.error("Quick search error:", err);
      } finally {
        setIsSearching(false);
        setShowSearchResults(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "movies", label: "Movies", icon: Film },
    { id: "tv", label: "TV Series", icon: Tv },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setSelectedGenre(null);
    setShowGenreMenu(false);
    setMobileMenuOpen(false);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setActiveTab("genre");
    setShowGenreMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-header shadow-2xl py-3" : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">
        <div className="flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex cursor-pointer group flex-shrink-0"
          >
            <div>
              <Image src="/Logo.svg" alt="logo" width={200} height={100} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !selectedGenre;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/50"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Genre Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowGenreMenu(!showGenreMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedGenre || activeTab === "genre"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Compass className="w-4 h-4" />
                {selectedGenre ? selectedGenre.name : "Genre"}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showGenreMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Genre Popup Dropdown */}
              {showGenreMenu && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={() => {
                      setSelectedGenre(null);
                      setActiveTab("movies");
                      setShowGenreMenu(false);
                    }}
                    className="col-span-2 text-left px-3 py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-red-600 hover:text-white transition-colors text-slate-300"
                  >
                    All Genres
                  </button>
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleGenreSelect(g)}
                      className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors truncate ${selectedGenre?.id === g.id
                        ? "bg-purple-600 text-white font-bold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar Container */}
          <div ref={searchContainerRef} className="relative hidden md:block flex-1 max-w-sm">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (quickResults.length > 0) setShowSearchResults(true);
                }}
                className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-white text-sm rounded-full pl-10 pr-10 py-2.5 transition-all outline-none placeholder:text-slate-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Dropdown */}
            {showSearchResults && searchQuery.trim() !== "" && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    Searching TMDB...
                  </div>
                ) : quickResults.length > 0 ? (
                  <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
                    {quickResults.map((item) => {
                      const title = item.title || item.name;
                      const releaseDate = item.release_date || item.first_air_date || "";
                      const year = releaseDate ? releaseDate.split("-")[0] : "";
                      const poster = item.poster_path
                        ? `${IMAGE_BASE_URL}${item.poster_path}`
                        : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&q=80";

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            onSelectMovie(item);
                            setShowSearchResults(false);
                          }}
                          className="flex items-center gap-3 p-2.5 hover:bg-white/10 cursor-pointer transition-colors"
                        >
                          <img
                            src={poster}
                            alt={title}
                            className="w-10 h-14 object-cover rounded-lg shadow"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">{title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                              <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                                {item.media_type || "movie"}
                              </span>
                              {year && <span>{year}</span>}
                              {item.vote_average > 0 && (
                                <span className="flex items-center text-amber-400 font-medium">
                                  <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                                  {item.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                          <Play className="w-4 h-4 text-red-500 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-300" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 flex flex-col gap-3">

            {/* Mobile Search Bar */}
            <div className="relative flex items-center mb-2">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-white text-sm rounded-full pl-10 pr-10 py-2.5 transition-all outline-none placeholder:text-slate-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id && !selectedGenre;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                      ? "bg-red-600 text-white"
                      : "text-slate-300 hover:bg-white/10"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-400 px-2 mb-2 uppercase tracking-wider">
                Categories & Genres
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                {genres.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleGenreSelect(g)}
                    className={`text-left px-3 py-2 text-xs rounded-lg truncate ${selectedGenre?.id === g.id
                      ? "bg-purple-600 text-white font-bold"
                      : "text-slate-300 bg-white/5 hover:bg-white/10"
                      }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
