import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../axios';
import './Seating.scss';
import './seating.css';
import { set_Booking } from '../../../Redux/Booking/BookSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
const NavBar = lazy(() => import('../../../Components/UserSide/NavBar/Navbar'));

function Seating() {

  const { screenId, showId } = useParams();
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calculatePriceWithPercentage = (percentage, price) => {
    const percentageAmount = parseInt(price) * (parseInt(percentage) / 100);
    const totalPrice = parseInt(price) + percentageAmount;
    return Math.round(totalPrice);
  };

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

  const handleSelecting = (row, seat, seatName) => {
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
    setBookingSeats(prev => [...prev, seatName]);
    console.log(bookingSeats);

    let newTotalAmount = 0;
    Object.keys(updatedSelectedSeats).forEach(r => {
      updatedSelectedSeats[r].forEach(s => {
        const seatPrice = seatTypes.find(type => type.name === seatAllocation[r].type)?.price_multi;
        const seatAmount = calculatePriceWithPercentage(seatPrice, normalPrice);
        newTotalAmount += seatAmount;
      });
    });

    setTotalAmount(Math.round(newTotalAmount));
    handleShowBook(newTotalAmount);
  };

  const handleShowBook = (newTotalAmount) => {
    if (newTotalAmount <= 0) {
      setSelectedSeats({});
    }
  };

  const updateSeatValue = (row, seat, seatName) => {
    const seatData = seatAllocation[row].seats[seat];
    if (!seatData.is_freeSpace) {
      const updatedSeatData = {
        ...seatData,
        status: seatData.status === 'selected' ? 'available' : 'selected'
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
        handleSelecting(row, seat, seatName);
      }else{
        toast.warning('You can select maximum 10 seats');
      }

    }
  };

  if (loading) {
    return <div className="seats">Loading seat allocation...</div>;
  }

  if (error) {
    return <div className="seats">{error}</div>;
  }

  return (
    <div className='main'>
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
            <span className="Dummy-available">A11</span>
            <label htmlFor="">Available</label>
            <br />
            <span className="Dummy-selected">A11</span>
            <label htmlFor="">Selected</label>
            <br />
            <span className="Dummy-booked">B11</span>
            <label htmlFor="">Booked</label>
          </div>
        </span>

        {Object.keys(selectedSeats).length > 0 && (
          <span className='book'>
          <button className="book learn-more" onClick={BookTicket}> Book The Seats
        </button>
          </span>
        )}

        {seatAllocation ? (
          Object.keys(seatAllocation).map((row) => (
            <div key={row} className="seats__row">
              <div className="seats__row-options">
                <p className="seats__row-title">{row} - {seatAllocation[row].type}</p>
              </div>
              <div className="seats__row-seats">
                {Object.keys(seatAllocation[row].seats).map((seat) => {
                  const seatData = seatAllocation[row].seats[seat];
                  const seatClass = seatData.status === 'selected'
                    ? 'seats__row-seats__seat--selected'
                    : seatData.is_freeSpace
                    ? 'seats__row-seats__seat--free-space'
                    : seatData.status === 'available'
                    ? 'seats__row-seats__seat--available'
                    : 'seats__row-seats__seat--booked';
                    const isBooked = seatClass === 'seats__row-seats__seat--booked';
                  return (
                    <button
                      onClick={!isBooked ? () => updateSeatValue(row, seat, seatData.name):undefined}
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
          <div className="seats">No seat allocation available</div>
        )}
      </div>
    </div>
  );
}

export default Seating;
