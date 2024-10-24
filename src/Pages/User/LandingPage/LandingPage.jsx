import React, {lazy, Suspense, useState} from 'react'
import './LandingPage.scss'
const NavBar = lazy(()=> import('../../../Components/UserSide/NavBar/Navbar'))
const MovieCard = lazy(()=> import('../../../Components/UserSide/MovieCard/MovieCard'))
const AsideBar = lazy(()=> import('../UserAsideBar/AsideBar'))

function LandingPage() {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };


  return (
    <div>
        <Suspense fallback={<div>Loading data</div>}>
        <div className='Main'>
        <NavBar onSearch={handleSearch} />
        <MovieCard searchQuery={searchQuery} />
        </div>
        </Suspense>
      
    </div>
  )
}

export default LandingPage
