import {useEffect} from "react"
import { useNavigate } from "react-router-dom";
import axios from '../../../axios';
import {useSelector} from 'react-redux'

function Logout() {

  const auth_user = useSelector((state) =>state.auth_user)
  const navigate = useNavigate()
  if (!auth_user.isAuthenticated){
    navigate('/')
  }
  
    useEffect(() => {(async () => {
      const refresh_token = JSON.parse(localStorage.getItem('RefreshToken'))
      const token = JSON.parse(localStorage.getItem('AccessToken'))
      console.log("The getted refresha nd acesss", refresh_token, token)
      
         try {
            console.log(token)
           const res = await axios.post('logout/',{refresh_token:refresh_token},{headers:{
            'Authorization': `Bearer ${token}`
          }})
           console.log(res.status)
           localStorage.clear();
           axios.defaults.headers.common['Authorization'] = null;
           window.location.href = '/'
           } catch (e) {
             console.log('logout not working', e)
           }
         })();
    }, []);
   
}

export default Logout