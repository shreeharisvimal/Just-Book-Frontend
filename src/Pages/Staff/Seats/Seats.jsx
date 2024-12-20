import './Seats.scss';
import { toast } from 'react-toastify';
import myaxios from '../../../Admin_axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { lazy, Suspense, useState, useEffect } from 'react';


const AsideBar = lazy(() => import('../../../Components/StaffSide/AsideBar/AsideBar'));
const NavBar = lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));

function Seats() {
  const navi = useNavigate();
  const { screenId } = useParams();
  const [seatType, setSeatTypes] = useState([]);
  const [seatAllocation, setSeatAllocation] = useState(JSON.parse(localStorage.getItem('SeatAllocation')) || null);
  const [isRefactorNeeded, setIsRefactorNeeded] = useState(false);

  useEffect(() => {
    if (!seatAllocation) {
      import('../../../SeatAllocation')
        .then((module) => {
          setSeatAllocation(module.default);
          localStorage.setItem('SeatAllocation', JSON.stringify(module.default));
        })
        .catch((error) => {
          console.error('Error loading seat allocation:', error);
        });
    }

    const fetchSeatTypes = async () => {
      try {
        const resp = await myaxios.get('theater/SeatTypeFetch/ForSeating/');
        setSeatTypes(resp.data);
      } catch (error) {
        console.error('Error fetching seat types:', error);
      }
    };

    fetchSeatTypes();
  }, [seatAllocation]);

  useEffect(() => {
    if (seatAllocation && isRefactorNeeded) {
      HandleRefactor();
      setIsRefactorNeeded(false);
    }
  }, [isRefactorNeeded, seatAllocation]);

  const UpdateRowValue = (row, e) => {
    const { value } = e.target;
    const updatedSeatAllocation = {
      ...seatAllocation,
      [row]: { ...seatAllocation[row], type: value }
    };
    setSeatAllocation(updatedSeatAllocation);
    localStorage.setItem('SeatAllocation', JSON.stringify(updatedSeatAllocation));
  };

  const updateSeatValue = (row, seat) => {
    const seatData = seatAllocation[row].seats[seat];
    const updatedSeatData = {
      ...seatData,
      is_freeSpace: !seatData.is_freeSpace,
      name: seatData.is_freeSpace ? `${row}${seat}` : ' '
    };

    const updatedRowData = {
      ...seatAllocation[row],
      seats: {
        ...seatAllocation[row].seats,
        [seat]: updatedSeatData
      }
    };

    const updatedSeatAllocation = {
      ...seatAllocation,
      [row]: updatedRowData
    };

    setSeatAllocation(updatedSeatAllocation);
    localStorage.setItem('SeatAllocation', JSON.stringify(updatedSeatAllocation));
    setIsRefactorNeeded(true);
  };

  const HandleRefactor = () => {
    const updatedSeatAllocation = { ...seatAllocation };

    Object.keys(updatedSeatAllocation).forEach((row) => {
      let Counter = 1;
      Object.keys(updatedSeatAllocation[row].seats).forEach((seat) => {
        if (!updatedSeatAllocation[row].seats[seat].is_freeSpace) {
          updatedSeatAllocation[row].seats[seat].name = `${row}${Counter}`;
          Counter++;
        }
      });
    });

    setSeatAllocation(updatedSeatAllocation);
    localStorage.setItem('SeatAllocation', JSON.stringify(updatedSeatAllocation));
  };

  const HandleReset = () => {
    console.log("Resetting seat allocation");
    localStorage.removeItem('SeatAllocation');
    setSeatAllocation(null);
  };

  const validateSeatTypes = () => {
    let isValid = true;
    Object.keys(seatAllocation).forEach((row) => {
      const rowData = seatAllocation[row];
      console.log(rowData.type)
      if (!rowData.type || rowData.type === "None") {
        isValid = false;
        toast.warning(`Please select a seat type for row ${row}`);
      }
    });
  
    return isValid;
  };

  const saveSeats = async () => {
    if (!validateSeatTypes()) return; 

    try {
      const resp = await myaxios.post('theater/SeatAllocationCreateApi/', { screen: parseInt(screenId), seat_allocation: seatAllocation });
      if (resp.status === 201) {
        toast.success('The seats have been saved successfully');
        HandleReset();
        if (window.history.length > 1) {
          navi(-1);
        }
        
      }
    } catch (error) {
      console.error('Error saving seat allocation:', error);
    }
  };

  useEffect(() => {
    if (seatAllocation) {
      setIsRefactorNeeded(true);
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container">
        <AsideBar />
        <NavBar />
        <div className="seats">
          <button className="refactor-button" onClick={HandleReset}>Reset</button>
          {seatAllocation ? (
            Object.keys(seatAllocation).map((row) => (
              <div key={row} className="seats__row">
                <div className="seats__row-options">
                  <p className="seats__row-title">{row} - {seatAllocation[row].type}</p>
                  <select name="rowVal" value={seatAllocation[row].type} onChange={(e) => UpdateRowValue(row, e)}>
                    <option>Select Seat Type</option>
                    {seatType.map((seat) => (
                      <option key={seat.id} value={seat.name}>{seat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="seats__row-seats">
                  {Object.keys(seatAllocation[row].seats).map((seat) => {
                    const seatData = seatAllocation[row].seats[seat];
                    const seatClass = seatData.is_freeSpace
                      ? 'seats__row-seats__seat--free-space'
                      : seatData.status === 'available'
                        ? 'seats__row-seats__seat--available'
                        : 'seats__row-seats__seat--booked';
                    return (
                      <button
                        onClick={() => updateSeatValue(row, seat)}
                        key={seat}
                        className={`seats__row-seats__seat ${seatClass}`}
                      >
                        {seatData.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div>Loading seat allocation...</div>
          )}
        </div>
        <button className='save-button' onClick={saveSeats}>Save Seat Allocation</button>
      </div>
    </Suspense>
  );
}

export default Seats;
