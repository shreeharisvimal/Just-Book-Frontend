import {createSlice} from '@reduxjs/toolkit'


const AuthSlice = createSlice({
    name:'auth',
    initialState:{
        first_name:null,
        user_cred : null,
        isAuthenticated:false,
        isAdmin:false,
        is_staff:false,

    },
    reducers:{
        set_Authenticate:(state, action) =>{
            state.first_name=action.payload.first_name
            state.user_cred=action.payload.user_cred
            state.isAuthenticated=action.payload.isAuth
            state.isAdmin=action.payload.isAdmin
            state.is_staff = action.payload.is_staff
        }
    }
})

export const {set_Authenticate} = AuthSlice.actions;
export default AuthSlice.reducer;