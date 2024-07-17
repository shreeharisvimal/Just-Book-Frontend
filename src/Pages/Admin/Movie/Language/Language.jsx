import React, {lazy, Suspense} from 'react'
import './Language.scss'

const AsideBar = lazy(()=> import('../../../../Components/AdminSide/AsideBar/AsideBar'))
const NavBar = lazy(()=> import('../../../../Components/AdminSide/Navbar/AdminNavBar'))
const LanguageComp = lazy(()=> import('../../../../Components/AdminSide/Movie/Language/Language'))

function Language() {
  return (
    <Suspense fallback={<div>loading.......</div>}>
    <div className='Container'>
      <AsideBar/>
      <NavBar/>
        <LanguageComp/>
    </div>
    </Suspense>
  )
}

export default Language
