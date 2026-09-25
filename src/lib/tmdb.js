const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "663b4579014701c879a6f9a212e2cb9d";
const READ_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjNiNDU3OTAxNDcwMWM4NzlhNmY5YTIxMmUyY2I5ZCIsIm5iZiI6MTc5MDM2NDM5Ni4zNjMwMDAyLCJzdWIiOiI2YWI2Y2FlY2QxMzQzMTIwM2EwOGQ3YmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.C7aVklOGDDKf7rOxZI5hTsOwCsxGBMERuQHoBPBfYpQ";

const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const getHeaders = () => ({
  accept: "application/json",
  Authorization: `Bearer ${READ_TOKEN}`,
});

async function fetchFromTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  try {
    const res = await fetch(url.toString(), {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`TMDB fetch error ${res.status}: ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("TMDB Fetch Exception:", error);
    return null;
  }
}

// Get Trending (Movies & TV)
export async function getTrending(type = "all", timeWindow = "day", page = 1) {
  return await fetchFromTMDB(`/trending/${type}/${timeWindow}`, { page });
}

// Get Popular Movies
export async function getPopularMovies(page = 1) {
  return await fetchFromTMDB("/movie/popular", { page });
}

// Get Top Rated Movies
export async function getTopRatedMovies(page = 1) {
  return await fetchFromTMDB("/movie/top_rated", { page });
}

// Get Upcoming Movies
export async function getUpcomingMovies(page = 1) {
  return await fetchFromTMDB("/movie/upcoming", { page });
}

// Get Popular TV Series
export async function getPopularTV(page = 1) {
  return await fetchFromTMDB("/tv/popular", { page });
}

// Get Top Rated TV Series
export async function getTopRatedTV(page = 1) {
  return await fetchFromTMDB("/tv/top_rated", { page });
}

// Get Genres for Movies
export async function getMovieGenres() {
  const data = await fetchFromTMDB("/genre/movie/list");
  return data?.genres || [];
}

// Get Genres for TV
export async function getTVGenres() {
  const data = await fetchFromTMDB("/genre/tv/list");
  return data?.genres || [];
}

// Search Movies & TV
export async function searchMulti(query, page = 1) {
  if (!query) return { results: [] };
  return await fetchFromTMDB("/search/multi", { query, page, include_adult: false });
}

// Discover Movies by Genre
export async function discoverMoviesByGenre(genreId, page = 1) {
  return await fetchFromTMDB("/discover/movie", {
    with_genres: genreId,
    page,
    sort_by: "popularity.desc",
  });
}

// Discover TV by Genre
export async function discoverTVByGenre(genreId, page = 1) {
  return await fetchFromTMDB("/discover/tv", {
    with_genres: genreId,
    page,
    sort_by: "popularity.desc",
  });
}

// Get Item Details (Movie or TV) with videos and credits
export async function getItemDetails(id, mediaType = "movie") {
  const endpoint = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;
  return await fetchFromTMDB(endpoint, {
    append_to_response: "videos,credits,similar,recommendations",
  });
}
