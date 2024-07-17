import React, { useState } from 'react';
import './ScreenType.scss';
import axios from '../../../../Admin_axios';
import { toast } from 'react-toastify';

function ScreenType() {
  const INIT_STATE = { name: '', price_multi: '' };
  const [newScreenType, setNewScreenType] = useState(INIT_STATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("theater/ScreenTypeApiCreate/", newScreenType);
      console.log(resp)
      if (resp.status === 201) {
        setNewScreenType(INIT_STATE);
        toast.success("Screen type created successfully");
      }
    } catch (error) {
      toast.error('Error while creating Screen type');
      console.log('New error while creating Screen type', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewScreenType({ ...newScreenType, [name]: value });
    console.log(newScreenType)
  };

  return (
    <div className="screen-type-container">
      <form className="screen-type-form" >
        <h2>Add Screen Type</h2>
        <input
          type="text"
          name="name"
          placeholder="Screen Type Name"
          value={newScreenType.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="price_multi"
          placeholder="Price Multiplier"
          value={newScreenType.price_multi}
          onChange={handleInputChange}
        />
        <button type="submit" onClick={handleSubmit}>Add Screen Type</button>
      </form>
    </div>
  );
}

export default ScreenType;
