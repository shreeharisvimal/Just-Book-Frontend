import React, { useState, useEffect, lazy, Suspense } from 'react';
import './staff.scss';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';

const WarningBox = React.lazy(()=> import('../../../Utils/WarningBox'));
const AsideBar = lazy(() => import('../../../Components/AdminSide/AsideBar/AsideBar'));
const NavBar = lazy(() => import('../../../Components/AdminSide/Navbar/AdminNavBar'));

function Staff() {
    const INITIAL_STATE = {
        first_name: '',
        last_name: '',
        password: '',
        phone: '',
        email: '',
    };

    const [openCreate, setopenCreate] = useState(false);
    const [NewStaff, setNewStaff] = useState(INITIAL_STATE);
    const [staffs, setStaffs] = useState([]);
    const [errors, setErrors] = useState({});
    const [apiLink, setApiLink] = useState('');
    const [onOpen, setOnOpen] = useState('');
    const [onSuccess, setOnSuccess] = useState(false)

    const AccessToken = localStorage.getItem('AccessToken');

    const validate = () => {
        let validationErrors = {};

        if (!NewStaff.first_name.trim()) validationErrors.first_name = 'First name is required';
        if (!NewStaff.last_name.trim()) validationErrors.last_name = 'Last name is required';
        if (!NewStaff.password.trim()) validationErrors.password = 'Password is required';
        if (!NewStaff.phone.trim()) {
            validationErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(NewStaff.phone)) {
            validationErrors.phone = 'Enter a valid 10-digit phone number';
        }
        if (!NewStaff.email) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(NewStaff.email)) {
            validationErrors.email = 'Enter a valid email address';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const HandleSubmit = async () => {
        if (!validate()) {
            toast.error('Please fix the validation errors');
            return;
        }

        try {
            const resp = await axios.post('StaffAuth/', NewStaff, {
                headers: {
                    'Authorization': `Bearer ${AccessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            if (resp.status === 201) {
                toast.success('New Staff Created!');
                setNewStaff(INITIAL_STATE);
                setopenCreate(!openCreate);
                setErrors({});
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.warning(error.response.data.message);
            } else {
                toast.error('Error creating staff');
            }
        }
    };

    const HandleChange = (event) => {
        const { name, value } = event.target;
        setNewStaff(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const fetchStaff = async () => {
        try {
            const resp = await axios.get('StaffAuth/', {
                headers: {
                    'Authorization': `Bearer ${AccessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            setStaffs(resp.data);
        } catch (error) {
            console.log(error);
        }
    };

    const HandleDelete = async (id) => {
    toast.loading("Deleting staff...");
        try {
            setApiLink(`StaffDelete/${id}/`)
            setOnOpen(true)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (onSuccess) {
            toast.dismiss();
            toast.success("staff deleted successfully");
            setOnSuccess(false);
          }
        fetchStaff();
    }, [openCreate, onSuccess]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {onOpen && <WarningBox apiLink={apiLink} setOnOpen={setOnOpen} setOnSuccess={setOnSuccess}/> }
            <div className="container">
                <AsideBar />
                <NavBar />
                <div className="container__header">
                    <button className="container__button" onClick={() => setopenCreate(!openCreate)}>
                        {openCreate ? 'CANCEL' : 'CREATE STAFF'}
                    </button>
                </div>
                {openCreate ? (
                    <div className="container__form">
                        <input
                            className="container__form-input"
                            name="first_name"
                            value={NewStaff.first_name}
                            onChange={HandleChange}
                            type="text"
                            placeholder="Enter first name"
                        />
                        {errors.first_name && <p className="error-text">{errors.first_name}</p>}

                        <input
                            className="container__form-input"
                            name="last_name"
                            value={NewStaff.last_name}
                            onChange={HandleChange}
                            type="text"
                            placeholder="Enter last name"
                        />
                        {errors.last_name && <p className="error-text">{errors.last_name}</p>}

                        <input
                            className="container__form-input"
                            name="password"
                            value={NewStaff.password}
                            onChange={HandleChange}
                            type="password"
                            placeholder="Enter password for user"
                        />
                        {errors.password && <p className="error-text">{errors.password}</p>}

                        <input
                            className="container__form-input"
                            name="phone"
                            value={NewStaff.phone}
                            onChange={HandleChange}
                            type="tel"
                            placeholder="Enter phone number"
                        />
                        {errors.phone && <p className="error-text">{errors.phone}</p>}

                        <input
                            className="container__form-input"
                            name="email"
                            value={NewStaff.email}
                            onChange={HandleChange}
                            type="email"
                            placeholder="Enter email"
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}

                        <button className="container__button" onClick={HandleSubmit}>Create Staff</button>
                    </div>
                ) : (
                    <div className="container__list">
                        {staffs.map((staff, index) => (
                            <div key={index} className="container__list-item">
                                <div className="container__list-item-details">
                                    <div className="container__list-item-details-name">{staff.first_name} {staff.last_name}</div>
                                    <div>{staff.phone}</div>
                                    <div>{staff.email}</div>
                                </div>
                                <div className="container__list-item-actions">
                                    <button className="container__list-item-actions-button" onClick={() => HandleDelete(staff.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Suspense>
    );
}

export default Staff;
