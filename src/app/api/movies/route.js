import { NextResponse } from "next/server";
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularTV,
  getTopRatedTV,
  getMovieGenres,
  getTVGenres,
  searchMulti,
  discoverMoviesByGenre,
  discoverTVByGenre,
} from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "trending";
  const query = searchParams.get("query");
  const genreId = searchParams.get("genreId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const mediaType = searchParams.get("mediaType") || "movie";

  try {
    if (query) {
      const data = await searchMulti(query, page);
      return NextResponse.json(data);
    }

    if (type === "genres") {
      const movieGenres = await getMovieGenres();
      const tvGenres = await getTVGenres();
      return NextResponse.json({ movieGenres, tvGenres });
    }

    if (genreId) {
      if (mediaType === "tv") {
        const data = await discoverTVByGenre(genreId, page);
        return NextResponse.json(data);
      } else {
        const data = await discoverMoviesByGenre(genreId, page);
        return NextResponse.json(data);
      }
    }

    switch (type) {
      case "trending":
        const trending = await getTrending("all", "day", page);
        return NextResponse.json(trending);

      case "popular_movies":
        const popMovies = await getPopularMovies(page);
        return NextResponse.json(popMovies);

      case "top_rated_movies":
        const topMovies = await getTopRatedMovies(page);
        return NextResponse.json(topMovies);

      case "upcoming_movies":
        const upcomingMovies = await getUpcomingMovies(page);
        return NextResponse.json(upcomingMovies);

      case "popular_tv":
        const popTV = await getPopularTV(page);
        return NextResponse.json(popTV);

      case "top_rated_tv":
        const topTV = await getTopRatedTV(page);
        return NextResponse.json(topTV);

      default:
        const defaultData = await getTrending("all", "day", page);
        return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
