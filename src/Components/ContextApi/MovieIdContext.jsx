import React, {useState, createContext, useContext} from 'react'


const IdContext = createContext();

export const UseMovieId =()=>{
  return useContext(IdContext)

}

function MovieIdContext({children}) {
    const [movieId, setMovieId] = useState(null)

  return (
    <IdContext.Provider value={{movieId, setMovieId}}>
      {children}
    </IdContext.Provider>
  )
}

export default MovieIdContext
