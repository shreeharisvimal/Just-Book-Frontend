import React from 'react'
import './Profile.scss'
import { Link } from 'react-router-dom';

const NavBar = React.lazy(()=> import('../../../Components/UserSide/NavBar/Navbar'))
const ProfileComp = React.lazy(()=> import('../../../Components/UserSide/Profile/Profile'));


function ProfilePage() {
  return (
    <>
    <div className='div_main'>
      <NavBar/>
    </div>
    <div className='Main_Container'>
      <Link to={'/'}><span className='Homespn'>HOME</span></Link>
      <ProfileComp/>
    </div>
    </>
  )
}

export default ProfilePage
