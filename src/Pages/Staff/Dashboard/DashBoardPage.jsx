import React, {useState} from 'react';
import './Dashboard.scss';


const AsideBar = React.lazy(()=> import('../../../Components/StaffSide/AsideBar/AsideBar'))
const DashBoard = React.lazy(()=> import('../../../Components/AdminSide/Dashboard/Dashboard'))
const NavBar = React.lazy(()=> import('../../../Components/AdminSide/Navbar/AdminNavBar'))

function DashBoardPage() {

  return (
    <div className='Container'>
        <React.Suspense fallback={<div>Loading.........</div>}>
            <NavBar/>
            <AsideBar/> 
            <DashBoard/>
        </React.Suspense>
    </div>
  )
}

export default DashBoardPage
