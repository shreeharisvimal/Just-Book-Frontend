import React from 'react';
import './MovieDetails.scss';

const MovieDetailsComp = React.lazy(()=> import('../../../Components/UserSide/MovieDetails/MovieDetails'));
const NavBar = React.lazy(()=> import('../../../Components/UserSide/NavBar/Navbar'))


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
