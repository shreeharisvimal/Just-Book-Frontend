import React from 'react';
import axios from '../Admin_axios';
import { toast } from 'react-toastify';
import './WarningBox.scss';


function WarningBox({ apiLink, setOnOpen, setOnSuccess }) {
  const onConfirm = async () => {
    try {
      await axios.delete(apiLink);
      setOnSuccess(true); 	
      setOnOpen(false);   
      toast.dismiss();
    } catch (error) {
      setOnSuccess(false);
      console.error("Failed to delete item:", error);
    }
  };

  const onCancel = () => {
	toast.dismiss();
    	setOnOpen(false); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete this item?</h3>
        <p>This action cannot be undone.</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">Delete</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default WarningBox;
