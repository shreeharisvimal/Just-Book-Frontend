import React, { useEffect, useState } from 'react';
import './MovieDetails.scss';
import { UseMovieId } from '../../ContextApi/MovieIdContext';
import { MovieDetailsFetch } from '../../../Tmdb';
import { imageUrl } from '../../../Tmdb';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../axios';
import './booking.css'
import '../../../Wrappers/Loader.scss'

function MovieDetails() {
    const navigate = useNavigate();
    const { movieId } = UseMovieId();
    const [showMoviedetails, setshowmoviedetails] = useState(false)
    const [myMovieId, setMymovieId] = useState(localStorage.getItem("BookShowId"));
    const [SavedMovieId, setSavedMovieId] = useState(movieId || localStorage.getItem('MovieId'));
    const [myMovieDetails, setmyMovieDetails] = useState(null);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [showCatch, setCatch] = useState(false);
    const [showDetails, setShowDetails] = useState([]);
    const [shows, setShows] = useState([]);

    useEffect(() => {
        if (movieId) {
            localStorage.setItem('MovieId', movieId);
        }
    }, [movieId]);

    useEffect(() => {
        if (movieId) {
            ShowFetchAndArrangeScreen();
        }
    }, [movieId]); 

    const filterShows = (newShowDetails) => {
        const newShows = [...shows];
        newShowDetails.forEach((show) => {
            const screenTypeName = show.screen.screen_type.name;
            if (!newShows.includes(screenTypeName)) {
                newShows.push(screenTypeName);
            }
        });
        setShows(newShows);
    };

    const ShowFetchAndArrangeScreen = async () => {
        try {
            const resp = await axios.get(`/show/ShowFetchWIthMovie/${myMovieId}/`);
            if (resp.status === 200) {
                const newShowDetails = resp.data;
                setShowDetails(newShowDetails);
                filterShows(newShowDetails); 
            }
        } catch (error) {
            console.log(error);
        }
    };

    const BookTicket = () => {
        navigate(`/ShowsListing/${myMovieId}/`);
    };

    const MovieFetching = async () => {
        try {
            const response = await MovieDetailsFetch(SavedMovieId);
            if (response.status === 200) {
                setmyMovieDetails(response.data);
                setCast(response.data.credits.cast.filter(castMember => castMember.profile_path).slice(0, 6));
                setCrew(response.data.credits.crew.filter(crewMember => crewMember.profile_path).slice(0, 6));
            }
        } catch (error) {
            if (!showCatch) {
                toast.error("Couldn't fetch movie details due to network issue");
            }
            setCatch(true);
        }
    };

    useEffect(() => {
        MovieFetching();
        ShowFetchAndArrangeScreen();
        setTimeout(()=>{
            setshowmoviedetails(true)
        },3000)
    }, [SavedMovieId]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: false,
        centerMode: true, 
        centerPadding: '15%', 
        slidesToShow: 1, 
        slidesToScroll: 1,
    };

    if (showMoviedetails) {
        return (
            <div className='DetailsPage'>
                    <span className='DetailsPage__Rating' >
                    <img width="28" height="28" src="https://img.icons8.com/color/48/filled-star--v1.png" alt="filled-star--v1"/>  {myMovieDetails.vote_average} / 10
                    </span>
                <div className='DetailsPage__ShowDetails'>
                <h3>{shows}</h3>
                </div>
                <div className='DetailsPage__MovieDetails'>
                {myMovieDetails.genres.map((genre, index) => (
                    <h3 key={index} className='DetailsPage__MovieDetails__Genre'>
                        {genre.name}
                    </h3>
                    ))}
                </div>
                <div className='DetailsPage__OtherDetails'>
                    <h3>
                    Duration {myMovieDetails.runtime}m
                    Release Date {myMovieDetails.release_date}
                    </h3>
                </div>
                {/* <button className='DetailsPage__btn' onClick={BookTicket}>Book Now</button> */}
                <button className="fancy" onClick={BookTicket}>
                    <span className="text">Booking Now</span>
                    <span className="top-key"></span>
                    <span className="bottom-key-1"></span>
                    <span className="bottom-key-2"></span>
                </button>
                <div className='DetailsPage__main'>
                    {myMovieDetails.images.backdrops.length > 0 ? (
                        <Slider {...settings} className='DetailsPage__slider'>
                            {myMovieDetails.images.backdrops.map((image, index) => (
                                <div key={index}>
                                    <img
                                        src={`${imageUrl}${image.file_path}`}
                                        alt={`Backdrop ${index + 1}`}
                                        className='DetailsPage__image'
                                    />
                                </div>
                            ))}
                        </Slider>
                        ) : (
                                <img  src={`${imageUrl}${myMovieDetails.images.posters[2].file_path}`} className='DetailsPage__imageFake' alt="Default Backdrop" />
                        )}
                    
                    <div className='DetailsPage__poster'>
                        <img
                            src={`${imageUrl}${myMovieDetails.images.posters[0].file_path}`}
                            alt={`${myMovieDetails.title} Poster`}
                        />
                    </div>
                </div>
                <div className='DetailsPage__About'>
                    <h2>About Movie</h2>
                    <span className='DetailsPage__Overview'>{myMovieDetails.overview}</span>
                    <hr />
                </div>

                <div className='DetailsPage__Cast'>
                    <h2>Cast</h2>
                    {cast.map((member, index) => (
                        <div key={index} className='DetailsPage__CastItem'>
                            <img src={`${imageUrl}${member.profile_path}`} alt={member.name} />
                            <span className='DetailsPage__CastName'>{member.name}</span>
                            <span className='DetailsPage__CastCharacter'>{member.character}</span>
                        </div>
                    ))}
                    <hr />
                </div>

                <div className='DetailsPage__Crew'>
                    <h2>Crew</h2>
                    {crew.map((member, index) => (
                        <div key={index} className='DetailsPage__CastItem'>
                            <img src={`${imageUrl}${member.profile_path}`} alt={member.name} />
                            <span className='DetailsPage__CastName'>{member.name}</span>
                            <span className='DetailsPage__CastCharacter'>{member.department}</span>
                        </div>
                    ))}
                    <hr />
                </div>
            </div>
        );
    } else {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div className="loader"></div>
                  </div>;
    }
}

export default MovieDetails;
