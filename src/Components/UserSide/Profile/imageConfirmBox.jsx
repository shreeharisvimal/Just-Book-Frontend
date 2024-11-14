import React from 'react';
import './ImageConfirmBox.scss';

function ImageConfirmBox({ setShowImagePreview, imagePreview, setImagePreview, inputFileRef}) {

    const handleConfirm = () => {
        setShowImagePreview(false); 
    };

    const handleCancel = () => {
	inputFileRef.current.value = ""; 
        setShowImagePreview(false);
        setImagePreview(null);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <img
                    className="profileComponent__image"
                    src={imagePreview}
                    alt="Profile Preview"
                />
                <h3>Confirm Profile Picture</h3>
                <p>Do you want to set this as your profile picture?</p>
                <div className="modal-actions">
                    <button onClick={handleConfirm} className="confirm-btn">Confirm</button>
                    <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ImageConfirmBox;
