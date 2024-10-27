

const checkHoldTime = (holdTime) => {
  if (!holdTime) return false;
  
  try {
    const now = new Date();
    const holdTimeDate = new Date();

    holdTimeDate.setHours(parseInt(holdTime.slice(0, 2), 10));
    holdTimeDate.setMinutes(parseInt(holdTime.slice(2, 4), 10));
    holdTimeDate.setSeconds(parseInt(holdTime.slice(4, 6), 10));

    const timeDifference = (now - holdTimeDate) / 1000 / 60;
    return timeDifference > 0.1; 
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
        console.log('checkHoldTime(seat.hold_time)', checkHoldTime(seat.hold_time), seat)
        if (seat.holdedseat === true && checkHoldTime(seat.hold_time) === true && seat.status !== 'Booked' && seat.status === 'holdedseat') {
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