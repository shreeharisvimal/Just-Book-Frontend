import React, { useEffect, useState } from 'react';
import './MovieCard.scss';
import axios from '../../../axios';
import { LanguageUtils } from '../../../Utils/LanguageUtils';
import { imageUrl } from '../../../Tmdb';
import { toast } from 'react-toastify';
import { UseMovieId } from '../../ContextApi/MovieIdContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MovieCard() {
  const [movies, setMovies] = useState([]);
  const { setMovieId } = UseMovieId();
  const navigate = useNavigate();
  const Location = useSelector((state) => state.location_details);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        toast.loading('Fetching your movies', { autoClose: 1000 });
        const movieResp = await axios.get('movie/movieListCreateAPIView/');
        const showResp = await axios.get('show/ShowFetchAll/');
        if (movieResp.status === 200 && showResp.status === 200) {
          const moviesData = movieResp.data;
          const showData = showResp.data;

          const filteredMovies = moviesData.filter((movie) => {
            return showData.some((show) => show.movie.id === movie.id &&  show.theater.city.toUpperCase() === Location.city.toUpperCase());
          });

          setMovies(filteredMovies);
          setLoading(false);
          toast.dismiss();
        }
      } catch (error) {
        setLoading(false);
        toast.dismiss();
      }
    };

    fetchMovies();
  }, [Location.city]);

  const handleMovieDetails = (tmdbId, movieId) => {
    localStorage.setItem('BookShowId', movieId);
    setMovieId(tmdbId);
    navigate(`MovieDetails/`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='MovieFullCard'>
      {movies.length > 0 ? (
        <ul className="movie-list">
          {movies.map((movie) => (
            <li key={movie.id} className="movie-item" onClick={() => handleMovieDetails(movie.tmdb_id, movie.id)}>
              <img src={`${imageUrl}${movie.poster_path}`} alt={movie.title} />
              <div className="movie-info">
                <h2><strong>{movie.title}</strong></h2>
                <p><strong>Duration:</strong> 2hr</p>
                <p><strong>Release Date:</strong> {movie.release_date}</p>
                <p><strong>Language:</strong> {LanguageUtils(movie.language)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No Movies Are Available For Your Location</div>
      )}
    </div>
  );
}

export default MovieCard;
