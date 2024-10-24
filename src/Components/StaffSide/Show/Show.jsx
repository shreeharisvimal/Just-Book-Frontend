import React, { useEffect, useState } from 'react';
import './Show.scss';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function Show({setShowCreate}) {
    const user = useSelector((state) => state.auth_user);
    const INIT_STATE = {
        movie: '',
        theater: '',
        show_date: '',
        show_time: '',
        price: '',  
        screen: '',
    };
    const [FormData, setFormData] = useState(INIT_STATE);
    const [Movies, setMovies] = useState([]);
    const [Screens, setScreens] = useState([]);
    const [Theaters, setTheaters] = useState([]);

    useEffect(() => {
        FetchDatas();
    }, []);

    useEffect(() => {
        FetchScreens();
    }, [FormData.theater]);

    const FetchScreens = async () => {
        if (FormData.theater) {
            toast.loading("Fetching related data...");
            try {
                const screens = await axios.get(`/theater/ScreenApiGetShow/${FormData.theater}/`);
                if (screens.status === 200) {
                    setScreens(screens.data);
                } else {
                    toast.error("Failed to fetch screens data");
                }
            } catch (error) {
                toast.error("An error occurred while fetching screens data");
            } finally {
                toast.dismiss();
            }
        }
    };

    const FetchDatas = async () => {
        toast.loading("Fetching related data...");
        try {
            const movies = await axios.get('/movie/movieListCreateAPIView/');
            const theaters = await axios.get(`/theater/FetchTheaterStaff/${user.user_cred}/`);

            if (movies.status === 200 && theaters.status === 200) {
                setMovies(movies.data);
                setTheaters(theaters.data);
            } else {
                toast.error("Failed to fetch data");
            }
        } catch (error) {
            toast.error("An error occurred while fetching data");
            console.log(error);
        } finally {
            toast.dismiss();
        }
    };

    const FormValidate = () => {
        for (let key of Object.keys(FormData)) {
          const value = FormData[key];
          if (typeof value === 'string' && value.trim() === '') {
            toast.warning(`Please fill out the ${key} field`);
            return false;
          }
        }
        return true;
      };

    const HandleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'show_date' && new Date(value) < new Date()) {
            setFormData({ ...FormData, [name]: null });
            toast.warning("Select a valid date");
        } else {
            setFormData({ ...FormData, [name]: (name === 'theater' || name === 'screen' || name === 'movie') ? parseInt(value) : value });
        }
    };

    const HandleSubmit = async (event) => {
        event.preventDefault();
        const currentDate = new Date();
        const showDate = new Date(FormData.show_date);

        if (showDate <= currentDate) {
            toast.error("Show date must be in the future.");
            return;
        }
        else{

            
            try {
                if (FormValidate() === false){
                    return;
                }
                const resp = await axios.post('/show/showCreateApi/', FormData);
                if (resp.status === 201){
                    toast.success('Show Added Successfully');
                    setFormData(INIT_STATE); 
                    setShowCreate(false)
                }else if(resp.status === 226){
                    toast.error('Show Already Exists');
                }
                else if(resp.status === 204 || resp.data === "Create Error"){
                    toast.warning('Please create the seats first, then create the show.');
                }else {
                    console.error('Failed to Add Show');
                }
            } catch (error) {
                toast.error("An error occurred while adding the show");
                console.log(error);
            }
        }
    };
        
    return (
        <div className="show-form-container">
            <h2>Add New Show</h2>
            <form onSubmit={HandleSubmit} className="show-form">
                <label>
                    Movie:
                    <select name="movie" value={FormData.movie} onChange={HandleChange} required>
                        <option value="">Select a Movie</option>
                        {Movies.map((movie) => (
                            <option key={movie.id} value={movie.id}>{movie.title}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Theater:
                    <select name="theater" value={FormData.theater} onChange={HandleChange} required>
                        <option value="">Select a Theater</option>
                        {Theaters.map((theater) => (
                            theater.theater_status === 'APPROVED' ?
                            (<option key={theater.id} value={theater.id}>{theater.theater_name}</option>):null
                        ))}
                    </select>
                </label>
                <label>
                    Show Date:
                    <input type="date" name="show_date" value={FormData.show_date} onChange={HandleChange} required />
                </label>
                <label>
                    Show Time:
                    <input type="time" name="show_time" value={FormData.show_time} onChange={HandleChange} required />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={FormData.price} onChange={HandleChange} required />
                </label>
                <label>
                    Screen:
                    <select name="screen" value={FormData.screen} onChange={HandleChange} required>
                        <option value="">Select a Screen</option>
                        {Screens.map((screen) => (
                            <option key={screen.id} value={screen.id}>{screen.name} - {screen.theater.theater_name} - {screen.screen_type.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Add Show</button>
            </form>
        </div>
    );
}

export default Show;
