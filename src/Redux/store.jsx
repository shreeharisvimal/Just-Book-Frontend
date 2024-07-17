
import {configureStore} from '@reduxjs/toolkit'
import auth_slice from '../Redux/Auth/AuthSlice'
import user_reducer from '../Redux/User/UserSlice'
import location_reducer from '../Redux/Location/Location'
import Book_reducer from './Booking/BookSlice'

export const store = configureStore({
    reducer:{
        auth_user:auth_slice,
        user_details: user_reducer,
        location_details:location_reducer,
        Book_details:Book_reducer,
    }
})

