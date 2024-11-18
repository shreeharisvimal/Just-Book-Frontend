import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LanguageUtils } from '../../../Utils/LanguageUtils';
import axios from '../../../axios';
import './Show.scss';
import './show.css';
import { useSelector } from 'react-redux';

const NavBar = lazy(() => import('../../../Components/UserSide/NavBar/Navbar'));

function Show() {
    const navigate = useNavigate();
    const City = useSelector((state)=> state.location_details)
    const [shows, setShows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const { movieId } = useParams();

    const ShowFetch = async () => {
        try {
            const resp = await axios.get(`/show/ShowFetchWIthMovie/${movieId}/`);
            if (resp.status === 200) {
                const sortedShows = resp.data.sort((a, b) => new Date(a.show_date) - new Date(b.show_date));
                const filteredShows = sortedShows.filter(show =>
                   show.theater.city.toUpperCase() === City.city.toUpperCase()
                );
                setShows(filteredShows);
                toast.dismiss();
                if(!filteredShows[0]){
                    toast.warning("No Shows Available for this location")
                }
            }
        } catch (error) {
            console.log(error);
            toast.dismiss();
        }
    };

    useEffect(() => {
        if (movieId) {
            ShowFetch();
        }
    }, [movieId, City]);

    // Group shows by theater
    const groupedShowsByTheater = shows.reduce((acc, show) => {
        const theaterName = show.theater.theater_name;
        if (!acc[theaterName]) {
            acc[theaterName] = {
                details: show.theater,
                shows: [],
            };
        }
        acc[theaterName].shows.push(show);
        return acc;
    }, {});

    const getDayAndMonth = (dateString) => {
        const date = new Date(dateString);
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
        const datemy = date.getDate();
        const day = days[date.getDay()];
        const month = months[date.getMonth()];
        return { day, month, datemy };
    };

    const filteredShows = selectedDate ? shows.filter(show => {
        const showDate = new Date(show.show_date);
        const selectedDateObj = new Date(selectedDate);
        return showDate.toDateString() === selectedDateObj.toDateString();
    }) : shows;

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const uniqueDates = Array.from(new Set(shows.map(show => show.show_date)));

    const BookTicket=(screen, show)=>{
        navigate(`SeatingPage/${screen}/${show}/`)
    };
    return (
        <Suspense fallback={<div>Loading..........</div>}>
            <div className="show">
                <NavBar />
                {shows.length > 0 && (
                    <div className="show__container">
                        <div className="show__header">
                            <span className="show__movie-title">{shows[0].movie.title} - {LanguageUtils(shows[0].movie.language)}</span>
                        </div>
                        <div className="show__content">
                            <div className="show__dates">
                                {/* Render unique dates as buttons */}
                                {uniqueDates.map((date, index) => {
                                    const { day, month, datemy } = getDayAndMonth(date);
                                    return (
                                        <button
                                            key={index}
                                            className={`show__item show__date-button ${selectedDate === date ? 'selected' : ''}`}
                                            onClick={() => handleDateClick(date)}
                                        >
                                            <li className="show__item">
                                                <div className="show__item-day">{day}</div>
                                                <div className="show__item-date">{datemy}</div>
                                                <div className="show__item-month">{month}</div>
                                            </li>
                                        </button>
                                    );
                                })}
                            </div>
                            <hr />
                            {/* Render filtered shows based on selected date */}
        
                            {/* Render grouped shows by theater for selected date */}
                            {Object.keys(groupedShowsByTheater).map((theaterName, index) => (
                                <div key={index}>
                                    {groupedShowsByTheater[theaterName].shows.some(show => show.show_date === selectedDate) && (
                                        <div className="theater__item">
                                            <div className="theater__info">
                                            <h4 className="theater__item_name"><strong>{theaterName.toUpperCase()}</strong></h4>
                                                <p className="theater__item-description">
                                                    {groupedShowsByTheater[theaterName].details.email} <br />
                                                    {groupedShowsByTheater[theaterName].details.phone}, <br />
                                                    {/* {groupedShowsByTheater[theaterName].details.description} <br /> */}
                                                </p>
                                            </div>  
                                            <div className="theater__shows">
                                                {groupedShowsByTheater[theaterName].shows.map((show, idx) => (
                                                    show.show_date === selectedDate && (
                                                        <div className="showbtn" key={idx} onClick={()=>BookTicket(show.screen.id, show.id)}>
                                                            <i class="animation"></i>   
                                                            <div className="theater__shows-item-time">Time: {show.show_time}</div>
                                                            <div className="theater__shows-item-price">Price: {show.price}</div>
                                                            <div className="theater__shows-item-screen">Screen: {show.screen.name}</div>
                                                            <i class="animation"></i>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Suspense>
    );
}

export default Show;
