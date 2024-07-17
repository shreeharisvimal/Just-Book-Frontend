const SeatAllocation = {};

for (let row = 65; row < 75; row++) {
  const rowLetter = String.fromCharCode(row);
  SeatAllocation[rowLetter] = { type: 'Standard', seats: {}, is_row_freeSpace:false};

  for (let col = 1; col <= 20; col++) {
    SeatAllocation[rowLetter].seats[col] = { 
      status: 'available',
      is_freeSpace: false,
      name: `${rowLetter}${col}`,
    };
  }
}

export default SeatAllocation;
