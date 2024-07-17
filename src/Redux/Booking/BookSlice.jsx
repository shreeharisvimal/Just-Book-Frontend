import { createSlice } from '@reduxjs/toolkit';

const BookingSlice = createSlice({
  name: 'Booking',
  initialState: {
    showId:null,
    bookingSeats:null,
    selectedSeats: null,
    TotalAmount:null,
    SeatAllocation:null,
  },
  reducers: {
    set_Booking: (state, action) => {
      state.bookingSeats = action.payload.bookingSeats;
      state.selectedSeats = action.payload.selectedSeats;
      state.TotalAmount = action.payload.TotalAmount;
      state.SeatAllocation = action.payload.SeatAllocation;
      state.showId = action.payload.showId;
    },
  },
});

export const { set_Booking } = BookingSlice.actions;
export default BookingSlice.reducer;
