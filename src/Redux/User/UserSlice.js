import {createSlice} from '@reduxjs/toolkit'

const UserDetails = createSlice({
    name:'user_details',
    initialState:{
        first_name:null,
        last_name:null,
        profile_pic:null,
    },
    reducers:{
        get_UserDetails:(state,action)=>{
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.profile_pic = action.payload.profile_pic
        }
    }
})

export const   {get_UserDetails} = UserDetails.actions
export default UserDetails.reducer