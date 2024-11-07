import React, { useEffect, useState } from 'react';
import './Movie.scss';
import { CreateMovieMatch, imageUrl } from '../../../Tmdb';
import { LanguageUtils } from '../../../Utils/LanguageUtils';
import PostMovieForm from './api/MovieFetchCreate';
import { toast } from 'react-toastify';

function Movie() {
  const [name, setName] = useState('');
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchingMovies = async () => {
      const res = await CreateMovieMatch(name);
      setMovies(res.slice(0, 16));
    };
    if (search) {
      fetchingMovies();
      setSearch(false);
    }
  }, [search]);

  const handleAddMovie = (index) => {
    setSelectedMovie(movies[index]);
  };

  const handleMoviePosted = () => {
    setSelectedMovie(null);
    
  };

  const formatReleaseDate = (releaseDate) => {
    const date = new Date(releaseDate);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="movie-container">
      <div className="search-bar">
        <input
          type="text"
          value={name}
          placeholder="Enter movie name to add"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={() => setName('')}>CLEAR</button>
        <button onClick={() => setSearch(true)}>FIND MOVIES</button>
      </div>
      <ul className="movie-list">
        {movies.map((movie, index) => (
          <li key={movie.id} className="movie-item">
            <img src={`${imageUrl}${movie.poster_path}`} alt={movie.title} />
            <button className="MyAddBtn" onClick={() => handleAddMovie(index)}>
              ADD MOVIE TO JUSTBOOK
            </button>
            <div className="movie-info">
              <h2>{movie.title}</h2>
              <p>
                <strong>Release Date:</strong> {formatReleaseDate(movie.release_date)}
              </p>
              <p>
                <strong>Overview:</strong> {movie.overview}
              </p>
              <p>
                <strong>Language:</strong> {LanguageUtils(movie.original_language)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {selectedMovie && (
        <PostMovieForm movie={selectedMovie} onMoviePosted={handleMoviePosted} />
      )}
    </div>
  );
}

export default Movie;
