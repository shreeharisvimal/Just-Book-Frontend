import { createSlice } from '@reduxjs/toolkit';

const LocationSlice = createSlice({
  name: 'Location',
  initialState: {
    city: null,
  },
  reducers: {
    set_Location: (state, action) => {
      state.city = action.payload;
    },
  },
});

export const { set_Location } = LocationSlice.actions;
export default LocationSlice.reducer;
