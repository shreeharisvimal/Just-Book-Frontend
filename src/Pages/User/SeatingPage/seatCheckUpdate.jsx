import moment from 'moment';

const checkHoldTime = (holdTime) => {
  if (!holdTime) return false;
  
  try {
    const now = moment();
    const holdMoment = moment(holdTime, 'h:mm:ss A');
    
    if (!holdMoment.isValid()) {
      console.error('Invalid hold time format:', holdTime);
      return false;
    }
    
    const minutesDifference = now.diff(holdMoment, 'minutes');
    return minutesDifference > 3;
  } catch (error) {
    console.error('Error checking hold time:', error);
    return false;
  }
};

const seatCheckUpdate = (seatAllocation) => {
  try {
    const updatedSeatAllocation = {};
    
    for (const rowLetter in seatAllocation) {
      const row = seatAllocation[rowLetter];
      const updatedSeats = {};
      
      for (const seatNumber in row.seats) {
        const seat = row.seats[seatNumber];
        if (seat.holdedseat === true && checkHoldTime(seat.hold_time) === true && seat.status !== 'Booked') {
          updatedSeats[seatNumber] = {
            ...seat,
            status: 'available',
            holdedseat: false,
            user: '',
            hold_time: '',
          };
        } else {
          updatedSeats[seatNumber] = { ...seat };
        }
      }
      
      updatedSeatAllocation[rowLetter] = {
        ...row,
        seats: updatedSeats,
      };
    }
    
    return updatedSeatAllocation;
  } catch (error) {
    console.error('Error updating seats:', error);
    return null;
  }
};

export default seatCheckUpdate;