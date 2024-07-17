import React, { useEffect, useState } from 'react';
import './Ticket.scss';
import axios from '../../../axios';

function Tickets() {
    const [tickets, setMyTickets] = useState([]);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('AccessToken');
            const res = await axios.get(`booking/FetchTickets/`, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                console.log(res.data);
                setMyTickets(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const Download_pdf=async(id)=>{
        console.log(id)
        try{
            const token = localStorage.getItem('AccessToken');
            const response = await axios.get(`booking/download/pdf/${id}/`, {
                headers:{
                    'content-type': 'multipart/form-data',
                    'authorization': `Bearer ${token}`,
                },
                responseType: 'blob',
              });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        }catch(error){
            console.log(error);
        };
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div className='ticketComponent'>
            <div className='ticketComponent__container'>
                {tickets && tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                        <div key={index} className="ticket">
                            <div className={`ticket__header ${ticket.qr_code.used ? 'true' : 'false'}`}>
                                <h3 className="ticket__movie-title">{ticket.booking.show_details.movie.title}</h3>
                            </div>
                            <div className="ticket__body">
                                {ticket.qr_code.used && <h4 className='ticket__Used'>USED</h4>}
                                <img className={`ticket__qr-code ${ticket.qr_code.used ? 'true' : 'false'}`} src={ticket.qr_code.qr_code_image} alt="QR Code" />
                                <div className="ticket__details">
                                    <p><strong>Booking Status:</strong> {ticket.booking.booking_status}</p>
                                    <p><strong>Show Date:</strong> {ticket.booking.show_details.show_date}</p>
                                    <p><strong>Show Time:</strong> {ticket.booking.show_details.show_time}</p>
                                    <p><strong>No. of Seats:</strong> {ticket.booking.no_of_seats}</p>
                                    <p><strong>Seats:</strong> {ticket.booking.seats_name}</p>
                                    {
                                        !ticket.qr_code.used &&
                                        <span><button onClick={()=> Download_pdf(ticket.id)}>PDF</button> OR <button>PNG</button></span>

                                    }
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tickets available</p>
                )}
            </div>
        </div>
    );
}

export default Tickets;
