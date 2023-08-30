interface MovieDetailsProps {
    movieDetails: any;
    title: string;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movieDetails, title }) => {
    return (
        <div className='selected-movie-details'>
            <div className='movie-image' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movieDetails.poster_path})` }} />
            <div className='other-details'>
                <h1 className='movie-title'>{title}</h1>
                <div className='detail-contianer'>
                    <p className='label'>Languages:&nbsp;</p>
                    <div className='languages'>
                        {
                            movieDetails.spoken_languages.length > 0 &&
                            movieDetails.spoken_languages.map((language: any, index: any) => {
                                return (
                                    <p className='value'>
                                        {language.english_name}
                                        {index !== movieDetails.spoken_languages.length - 1 && ", "}
                                    </p>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='detail-contianer'>
                    <p className='label'>Director:&nbsp;</p>
                    <p className='value'>
                    </p>
                </div>
                <div className='detail-contianer'>
                    <p className='label'>Rating:&nbsp;</p>
                    <p className='value'>
                        {parseFloat(movieDetails.vote_average).toFixed(2)}
                    </p>
                </div>
                <div className='detail-contianer desc'>
                    <p className='label'>Description:</p>
                    <p className='value'>{movieDetails.overview}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
