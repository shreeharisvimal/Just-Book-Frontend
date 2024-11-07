import React, {useState } from 'react'
import styles from './AdminNavBar.module.scss'
import { useSelector } from 'react-redux'

const Logout = React.lazy(()=> import('./AdminLogout'))

function AdminNavBar() {
    const [openlogout, setOpenLOgout] = useState(false)
    const AuthUser = useSelector((state)=> state.auth_user)

    const HandleOpen=()=>{
        setOpenLOgout(!openlogout)
    }
  

  return (
    <div className={styles.admin_nav_bar}>
      <div className={styles.admin_nav_bar__auth_button} onClick={HandleOpen}>
        {AuthUser.first_name && AuthUser.first_name}
      </div>
      {openlogout && <Logout />}
    </div>
  )
}

export default AdminNavBar
