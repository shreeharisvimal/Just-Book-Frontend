import React from 'react'
import { GoogleLogin } from 'react-google-login';


function GoogleAuthComp() {


  return (
    <div>
        <GoogleLogin
      clientId="270873383443-k566h4j8h3vlslbsql4bagla6k1iagag.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
        />
    </div>
  )
}

export default GoogleAuthComp
