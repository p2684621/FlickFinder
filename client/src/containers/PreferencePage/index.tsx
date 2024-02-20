import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";

interface Genre {
  id: number;
  name: string;
  icon: string;
  selected: boolean;
}

function PreferencePage() {
  const navigate = useNavigate()
  const initialGenres: Genre[] = [
    { "id": 0, "name": "Adventure", "icon": "", "selected": false },
    { "id": 1, "name": "TV Movie", "icon": "", "selected": false },
    { "id": 2, "name": "Animation", "icon": "", "selected": false },
    { "id": 3, "name": "Mystery", "icon": "", "selected": false },
    { "id": 4, "name": "Science Fiction", "icon": "", "selected": false },
    { "id": 5, "name": "Comedy", "icon": "", "selected": false },
    { "id": 6, "name": "Music", "icon": "", "selected": false },
    { "id": 7, "name": "Western", "icon": "", "selected": false },
    { "id": 8, "name": "War", "icon": "", "selected": false },
    { "id": 9, "name": "Horror", "icon": "", "selected": false },
    { "id": 10, "name": "Documentary", "icon": "", "selected": false },
    { "id": 11, "name": "History", "icon": "", "selected": false },
    { "id": 12, "name": "Crime", "icon": "", "selected": false },
    { "id": 13, "name": "Fantasy", "icon": "", "selected": false },
    { "id": 14, "name": "Drama", "icon": "", "selected": false },
    { "id": 15, "name": "Romance", "icon": "", "selected": false },
    { "id": 16, "name": "Foreign", "icon": "", "selected": false },
    { "id": 17, "name": "Action", "icon": "", "selected": false },
    { "id": 18, "name": "Thriller", "icon": "", "selected": false },
    { "id": 19, "name": "Family", "icon": "", "selected": false }
  ];

  const [genres, setGenres] = useState<Genre[]>(initialGenres);
  const [selectedGenres, setSelectedGenres] = useState<any[]>([]);

  // useEffect(() => {
  //   const storedSelectedGenres = localStorage.getItem('selectedGenres');
  //   if (storedSelectedGenres) {
  //     // Update genre selection status in movies_genres
  //     const updatedGenres = genres.map((genre) => ({
  //       ...genre,
  //       selected: JSON.parse(storedSelectedGenres).includes(genre.name),
  //     }));
  //     setGenres(updatedGenres);
  //     setSelectedGenres(JSON.parse(storedSelectedGenres));
  //   }
  // }, []);

  useEffect(() => {
    const storedSelectedGenres = localStorage.getItem('selectedGenres');
    if (storedSelectedGenres) {
      const selectedGenresArray = JSON.parse(storedSelectedGenres);
      // setSelectedGenres(selectedGenresArray);

      // Update genre selection status in genres
      const updatedGenres = genres.map((genre) => ({
        ...genre,
        selected: selectedGenresArray.includes(genre.id),
      }));

      setGenres(updatedGenres);
    }
  }, []); 

  const handleGenreSelect = (genreId: number) => {
    const selectedGenre = genres.find((genre) => genre.id === genreId);
  
    if (selectedGenre) {
      const updatedGenres = genres.map((genre) =>
        genre.id === genreId ? { ...genre, selected: !genre.selected } : genre
      );
  
      setGenres(updatedGenres);
      if (selectedGenre.selected) {
        setSelectedGenres(selectedGenres.filter((genre) => genre.id !== selectedGenre.id));
      } else {
        setSelectedGenres([...selectedGenres, selectedGenre]);
      }
    }
  };

  useEffect(() => {
    // console.log(first)
    if(selectedGenres.length > 0){
      localStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
    }else{
      localStorage.setItem('selectedGenres', JSON.stringify([]));
    }
  }, [selectedGenres])

  const onContinueClick = () => {
    navigate('/recommendation')
  }

  return (
    <>
      <Header />
      <div className="preference-page">
        <h1 className="header">Discover Your Preferences</h1>
        <p className="subtext">Personalize Your Recommendations by Selecting Your Favorite Genres</p>
        <div className="genres-list-container">
          {genres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => handleGenreSelect(genre.id)}
              className={genre.selected ? "genre-widget selected" : "genre-widget"}
            >
              {genre.name}
            </div>
          ))}
        </div>
        <div className="footer">
            <button onClick={onContinueClick} className={selectedGenres.length > 0 ? "button-primary" : "button-primary disabled"}>Continue</button>
          {/* <Link to="/recommendation">
          </Link> */}
        </div>
      </div>
    </>
  );
}

export default PreferencePage;
