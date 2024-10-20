import React, {useEffect, useState} from 'react'
import './MoviePage.scss'
import axios from '../../../Admin_axios'
import { imageUrl } from '../../../Tmdb'
import { LanguageUtils } from '../../../Utils/LanguageUtils'
import { toast } from 'react-toastify'


const AsideBar = React.lazy(()=> import('../../../Components/AdminSide/AsideBar/AsideBar'))
const NavBar = React.lazy(()=> import('../../../Components/AdminSide/Navbar/AdminNavBar'))
const Movie = React.lazy(()=> import('../../../Components/AdminSide/Movie/Movie'))



function MoviePage() {
  const [showMovieCreate, setshowMovieCreate] = useState(false)
  const [myMovies, setmyMovies] = useState([])

  const fetchMovie = async()=>{
    try{
      const resp = await axios.get('movie/movieListCreateAPIView/')
      setmyMovies(resp.data)
    }catch(error){
      console.log('error while fetching movie', error)
    }
  }
    useEffect(()=>{
      fetchMovie();
    },[showMovieCreate])

    const deleteMovie =async(id)=>{
      try{
        const resp = await axios.delete(`movie/movieRetrieveDestroyAPIView/${id}/`)
        if (resp.status === 204){
          toast.warning('The movie is removed from justbook')
          fetchMovie();

        }
      }catch(error){

      }
    }
  return (
<>
      <div className='movie-page__container'>
        <React.Suspense fallback={<div>Loading...</div>}>
          <NavBar className='movie-page__create-movie' />
          <AsideBar />
          <button className='movie-page__create-btn' onClick={() => setshowMovieCreate(!showMovieCreate)}>
            {showMovieCreate ? 'CLOSE CREATE MOVIE' : 'CREATE MOVIE'}
          </button>
          {showMovieCreate ? (
            <Movie />
          ) : (
            <ul className='movie-list'>
              {myMovies.map((movie) => (
                <li key={movie.id} className='movie-list__item'>
                  <img src={`${imageUrl}${movie.poster_path}`} alt={movie.title} className='movie-list__item__img' />
                  <div className='movie-list__item__info'>
                    <h2 className='movie-list__item__info__title'>{movie.title}</h2>
                    <p className='movie-list__item__info__details'><strong>Release Date:</strong> {movie.release_date}</p>
                    <p className='movie-list__item__info__details'><strong>Language:</strong> {LanguageUtils(movie.language)}</p>
                    <button className='movie-list__item__info__delete-btn' onClick={() => deleteMovie(movie.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </React.Suspense>
      </div>
    </>
  )
}

export default MoviePage
