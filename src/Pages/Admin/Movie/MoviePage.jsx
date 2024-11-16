import React, {useEffect, useState} from 'react'
import './MoviePage.scss'
import axios from '../../../Admin_axios'
import { imageUrl } from '../../../Tmdb'
import { LanguageUtils } from '../../../Utils/LanguageUtils'
import { toast } from 'react-toastify'


const WarningBox = React.lazy(()=> import('../../../Utils/WarningBox'));
const AsideBar = React.lazy(()=> import('../../../Components/AdminSide/AsideBar/AsideBar'))
const NavBar = React.lazy(()=> import('../../../Components/AdminSide/Navbar/AdminNavBar'))
const Movie = React.lazy(()=> import('../../../Components/AdminSide/Movie/Movie'))
const FilterComponent = React.lazy(()=> import('./itemsFilter'))


function MoviePage() {
  const [showMovieCreate, setshowMovieCreate] = useState(false)
  const [myMovies, setmyMovies] = useState([])
  const [apiLink, setApiLink] = useState('');
  const [onOpen, setOnOpen] = useState('');
  const [onSuccess, setOnSuccess] = useState(false)
  const [fixedlen, setFixedlen] = useState(0);

  const fetchMovie = async()=>{
    try{
      const resp = await axios.get('movie/movieListCreateAPIView/')
      setmyMovies(resp.data)
      setFixedlen(resp.data.length)
    }catch(error){
      console.log('error while fetching movie', error)
    }
  }
    useEffect(()=>{
      if (onSuccess) {
        toast.dismiss();
        toast.success("Show deleted successfully");
        setOnSuccess(false);
      }
      fetchMovie();
    },[showMovieCreate, onSuccess])

    const deleteMovie =async(id)=>{
    toast.loading("Deleting movie...");
      try{
        setApiLink(`movie/movieRetrieveDestroyAPIView/${id}/`)
        setOnOpen(true)
      }catch(error){

      }
    }
  return (
<>
  {onOpen && <WarningBox apiLink={apiLink} setOnOpen={setOnOpen} setOnSuccess={setOnSuccess}/> }

      <div className='movie-page__container'>
        <React.Suspense fallback={<div>Loading...</div>}>
          <NavBar className='movie-page__create-movie' />
          <AsideBar />
          <FilterComponent fixedlen={fixedlen} myMovies={myMovies} setmyMovies={setmyMovies} />
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
