import './seating.css';
import './Seating.scss';
import axios from '../../../axios';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import seatCheckUpdate from './seatCheckUpdate';
import { useNavigate, useParams } from 'react-router-dom';
import { set_Booking } from '../../../Redux/Booking/BookSlice';
import React, { useEffect, useState, lazy, Suspense, useCallback, useRef, useMemo } from 'react';

const NavBar = lazy(() => import('../../../Components/UserSide/NavBar/Navbar'));

const MAX_SEATS = 10;
const RECONNECT_DELAY = 5000;
const DEBOUNCE_DELAY = 300;

class SeatingErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Seating Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong. Please refresh the page.</h2>
        </div>
      );
    }
    return this.props.children;
  }
}


function Seating() {

  const reconnectTimeoutRef = useRef(null);
  const { showId } = useParams();
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [normalPrice, setNormalPrice] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [seatAllocation, setSeatAllocation] = useState(null);
  const [seatTypes, setSeatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [bookingSeats, setBookingSeats] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wsRef = useRef(null); 




  const calculatePriceWithPercentage = (percentage, price) => {
    const percentageAmount = parseInt(price) * (parseInt(percentage) / 100);
    const totalPrice = parseInt(price) + percentageAmount;
    return Math.round(totalPrice);
  };

  const handleSelecting = useCallback((row, seat, seatName ,updatedSeatAllocation) => {

    if (!localStorage.getItem('user_id')){
      toast.warning("Please login To Select Seats");
      return;
    }

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


    if (wsRef.current && wsRef.current.readyState) {
      wsRef.current.send(JSON.stringify({
        action: 'seat_update',
        data: {
          seat_data: updatedSeatAllocation
        }
      }));
    }

    debouncedSeatUpdate(updatedSeatAllocation);

    setTotalAmount(Math.round(newTotalAmount));
    handleShowBook(newTotalAmount);
  }, [selectedSeats, bookingSeats, seatTypes, normalPrice, seatAllocation]);

  const handleShowBook = (newTotalAmount) => {
    if (newTotalAmount <= 0) {
      setSelectedSeats({});
    }
  };

  window.addEventListener("beforeunload", (event) => {

    event.preventDefault();
    event.returnValue = ""; 
});

  document.addEventListener("keydown", (event) => {
    if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
      event.preventDefault(); 
    }
  });



  const connectWebSocket = useCallback(() => {
    try {
      const wsUrl = `${process.env.REACT_APP_BACKEND_URL}ws/seats/${showId}/`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            toast.error(data.error);
            return;
          }
          if (data.seat_data) {
            setSeatAllocation(seatCheckUpdate(data.seat_data));
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, RECONNECT_DELAY);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (error) {
      setWsStatus('error');
      console.error('WebSocket connection error:', error);
    }
  }, [showId]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  const debouncedSeatUpdate = useMemo(
    () => debounce((updatedSeatAllocation) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: 'seat_update',
          data: { seat_data: updatedSeatAllocation }
        }));
      }
    }, DEBOUNCE_DELAY),
    []
  );

  const fetchSeats = async () => {
    try {
      const [showResp, seatTypeResp] = await Promise.all([
        axios.get(`/show/ShowFetchWIthid/${showId}/`),
        axios.get(`theater/SeatTypeFetch/`)
      ]);

      if (showResp.status === 200 && seatTypeResp.status === 200) {
        const showData = showResp.data[0];
        setSeatAllocation(showData.seatAllocation);
        setSeatTypes(seatTypeResp.data.results);
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
    if (seatData.status === 'booked' || seatData.status === 'Booked') return 'seats__row-seats__seat--booked';
    if (seatData.is_freeSpace) return 'seats__row-seats__seat--free-space';
    if (seatData.holdedseat) {
      if (Array.isArray(bookingSeats) && bookingSeats.includes(seatData.name)) {
        return 'seats__row-seats__seat--selected';
      }
      if (seatData.user === localStorage.getItem('user_id') && localStorage.getItem('user_id')) {
        return 'seats__row-seats__seat--holdedseat';
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

    if (!localStorage.getItem('user_id')){
      toast.warning("Please login To Select Seats");
      return;
    }

    const seatData = seatAllocation[row].seats[seat];
    if (!seatData.is_freeSpace && seatData.status !== 'Booked' && seatData.status !== 'booked') {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const timeString = `${hours}${minutes}${seconds}`;
      console.log(seatData)
      const updatedSeatData = {
        ...seatData,
        status: seatData.status === 'selected' ? 'available' : 'selected',
        holdedseat:!seatData.holdedseat,
        user:localStorage.getItem('user_id'),
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

      if (count < MAX_SEATS || (count === MAX_SEATS && selectedSeats[row]?.includes(seat))) {
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
    <SeatingErrorBoundary>

    <div  className='main'>
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
                    <span
                    key={seat}
                    className={`seats__row-seats__seat ${seatClass}`}
                    onClick={() => {
                      if (!isBooked) {
                        updateSeatValue(row, seat, seatData.name);
                      }
                    }}
                    >
                      {seatData.name}
                    </span>
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
    </SeatingErrorBoundary>
  );
}

export default Seating;
