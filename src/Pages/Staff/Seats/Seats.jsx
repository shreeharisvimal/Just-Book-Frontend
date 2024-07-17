import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myaxios from '../../../Admin_axios';
import './Seats.scss';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AsideBar = lazy(() => import('../../../Components/StaffSide/AsideBar/AsideBar'));
const NavBar = lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));

function Seats() {
  const navi = useNavigate();
  const { screenId } = useParams();
  console.log(screenId)
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
        const resp = await myaxios.get('theater/SeatTypeFetch/');
        setSeatTypes(resp.data);
        // setSeatTypeFetched(true);
      } catch (error) {
        console.error('Error fetching seat types:', error);
      }
    };

    // if (!seatAllocation && !seatTypeFetched) {
      fetchSeatTypes();
    // }
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
    setIsRefactorNeeded(true)

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

  const saveSeats = async () => {
    try {
      const resp = await myaxios.post('theater/SeatAllocationCreateApi/', { screen: parseInt(screenId), seat_allocation: seatAllocation });
      console.log('Saved seat allocation:', resp.data);
      if(resp.status === 201){
        toast.success('The seat have been saved succefully')
        HandleReset();
        navi(-1)
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
