import { useState, useEffect } from "react";

const API_KEY = "4bd7a40e";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      setIsLoading(true);
      try {
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }

        if (!res.ok)
          throw new Error("Something went wrong while fetching data");

        const data = await res.json();
        if (data.Response === "False") throw new Error("movie not found");
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    // handleCloseMovie();
    fetchMovies();
    return () => controller.abort();
  }, [query]);

  return { movies, isLoading, error };
}
