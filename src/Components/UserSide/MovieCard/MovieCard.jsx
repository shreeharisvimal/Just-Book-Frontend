import React, { useEffect, useState } from 'react';
import './MovieCard.scss';
import axios from '../../../axios';
import { LanguageUtils } from '../../../Utils/LanguageUtils';
import { imageUrl } from '../../../Tmdb';
import { toast } from 'react-toastify';
import { UseMovieId } from '../../ContextApi/MovieIdContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MovieCard({ searchQuery}) {
  const [movies, setMovies] = useState([]);
  const { setMovieId } = UseMovieId();
  const navigate = useNavigate();
  const Location = useSelector((state) => state.location_details);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieResp = await axios.get('movie/movieListCreateAPIView/');
        const showResp = await axios.get('show/ShowFetchAll/');
        if (movieResp.status === 200 && showResp.status === 200) {
          const moviesData = movieResp.data.results;
          const showData = showResp.data;

          const myfilteredMovies = moviesData.filter((movie) => {
            return showData.some((show) => show.movie.id === movie.id && show.theater.city.toUpperCase() === Location.city.toUpperCase());
          });

          setMovies(myfilteredMovies);
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

  const filteredMovies = movies.filter((movie) => {
    if(searchQuery){
      return movie.title && movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    }else{
      return movie;
    }
  });

  const handleMovieDetails = (tmdbId, movieId) => {
    localStorage.setItem('BookShowId', movieId);
    setMovieId(tmdbId);
    navigate(`MovieDetails/`);
  };

  const formatReleaseDate = (releaseDate) => {
    const date = new Date(releaseDate);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='MovieFullCard'>
      {filteredMovies.length > 0 ? (
        <ul className="movie-list">
          {filteredMovies.map((movie) => (
            <li key={movie.id} className="movie-item" onClick={() => handleMovieDetails(movie.tmdb_id, movie.id)}>
              <img src={`${imageUrl}${movie.poster_path}`} alt={movie.title} />
              <div className="movie-info">
                <h2><strong>{movie.title}</strong></h2>
                <p><strong>Duration:</strong> 2hr</p>
                <p><strong>Release Date:</strong> {formatReleaseDate(movie.release_date)}</p>
                <p><strong>Language:</strong> {LanguageUtils(movie.language)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div><strong>Movie is not available at this location please change the location</strong></div>
      )}
    </div>
  );
}

export default MovieCard;
