import React, { lazy, Suspense, useEffect, useState } from 'react';
import axios from '../../../axios';
import { imageUrl } from '../../../Tmdb';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import useRazorpay from 'react-razorpay';
import { useNavigate } from 'react-router-dom';
import './BookingPage.scss';
import '../../../Wrappers/Loader.scss'
import './bookingPage.css'
import { LanguageUtils } from '../../../Utils/LanguageUtils';
const NavBar = lazy(() => import('../../../Components/UserSide/NavBar/Navbar'));

function BookingPage() {
    // const Razorpay = useRazorpay()
    const Book_details = useSelector((state) => state.Book_details);
    const user = useSelector((state) => state.auth_user);
    const [loading, setLoading] = useState(false);
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const movieID = localStorage.getItem('BookShowId')
    
    useEffect(() => {
        const handleBeforeUnload = (event) => {
          event.preventDefault();
          event.returnValue = ''; 
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

    const FetchMovie=async()=>{
        try{
            const resp = await axios.get(`movie/movieListFetchAPIView/${movieID}/`)
            if(resp.status === 200){
                setMovie(resp.data[0])
            }
        }catch(error){
            console.log(error);
        }
    };

    const RemoveLocalStorage =async()=>{
        localStorage.removeItem('TotalAmount')
        localStorage.removeItem('selectedSeats')
        localStorage.removeItem('MovieId')
        localStorage.removeItem('rzp_checkout_anon_id')
        localStorage.removeItem('BookShowId')
    };
    
    const UpdateSeatStatus = async () => {
        const UserSeats = Book_details.selectedSeats;
        try {
            const showresp = await axios.get(`show/ShowFetchWIthid/${Book_details.showId}/`);
            const seats = showresp.data[0].seatAllocation;
            Object.keys(UserSeats).forEach(row => {
                if (UserSeats[row] && Array.isArray(UserSeats[row])) {
                    UserSeats[row].forEach(seat => {
                        if (seats[row] && seats[row].seats && seats[row].seats[seat]) {
                            seats[row].seats[seat].status = 'booked';
                        } else {
                            console.warn(`Seat ${seat} in row ${row} does not exist in the seats object.`);
                        }
                    });
                } else {
                    console.warn(`Row ${row} does not exist or is not an array in UserSeats.`);
                }
            });
           const resp =  await axios.put(`show/UpdateShowSeats/${Book_details.showId}/`, { seatAllocation: seats });
            if(resp.status === 200){
                toast.success("The purchase has been completed");
                return true
            }
        } catch (error) {
            console.log(error);
        }
    };

    const initiatePayment = async () => {
        setLoading(true);
        const formData = {
            amount_paid: Book_details.TotalAmount,
        };
        try {
            const AccessToken = localStorage.getItem('AccessToken')
            const response = await axios.post("booking/RazorPay/", formData, {
                headers: {
                    Authorization: `Bearer ${AccessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json', 
                },
            });

            if (response.status === 200) {
                const val = {
                    pay_id: response.data.razorpay_payment_id,
                    no_of_seats: Book_details.bookingSeats.length,
                    seats_name: Book_details.bookingSeats.join(', '),
                    show_details: Book_details.showId,
                };
                const options = {
                    key: "rzp_test_WOCu4tYSeELze1",
                    amount:response.data.payment.amount_paid,
                    currency: "INR",
                    name: "Just Book",
                    description: "Thank you for Using Justbook",
                    order_id: response.data.razorpay_payment_id,
                    image: "imgs/favicon.png",
                    handler: async (response) => {
                        try {
                            const resp = await axios.post("booking/BookingHandler/", val, {
                                headers: {
                                    Authorization: `Bearer ${AccessToken}`,
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json', 
                                },
                            });
                            if (resp.status === 201) {
                                await RemoveLocalStorage();
                                await UpdateSeatStatus();
                                console.log(resp)
                                const id = resp.data.ticket
                                setTimeout(() => {
                                    navigate(`/SuccessPage/${id}/`);
                                  }, 2000);
                            } else {
                                toast.error('Error completing the purchase');
                            }
                        } catch (error) {
                            toast.error('Error completing the purchase');
                        }
                    },
                    prefill: {
                        name: user.first_name,
                        email: "youremail@example.com",
                        contact: "9999999999",
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };

                const rzp1 = new window.Razorpay(options);

                rzp1.on('payment.failed', (response) => {
                    toast.error(`Payment failed: ${response.error.description}`);
                });

                rzp1.open();
            } else {
                toast.error('Cannot book. Check if you are logged in.');
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            toast.error('Payment initiation failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FetchMovie();
    }, []);

    return (
        <Suspense fallback={<div className="loader"></div>}>
            <div className='main'>
                <NavBar />
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', }}>
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                    movie &&

                        <div className='Card'>
                        <img className='image_background' src={`${imageUrl}${movie.background_path}`} alt="" />
                        <div className="checkout-page">
                        <h2>Checkout</h2>
                        <div className="booking-details">
                        <h4>Booking Details</h4>
                                <p>{movie.title} - {LanguageUtils(movie.language)}</p>
                                <p>Seats: {Book_details.bookingSeats ? Book_details.bookingSeats.join(', ') : 'N/A'}</p>
                                <p>Total Amount: ₹{Book_details.TotalAmount}</p>
                            </div>
                            <div className="payment-methods">
                                <h4>Select Payment Method</h4>
                                <div className="tabs">
                                    <button className={`tab ${paymentMethod === 'razorpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('razorpay')}>Razorpay</button>
                                </div>
                                {paymentMethod === 'razorpay' && (
                                    <div className="razorpay-details">
                                    </div>
                                )}
                            </div>
                            {/* <button className="pay-now" onClick={initiatePayment}>Pay Now</button> */}
                            <button className="Btn" onClick={initiatePayment}>
                                Pay
                                <svg className="svgIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                                </button>
                            </div>
                            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                            </div>
                        
                        )}
                        </div>
                        </Suspense>
                    );
}

export default BookingPage;
