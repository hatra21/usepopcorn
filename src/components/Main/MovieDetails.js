import { useEffect, useRef, useState } from "react";
import StarRating from "../StarRating";
import { Loader } from "../Navigation/Loader";
import { useKey } from "../../custom_hooks/useKey";

const API_KEY = "4bd7a40e";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [curMovie, setCurMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const differentRatingDecisionCount = useRef(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = curMovie;

  //fetch movie specific details
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setCurMovie(data);
        setIsLoading(false);
        // console.log(data);
      } catch (error) {
        console.error("something went wrong");
      }
    }
    fetchMovieDetails();
  }, [selectedId]);

  //change tab title to match the current selected movie
  useEffect(() => {
    if (!title) return;
    document.title = title;

    return () => (document.title = "usePopcorn"); //clean up function
  }, [title]);

  //unmount MovieDetails when ESC is pressed
  useKey("Escape", onCloseMovie);

  useEffect(() => {
    if (userRating) differentRatingDecisionCount.current += 1;
  }, [userRating]);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      differentRatingDecisionCount,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              ⬅️
            </button>
            <img src={poster} alt="Poster" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>You rated movie with {watchedUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
