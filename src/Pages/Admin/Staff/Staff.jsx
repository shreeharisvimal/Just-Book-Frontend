import React, { useState, useEffect, lazy, Suspense } from 'react';
import './staff.scss';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';

const AsideBar = lazy(() => import('../../../Components/AdminSide/AsideBar/AsideBar'));
const NavBar = lazy(() => import('../../../Components/AdminSide/Navbar/AdminNavBar'));

function Staff() {
    const INITIAL_STATE = {
        first_name:'',
        last_name:'',
        password:'',
        phone:'',
        email:'',
    }
    const [openCreate, setopenCreate] = useState(false);
    const [NewStaff, setNewStaff] = useState(INITIAL_STATE)
    const [staffs, setStaffs] = useState([]);

    const AccessToken = (localStorage.getItem('AccessToken'));

    const HandleSubmit = async()=>{
        try{    
            const resp = await axios.post('StaffAuth/',NewStaff,{
                headers:{
                    'Authorization': `Bearer ${AccessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            if (resp.status === 201){
                toast.success("New Staff Created !")
                setNewStaff(INITIAL_STATE)
                setopenCreate(!openCreate)
            }
        }catch(error){
            if(error.response.status === 409){
                
                toast.warning(error.response.data.message)
            }
        }
    }

    const HandleChange = (event) => {
        const { name, value } = event.target;   
        setNewStaff(prevState => ({
           ...prevState,
            [name]: value
        }));
    };
    
    const fetchStaff = async()=>{
        try{
            const resp = await axios.get('StaffAuth/',{
                headers:{
                    'Authorization': `Bearer ${AccessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            console.log('staffs', staffs)
            setStaffs(resp.data)
        }catch(error){
            console.log(error)
        }
    }

    const HandleDelete= async(id)=>{
        try{
            const resp = await axios.delete(`StaffDelete/${id}/`, {
                headers:{
                    'Authorization':`Bearer ${AccessToken}`,
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                }
            })
            toast.warning("Staff deleted")
            fetchStaff();
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchStaff();
    },[openCreate])

    return (
        <Suspense fallback={<div>Loading...</div>}>
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
                        <input className="container__form-input" name='first_name' value={NewStaff.first_name} onChange={(event)=>HandleChange(event)} type="text" placeholder="Enter first name" />
                        <input className="container__form-input" name='last_name' value={NewStaff.last_name} onChange={(event)=>HandleChange(event)} type="text" placeholder="Enter last name" />
                        <input className="container__form-input"  name='password' value={NewStaff.password} onChange={(event)=>HandleChange(event)} type="password" placeholder="Enter password for user" />
                        <input className="container__form-input" name='phone' value={NewStaff.phone} onChange={(event)=>HandleChange(event)} type="tel" placeholder="Enter phone number" />
                        <input className="container__form-input" name='email' value={NewStaff.email} onChange={(event)=>HandleChange(event)} type="email" placeholder="Enter email" />
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
                                    <button className="container__list-item-actions-button" onClick={()=>HandleDelete(staff.id)}>Delete</button>
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
