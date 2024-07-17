import React, {lazy, Suspense} from 'react'
import './GenrePage.scss'

const AsideBar = lazy(()=> import('../../../../Components/AdminSide/AsideBar/AsideBar'))
const GenreComp = lazy(()=> import('../../../../Components/AdminSide/Movie/Genre/Genre'))
const NavBar = lazy(()=> import('../../../../Components/AdminSide/Navbar/AdminNavBar'))

function Genre() {

  return (
        <Suspense fallback={<div>loading.......</div>}>
        <div className='container'>
            <NavBar/>
            <AsideBar/>
            <GenreComp/>
        </div>
        </Suspense>
  )
}

export default Genre
