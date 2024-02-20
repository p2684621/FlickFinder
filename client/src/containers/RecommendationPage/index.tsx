import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

interface Movie {
  id: number;
  title: string;
  poster: string;
}

function RecommendationPage() {
  const navigate = useNavigate();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [genreBasedMovies, setGenreBasedMovies] = useState<Movie[]>([]);
  const [collaborativeRecommendationMovies, setCollaborativeRecommendationMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoadingTopMovies, setIsLoadingTopMovies] = useState<boolean>(true);
  const [isLoadingGenreBasedMovies, setIsLoadingGenreBasedMovies] = useState<boolean>(true);
  const [isLoadingCollaborativeMovies, setIsLoadingCollaborativeMovies] = useState<boolean>(true);
  let selectedGenres: any[] = []
  
  useEffect(() => {
    const storedSelectedGenres = localStorage.getItem('selectedGenres');
    if (storedSelectedGenres) {
      selectedGenres = JSON.parse(storedSelectedGenres)
    }
  }, []);

  useEffect(() => {
    const fetchData = async (url: string, setData: Function, setIsLoading: Function) => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Movie[] = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const selectedGenreNames = selectedGenres.map((genre) => genre.name)

    fetchData("http://127.0.0.1:5000/top_movies", setPopularMovies, setIsLoadingTopMovies);
    fetchData(`http://127.0.0.1:5000/genre?selectedGenres=${selectedGenreNames}`, setGenreBasedMovies, setIsLoadingGenreBasedMovies);
    fetchData("http://127.0.0.1:5000/collaborative", setCollaborativeRecommendationMovies, setIsLoadingCollaborativeMovies);
  }, []);

  const debounce = (func: Function, delay: number) => {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const delayedSearch = debounce(async (query: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/search?q=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setSearchResults([]);
      const data: Movie[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, 1000);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    delayedSearch(newQuery);
  };

  const renderMovieWidgets = (movies: Movie[]) => (
    <div className="popular-movies-container">
      {movies.map((movie) => (
        <div className="popular-movie-widget-container" onClick={() => handleMovieClick(movie)} key={movie.id}>
          <div style={{ backgroundImage: `url(${movie.poster})` }} className="popular-movie-widget">
            <p className="movie-title">
              {movie.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const handleMovieClick = (movie: any) => {
    const url = `/movie/${movie.id}/${encodeURIComponent(movie.title)}`;
    navigate(url);
  };

  return (
    <>
      <Header />
      <div className="recommendation-page">
        <div className="recommendation-header">
          <h1 className="header">FIND YOUR MOVIE</h1>
          <p className="subtext">Search here, If you can't find the movies you are looking.</p>
        </div>
        <div className="movie-search">
          <input className="search-input" value={searchQuery}
            onChange={handleSearchChange} placeholder="Enter movie name"></input>
          {searchResults.length > 0 && (
            <div className="search-results-container">
              <h1 className="results-heading">Search results</h1>
              {searchResults.map((movie) => (
                <Link className="search-movie" key={movie.id} to={`/movie/${movie.id}/${encodeURIComponent(movie.title)}`}>
                  {movie.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="popular-movies">
          <h1 className="header">Top movies</h1>
          {isLoadingTopMovies ? <Loader /> : renderMovieWidgets(popularMovies)}
        </div>
        <div className="popular-movies">
          <h1 className="header">Movies based on Selected Genre</h1>
          {isLoadingGenreBasedMovies ? <Loader /> : genreBasedMovies.length > 0 ? renderMovieWidgets(genreBasedMovies) : <p>No Selected genre</p>}
        </div>
        <div className="popular-movies">
          <h1 className="header">Suggested Movies</h1>
          {isLoadingCollaborativeMovies ? <Loader /> : renderMovieWidgets(collaborativeRecommendationMovies)}
        </div>
      </div>
    </>
  );
}

export default RecommendationPage;
