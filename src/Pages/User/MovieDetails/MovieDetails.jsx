import React from 'react';
import './MovieDetails.scss';

const NavBar = React.lazy(()=> import('../../../Components/UserSide/NavBar/Navbar'))
const MovieDetailsComp = React.lazy(()=> import('../../../Components/UserSide/MovieDetails/MovieDetails'));


function MovieDetails() {


    return (
        <React.Suspense fallback={<div>loading........</div>}>
            <div className='Movie_Details'>   
                <NavBar/>
                <MovieDetailsComp/>
            </div>
        </React.Suspense>
        
  )
}

export default MovieDetails
