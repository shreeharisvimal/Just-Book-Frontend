import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Success.module.scss';
import axios from '../../../Admin_axios';

const Success = () => {
    const [ticket, setTicket] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchTicket();
    }, []);

    const fetchTicket = async () => {
        try {
            const resp = await axios.get(`booking/FetchTickets/${id}/`);
            if (resp.status === 200) {
                console.log(resp.data);
                setTicket(resp.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.successContainer}>
            <div className={styles.animationWrapper}>
                <div className={styles.checkmarkCircle}>
                    <div className={styles.background}></div>
                    <div className={`${styles.checkmark} ${styles.draw}`}></div>
                </div>
            </div>
            <h1>Payment Successful!</h1>
            <p>Your booking has been confirmed. Enjoy your movie!</p>
            <div className={styles.ticketInfo}>
                <div className={styles.ticket}>
                    <div className={styles.ticketHeader}>
                        <h2>JustBook</h2>
                    </div>
                    {ticket && (
                        <div className={styles.ticketBody}>
                            <p><strong>Movie:</strong> {ticket.Movie}</p>
                            <p><strong>Theater:</strong> {ticket.Theater}</p>
                            <p><strong>Screen:</strong> Screen {ticket.Screen}</p>
                            <p><strong>Seats:</strong> {ticket.Seats}</p>
                            <p><strong>ShowDate:</strong> {ticket.Date}</p>
                            <p><strong>Showtime:</strong> {ticket.Time}</p>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={() => window.location.href = '/'}>Back to Home</button>
        </div>
    );
};

export default Success;
