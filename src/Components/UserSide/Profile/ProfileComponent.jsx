import React, { useEffect, useState } from 'react';
import './ProfileComponent.scss';
import axios from '../../../axios';
import { toast } from 'react-toastify';

function ProfileComponent() {
    
    useEffect(()=>{
        HandleFetchUser();
    },[])

    const token = localStorage.getItem("AccessToken");
    const [user, setUser] = useState(null);
    
    const INIT_STATE = {
        first_name: '',
        last_name: '',
        profile_pic: '',
    };

    const [formData, setFormData] = useState(INIT_STATE);

    useEffect(() => {
        HandleFetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                profile_pic: null,
            });
        }
    }, [user]);

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const HandleFetchUser = async()=>{
        try{
            const res = await axios.get(`Profile/`, {
                headers: {
                  'content-type': 'multipart/form-data',
                  'authorization': `Bearer ${token}`,
                }
              });
            if(res.status === 200){
                setUser(res.data)
            }
        }catch(error){
            console.log(error);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        
        const formDataToSend = new FormData();

        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('last_name', formData.last_name);
        formDataToSend.append('profile_pic', formData.profile_pic);

        try {
            const res = await axios.post(`Profile/`, formDataToSend, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 201) {
                toast.success('Image uploaded');
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            toast.error('Please reload the page');
        }
    };

    return (
        <div className="profileComponent">
            <div className="profileComponent__container">
                <h1 className="profileComponent__title">Update Profile</h1>
                <form className="profileComponent__form" onSubmit={handleSubmit}>
                    <div className="profileComponent__form-group">
                        <label className="profileComponent__label">Profile Picture</label>
                        <input
                            className="profileComponent__input"
                            type="file"
                            name="profile_pic"
                            onChange={handleOnChange}
                            required
                        />
                        <div className="profileComponent__image-container">
                            {formData.profile_pic && (
                                <img
                                    className="profileComponent__image"
                                    src={URL.createObjectURL(formData.profile_pic)}
                                    alt="Profile"
                                />
                            )}
                        </div>
                    </div>
                    <div className="profileComponent__form-group">
                        <label className="profileComponent__label">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            className="profileComponent__input"
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="profileComponent__form-group">
                        <label className="profileComponent__label">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            className="profileComponent__input"
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="profileComponent__form-group">
                        <button type="submit" className="profileComponent__submit">Update User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfileComponent;
