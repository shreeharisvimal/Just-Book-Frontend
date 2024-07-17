import React, {lazy, Suspense} from 'react'
import './LandingPage.scss'
const NavBar = lazy(()=> import('../../../Components/UserSide/NavBar/Navbar'))
const MovieCard = lazy(()=> import('../../../Components/UserSide/MovieCard/MovieCard'))
const AsideBar = lazy(()=> import('../UserAsideBar/AsideBar'))

function LandingPage() {
  return (
    <div>
        <Suspense fallback={<div>Loading data</div>}>
        <div className='Main'>

        <NavBar />
        <AsideBar/>
        <MovieCard/>
        </div>
        </Suspense>
      
    </div>
  )
}

export default LandingPage
