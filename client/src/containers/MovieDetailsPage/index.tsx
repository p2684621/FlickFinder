import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import MovieDetails from '../../components/movieDetails';
import Loader from '../../components/Loader';

const MovieDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { movieId, title } = useParams<{ movieId: any; title: any }>();

    const [movieDetails, setMovieDetails] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);

    useEffect(() => {
        // Fetch movie details using TMDB API

        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=9e025a764b43c28d9d3092f8833f92c8`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setMovieDetails(data);
            })
            .catch((error) => {
                console.error('Error fetching movie details:', error);
            });
        getRecommendations()
    }, [movieId]);

    const handleMovieClick = (rec_movie: any) => {
        // Construct the URL with movie ID and title
        const url = `/movie/${rec_movie.id}/${encodeURIComponent(rec_movie.title)}`;
        navigate(url);
    };

    const getRecommendations = () => {
        setLoadingRecommendations(true)

        // Fetch movie recommendations 
        fetch(`http://127.0.0.1:5000/content?movieTitle=${encodeURIComponent(title)}`)
            .then((response) => response.json())
            .then((data) => {
                setRecommendations(data);
            })
            .catch((error) => {
                console.error('Error fetching recommendations:', error);
            }).finally(() => {
                setLoadingRecommendations(false); // Set loading state to false after fetching recommendations
            });
    }

    return (
        <>
            <Header />
            <div className='movie-details-page'>
                {movieDetails && <MovieDetails movieDetails={movieDetails} title={title} />}
                <div className='popular-movies'>
                    <h1 className='header'>Recommendation based on <span>{title}</span></h1>
                    {
                        loadingRecommendations ?
                            <Loader />
                            :
                            <div className='popular-movies-container'>
                                {
                                    recommendations.map((rec_movie: any) => (
                                        <div className='popular-movie-widget-container' key={rec_movie.id}>
                                            <div
                                                onClick={() => handleMovieClick(rec_movie)}
                                                className='popular-movie-widget'
                                                style={{ backgroundImage: `url(${rec_movie.poster})` }}
                                            >
                                                <p className='movie-title'>{rec_movie.title}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                    }
                </div>
            </div>
        </>

    );
};

export default MovieDetailsPage;