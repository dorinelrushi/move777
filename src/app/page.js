"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MovieGrid from "@/components/MovieGrid";
import GenreFilter from "@/components/GenreFilter";
import Footer from "@/components/Footer";
import { Film, Tv, Sparkles, Flame, Star, Compass, Search } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home"); // 'home', 'movies', 'tv', 'genre'
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data states
  const [genres, setGenres] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  const [genreResults, setGenreResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Loading & Pagination states
  const [loading, setLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [genrePage, setGenrePage] = useState(1);
  const [hasMoreGenre, setHasMoreGenre] = useState(true);

  const handleMovieSelect = (movie) => {
    const isTv = movie.first_air_date || movie.media_type === "tv";
    router.push(`/movie/${movie.id}?type=${isTv ? 'tv' : 'movie'}`);
  };

  // Fetch Genres & Initial Lists
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        // Fetch genres
        const genreRes = await fetch("/api/movies?type=genres");
        const genreData = await genreRes.json();
        const combinedGenres = [
          ...(genreData.movieGenres || []),
          ...(genreData.tvGenres || []),
        ];
        // Unique by id
        const uniqueGenres = Array.from(
          new Map(combinedGenres.map((item) => [item.id, item])).values()
        );
        setGenres(uniqueGenres);

        // Fetch Trending
        const trendRes = await fetch("/api/movies?type=trending");
        const trendData = await trendRes.json();
        if (trendData?.results?.length) {
          setTrending(trendData.results);
          // Set hero movie as top trending item with backdrop
          const withBackdrop = trendData.results.find((m) => m.backdrop_path);
          setHeroMovie(withBackdrop || trendData.results[0]);
        }

        // Fetch Popular Movies
        const popMovRes = await fetch("/api/movies?type=popular_movies");
        const popMovData = await popMovRes.json();
        setPopularMovies(popMovData?.results || []);

        // Fetch Top Rated Movies
        const topMovRes = await fetch("/api/movies?type=top_rated_movies");
        const topMovData = await topMovRes.json();
        setTopRatedMovies(topMovData?.results || []);

        // Fetch Upcoming Movies
        const upMovRes = await fetch("/api/movies?type=upcoming_movies");
        const upMovData = await upMovRes.json();
        setUpcomingMovies(upMovData?.results || []);

        // Fetch Popular TV
        const popTvRes = await fetch("/api/movies?type=popular_tv");
        const popTvData = await popTvRes.json();
        setPopularTV(popTvData?.results || []);

        // Fetch Top Rated TV
        const topTvRes = await fetch("/api/movies?type=top_rated_tv");
        const topTvData = await topTvRes.json();
        setTopRatedTV(topTvData?.results || []);

      } catch (err) {
        console.error("Initialization fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  // Fetch Genre filtered items
  useEffect(() => {
    if (!selectedGenre) return;

    async function fetchGenreItems() {
      setGenreLoading(true);
      try {
        const mediaType = activeTab === "tv" ? "tv" : "movie";
        const res = await fetch(`/api/movies?genreId=${selectedGenre.id}&mediaType=${mediaType}&page=1`);
        const data = await res.json();
        setGenreResults(data?.results || []);
        setGenrePage(1);
        setHasMoreGenre((data?.page || 1) < (data?.total_pages || 1));
      } catch (err) {
        console.error("Genre fetch error:", err);
      } finally {
        setGenreLoading(false);
      }
    }

    fetchGenreItems();
  }, [selectedGenre, activeTab]);

  // Load more genre items
  const handleLoadMoreGenre = async () => {
    if (!selectedGenre || genreLoading || !hasMoreGenre) return;
    const nextPage = genrePage + 1;
    setGenreLoading(true);
    try {
      const mediaType = activeTab === "tv" ? "tv" : "movie";
      const res = await fetch(`/api/movies?genreId=${selectedGenre.id}&mediaType=${mediaType}&page=${nextPage}`);
      const data = await res.json();
      setGenreResults((prev) => [...prev, ...(data?.results || [])]);
      setGenrePage(nextPage);
      setHasMoreGenre(nextPage < (data?.total_pages || 1));
    } catch (err) {
      console.error("Load more genre error:", err);
    } finally {
      setGenreLoading(false);
    }
  };

  // Search execution
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/movies?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data?.results || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Header Menu with Search Bar & Categories */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectMovie={handleMovieSelect}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        
        {/* Genre Pill Filter (Visible on Home, Movies, TV, & Genre tabs) */}
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={(genre) => {
            setSelectedGenre(genre);
            if (genre) setActiveTab("genre");
          }}
        />

        {/* 1. SEARCH RESULTS VIEW (if search input has content) */}
        {searchQuery.trim() !== "" ? (
          <MovieGrid
            title={`Search Results for "${searchQuery}"`}
            subtitle="Movies & TV Shows matching your query"
            movies={searchResults}
            isLoading={searchLoading}
            onSelectMovie={handleMovieSelect}
          />
        ) : selectedGenre || activeTab === "genre" ? (
          /* 2. GENRE FILTERED VIEW */
          <MovieGrid
            title={`${selectedGenre?.name || "Genre"} ${activeTab === "tv" ? "TV Shows" : "Movies"}`}
            subtitle={`Explore top rated ${selectedGenre?.name || ""} titles`}
            movies={genreResults}
            isLoading={genreLoading}
            onSelectMovie={handleMovieSelect}
            onLoadMore={handleLoadMoreGenre}
            hasMore={hasMoreGenre}
          />
        ) : activeTab === "movies" ? (
          /* 3. MOVIES ONLY VIEW */
          <div className="space-y-12 animate-in fade-in duration-300">
            <MovieGrid
              title="Popular Movies"
              subtitle="Most watched films around the world right now"
              movies={popularMovies}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />
            <MovieGrid
              title="Top Rated Movies"
              subtitle="Critically acclaimed movies loved by fans"
              movies={topRatedMovies}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />
            <MovieGrid
              title="Upcoming Movies"
              subtitle="Films coming soon to theaters and streaming"
              movies={upcomingMovies}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />
          </div>
        ) : activeTab === "tv" ? (
          /* 4. TV SERIES ONLY VIEW */
          <div className="space-y-12 animate-in fade-in duration-300">
            <MovieGrid
              title="Popular TV Series"
              subtitle="Binge-worthy shows trending this week"
              movies={popularTV}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />
            <MovieGrid
              title="Top Rated TV Shows"
              subtitle="Highest rated television series of all time"
              movies={topRatedTV}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />
          </div>
        ) : (
          /* 5. HOME PAGE VIEW (Hero Banner + Trending + Popular Movies + Top TV) */
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* Hero Featured Movie Banner */}
            {heroMovie && (
              <HeroBanner
                movie={heroMovie}
                onSelectMovie={handleMovieSelect}
              />
            )}

            {/* Trending Section */}
            <MovieGrid
              title="Trending Now"
              subtitle="The hottest movies and series everyone is talking about"
              movies={trending}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />

            {/* Popular Movies */}
            <MovieGrid
              title="Popular Movies"
              subtitle="Blockbusters and fan favorites"
              movies={popularMovies}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />

            {/* Popular TV Shows */}
            <MovieGrid
              title="Popular TV Series"
              subtitle="Top television shows to stream"
              movies={popularTV}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />

            {/* Top Rated Movies */}
            <MovieGrid
              title="Top Rated Classics"
              subtitle="Masterpieces with highest audience ratings"
              movies={topRatedMovies}
              isLoading={loading}
              onSelectMovie={handleMovieSelect}
            />

          </div>
        )}

      </main>



      {/* Footer */}
      <Footer setActiveTab={setActiveTab} setSelectedGenre={setSelectedGenre} />

    </div>
  );
}
