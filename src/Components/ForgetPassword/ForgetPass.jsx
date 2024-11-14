import React, { useState } from 'react';
import './ForgetPass.scss';
import axios from '../../Admin_axios';
import { toast } from 'react-toastify';

function ForgetPass({ setShowChangePassword }) {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    if (!confirmNewPassword) newErrors.confirmNewPassword = 'Please confirm your new password';
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (newPassword && !passwordRegex.test(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters and contain a number';
    }

    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
	if (validateForm()) {
	  try {
	    const user_id = localStorage.getItem('user_id');
	    const resp = await axios.put('PasswordManagement/', {
	      user_id,
	      current_password: currentPassword,
	      new_password: newPassword,
	      confirm_password: confirmNewPassword,
	    });
      
	    if (resp.status === 200) {
		toast.success("The password has been changed")
	      setShowChangePassword(false);
	    } else {
	      toast.warning('Password change failed. Please try again.');
	    }
	  } catch (error) {
	    toast.warning('An error occurred. Please check your credentials.');
	    console.error(error);
	  }
	}
      };

  return (
    <div className="password-change-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          {errors.currentPassword && <small>{errors.currentPassword}</small>}
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.newPassword && <small>{errors.newPassword}</small>}
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {errors.confirmNewPassword && <small>{errors.confirmNewPassword}</small>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ForgetPass;
