import React, { useEffect, useState, lazy, Suspense } from 'react';
import './VerifyPage.scss';
import { imageUrl } from '../../../Tmdb';
import { useParams } from 'react-router-dom';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';

const NavBar = lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));

function VerifyPage() {
    const { qr_code_id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [showUsedMessage, setShowUsedMessage] = useState(false);
    const accessToken = localStorage.getItem('AccessToken');

    const fetchTickets = async () => {
        try {
            const response = await axios.get(`booking/FetchTickets/verify/${qr_code_id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            if (response.status === 200) {
                setTicket(response.data[0]);
                setShowUsedMessage(false); 
            } else if (response.status === 226) {
                setTicket(response.data[0]);
                setShowUsedMessage(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const verifyTheEntry = async () => {
        try {
            const response = await axios.put(`booking/FetchTickets/verify/${qr_code_id}/`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            if (response.status === 200) {
                toast.success("The ticket has been verified");
                // Optionally, you can update the ticket status in state here if needed.
            }

        } catch (error) {
            console.error('Error verifying ticket:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [qr_code_id]); 

    return (
        <Suspense fallback={<div>Loading NavBar...</div>}>
                <NavBar />
            <div className="verify-page">
                <div className="ticket-details">
                    {ticket ? (
                        <>
                            <h2>Ticket Details</h2>
                            <div className="ticket-details__qr">
                                <img src={`${imageUrl}${ticket.booking.show_details.movie.poster_path}`} alt="Movie Poster" />
                            </div>
                            <div className="ticket-details__info">
                                <p><strong>Movie Name:</strong> {ticket.booking.show_details.movie.title}</p>
                                <p><strong>Screen Number:</strong> {ticket.booking.show_details.screen.name}</p>
                                <p><strong>Theater Name:</strong> {ticket.booking.show_details.theater.theater_name}</p>
                                <p><strong>Show Date:</strong> {ticket.booking.show_details.show_date}</p>
                                <p><strong>Show Time:</strong> {ticket.booking.show_details.show_time}</p>
                                <p><strong>Total Seats:</strong> {ticket.booking.no_of_seats}</p>
                                <p><strong>Seats:</strong> {ticket.booking.seats_name}</p>
                                <p><strong>Order ID:</strong> {ticket.booking.order_id}</p>
                                <p><strong>Booking Status:</strong> {ticket.booking.booking_status}</p>
                                <p><strong>Payment Status:</strong> {ticket.booking.payment_details.payment_status}</p>
                                <p><strong>Amount Paid:</strong> {ticket.booking.payment_details.amount_paid}</p>
                            </div>
                            {!showUsedMessage && (
                                <button onClick={verifyTheEntry}>Verify Entry</button>
                            )}
                            {showUsedMessage && (
                                <div className="ticket-details__message">The ticket has already been used.</div>
                            )}
                        </>
                    ) : (
                        <div>Loading ticket details...</div>
                    )}
                </div>
            </div>
        </Suspense>
    );
}

export default VerifyPage;
