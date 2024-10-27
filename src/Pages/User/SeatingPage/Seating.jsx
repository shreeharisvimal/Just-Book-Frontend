import React, { useEffect, useState, lazy, Suspense, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../axios';
import './Seating.scss';
import './seating.css';
import { set_Booking } from '../../../Redux/Booking/BookSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import seatCheckUpdate from './seatCheckUpdate';

const NavBar = lazy(() => import('../../../Components/UserSide/NavBar/Navbar'));

function Seating() {
  const { showId } = useParams();
  const [normalPrice, setNormalPrice] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [fetchData, setFetchData] = useState(null);
  const [seatAllocation, setSeatAllocation] = useState(null);
  const [seatTypes, setSeatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [bookingSeats, setBookingSeats] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [componentKey, setComponentKey] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wsRef = useRef(null); 

  const resetState = () => {
    setNormalPrice(null);
    setTotalAmount(0);
    setFetchData(null);
    setSeatAllocation(null);
    setSeatTypes([]);
    setSelectedSeats({});
    setBookingSeats([]);
    setIsDataFetched(false);
  };

  useEffect(() => {
    resetState();
  }, [componentKey]); 

  const reloadComponent = () => {
    setComponentKey(prevKey => prevKey + 1);
  }; 

  const calculatePriceWithPercentage = (percentage, price) => {
    const percentageAmount = parseInt(price) * (parseInt(percentage) / 100);
    const totalPrice = parseInt(price) + percentageAmount;
    return Math.round(totalPrice);
  };

  const handleSelecting = useCallback((row, seat, seatName ,updatedSeatAllocation) => {
    const updatedSelectedSeats = { ...selectedSeats };

    if (updatedSelectedSeats[row]) {
      if (updatedSelectedSeats[row].includes(seat)) {
        updatedSelectedSeats[row] = updatedSelectedSeats[row].filter(s => s !== seat);
        if (updatedSelectedSeats[row].length === 0) {
          delete updatedSelectedSeats[row];
        }
      } else {
        updatedSelectedSeats[row] = [...updatedSelectedSeats[row], seat];
      }
    } else {
      updatedSelectedSeats[row] = [seat];
    }

    setSelectedSeats(updatedSelectedSeats);
    setBookingSeats(prev => {
      const updatedSeats = new Set(prev); 
      updatedSeats.add(seatName); 
      return [...updatedSeats]; 
    });

    let newTotalAmount = 0;
    Object.keys(updatedSelectedSeats).forEach(r => {
      updatedSelectedSeats[r].forEach(s => {
        const seatPrice = seatTypes.find(type => type.name === seatAllocation[r].type)?.price_multi;
        const seatAmount = calculatePriceWithPercentage(seatPrice, normalPrice);
        newTotalAmount += seatAmount;
      });
    });

    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        action: 'seat_update',
        data: {
          seat_data: updatedSeatAllocation
        }
      }));
    }

    setTotalAmount(Math.round(newTotalAmount));
    handleShowBook(newTotalAmount);
  }, [selectedSeats, bookingSeats, seatTypes, normalPrice, seatAllocation]);

  const handleShowBook = (newTotalAmount) => {
    if (newTotalAmount <= 0) {
      setSelectedSeats({});
    }
  };

  useEffect(() => {
    const wsUrl = `${process.env.REACT_APP_BACKEND_URL}ws/seats/${showId}/`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newSeatsAfterUpdate = seatCheckUpdate(data.seat_data);
      setSeatAllocation(newSeatsAfterUpdate);
    };

    ws.onclose = () => {
      // console.error('WebSocket closed unexpectedly');
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [showId]);

  const fetchSeats = async () => {
    try {
      const [showResp, seatTypeResp] = await Promise.all([
        axios.get(`/show/ShowFetchWIthid/${showId}/`),
        axios.get(`theater/SeatTypeFetch/`)
      ]);

      if (showResp.status === 200 && seatTypeResp.status === 200) {
        const showData = showResp.data[0];
        setFetchData(showData);
        setSeatAllocation(showData.seatAllocation);
        setSeatTypes(seatTypeResp.data);
        const val = calculatePriceWithPercentage(showData.screen.screen_type.price_multi, showData.price);
        setNormalPrice(val);
        setIsDataFetched(true);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  useEffect(() => {
    if (isDataFetched && !isReloading) {
      setIsReloading(true);
    }
  }, [isDataFetched, isReloading]);

  const BookTicket = () => {
    try {
      dispatch(
        set_Booking({
          bookingSeats: bookingSeats,
          selectedSeats: selectedSeats,
          TotalAmount: totalAmount,
          SeatAllocation: seatAllocation,
          showId: showId,
        })
      );
      navigate('/BookTicket/');
    } catch (error) {
      console.log(error);
    }
  };


  const getSeatClass = useCallback((seatData) => {
    if (seatData.status === 'booked') return 'seats__row-seats__seat--booked';
    if (seatData.is_freeSpace) return 'seats__row-seats__seat--free-space';
    if (seatData.holdedseat) {
      if (Array.isArray(bookingSeats) && bookingSeats.includes(seatData.name)) {
        return 'seats__row-seats__seat--selected';
      }
      if (seatData.user === localStorage.getItem('user_id') && localStorage.getItem('user_id')) {
        return 'seats__row-seats__seat--available';
      }
      if (seatData.user && localStorage.getItem('user_id') !== seatData.user) {
        return 'seats__row-seats__seat--holdedseat';
      }
      return 'seats__row-seats__seat--holdedseat';
    }
    if (seatData.status === 'selected') return 'seats__row-seats__seat--selected';
    if (seatData.status === 'available') return 'seats__row-seats__seat--available';
    return 'seats__row-seats__seat--booked';
  }, [bookingSeats]);


  const updateSeatValue = useCallback((row, seat, seatName) => {
    const seatData = seatAllocation[row].seats[seat];
    if (!seatData.is_freeSpace) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const timeString = `${hours}${minutes}${seconds}`;

      const updatedSeatData = {
        ...seatData,
        status: seatData.status === 'selected' ? 'available' : 'selected',
        holdedseat:!seatData.holdedseat,
        user:localStorage.getItem('user_id') || seatData.user,
        hold_time: seatData.status === 'available' ? timeString : '',
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

      let count = 0;
      Object.keys(selectedSeats).forEach(r => {
        count += selectedSeats[r].length;
      });

      if (count < 10 || (count === 10 && selectedSeats[row]?.includes(seat))) {
        setSeatAllocation(updatedSeatAllocation);
        handleSelecting(row, seat, seatName, updatedSeatAllocation);
      } else {
        toast.warning('You can select a maximum of 10 seats');
      }
    }
  }, [seatAllocation, selectedSeats, handleSelecting]);

  if (loading) {
    return <div className="seats">Loading seat allocation...</div>;
  }

  if (error) {
    return <div className="seats">{error}</div>;
  }

  return (
    <div key={componentKey} className='main'>
      <Suspense fallback={<div>Loading Navbar...</div>}>
        <NavBar />
      </Suspense>
      <div className="seats">
        <span className="normal-price">Normal Price: {normalPrice}rs</span>
        <br />
        <ul className="seat-types">
          {seatTypes.map((type, index) => (
            <li key={index}>{type.name} - {calculatePriceWithPercentage(type.price_multi, normalPrice)}</li>
          ))}
        </ul>
        <span className='Details'>
          <span className="total-amount">Total Amount: {totalAmount}rs</span>
          <div className="Dummy">
            {[['available', 'Available'], ['selected', 'Selected'], ['booked', 'Booked']].map(([status, label]) => (
              <React.Fragment key={status}>
                <span className={`Dummy-${status}`}>A11</span>
                <label>{label}</label>
                <br />
              </React.Fragment>
            ))}
          </div>
        </span>

        {Object.keys(selectedSeats).length > 0 && (
          <span className='book'>
            <button className="book learn-more" onClick={BookTicket}>Book The Seats</button>
          </span>
        )}

        {seatAllocation ? (
          Object.keys(seatAllocation).map((row) => (
            <div key={row} className="seats__row">
              <div className="seats__row-options">
                <p className="seats__row-title">{row} - {seatAllocation[row].type}</p>
              </div>
              <div className="seats__row-seats">
                {Object.entries(seatAllocation[row].seats).map(([seat, seatData]) => {
                  const seatClass = getSeatClass(seatData);
                  const isBooked = seatClass === 'seats__row-seats__seat--booked';

                  return (
                    <button
                      onClick={!isBooked ? () => updateSeatValue(row, seat, seatData.name) : undefined}
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
          <p>No seat allocation data available</p>
        )}
      </div>
    </div>
  );
}

export default Seating;
