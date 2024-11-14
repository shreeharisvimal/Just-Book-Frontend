import React, { useEffect, useState, useRef } from 'react';
import './ProfileComponent.scss';
import axios from '../../../axios';
import { toast } from 'react-toastify';
import { set_Authenticate } from '../../../Redux/Auth/AuthSlice';
import { useDispatch } from 'react-redux';

const ImageConfirmBox = React.lazy(()=> import('./imageConfirmBox'))

function ProfileComponent() {
    const inputFileRef = useRef(null);
    const dispatch = useDispatch();
    const token = localStorage.getItem("AccessToken");
    const [user, setUser] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);

    const INIT_STATE = {
        first_name: '',
        last_name: '',
        profile_pic: '',
    };

    const [formData, setFormData] = useState(INIT_STATE);
    const [imagePreview, setImagePreview] = useState(null);

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
            setImagePreview(user.profile_pic ? user.profile_pic : null);
        }
    }, [user]);

    const HandleFetchUser = async () => {
        try {
            const res = await axios.get(`Profile/`, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                setUser(res.data);
                dispatch(
                    set_Authenticate({
                        first_name: res.data.first_name,
                        user_cred: res.data.user_cred,
                        isAuth: true,
                        isAdmin: res.data.isAdmin,
                    })
                );
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load profile information. Please try again later.');
        }
    };

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
            setShowImagePreview(true)
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('last_name', formData.last_name);
        if (formData.profile_pic) {
            formDataToSend.append('profile_pic', formData.profile_pic);
        }

        try {
            const res = await axios.post(`Profile/`, formDataToSend, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 201) {
                toast.success('Profile updated successfully');
                window.location.reload();
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error('Please try again later');
        }
    };

    return (
        <div className="profileComponent">
            <div className="profileComponent__container">
            {showImagePreview && (
                    <ImageConfirmBox 
                        setShowImagePreview={setShowImagePreview} 
                        imagePreview={imagePreview} 
                        setImagePreview={setImagePreview} 
                        inputFileRef={inputFileRef}
                    />
                )}
                <h1 className="profileComponent__title">Update Profile</h1>
                <form className="profileComponent__form" onSubmit={handleSubmit}>
                    <div className="profileComponent__form-group">
                        <label className="profileComponent__label">Profile Picture</label>
                        <input
                            className="profileComponent__input"
                            type="file"
                            name="profile_pic"
                            ref={inputFileRef}
                            onChange={handleOnChange}
                        />
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
