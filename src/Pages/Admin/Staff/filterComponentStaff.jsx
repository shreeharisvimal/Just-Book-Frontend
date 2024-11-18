import React, { useState, useEffect } from "react";

const FilterComponent = ({handleFilterReset, fixedlen, staffs, setStaffs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [OriginalItem, setOriginalItem] = useState([]);



  const handleReset = () => {
    setSearchTerm(""); 
    };
  
    useEffect(()=>{
      handleReset();
    }, [handleFilterReset])

  useEffect(() => {
	if (staffs.length === fixedlen){
		setOriginalItem(staffs);
	}
  }, [staffs]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
	setStaffs(OriginalItem);
    } else {
      const filteredItems = OriginalItem.filter((staff) => {
        const searchValue = value.toLowerCase();
        return (
          staff.email?.toLowerCase().includes(searchValue) ||
          staff.first_name?.toLowerCase().includes(searchValue) ||
          staff.last_name?.toLowerCase().includes(searchValue) ||
          staff.phone?.toLowerCase().includes(searchValue)
        );
      });
      setStaffs(filteredItems);
    }
  };

  return (
    <div
      style={{
        width: "95%",
        border: "1px solid #ccc",
        borderRadius: "10px",
        margin: "20px auto",
        padding: "15px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="search"
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          🔍 Search by Name, Email or Phone:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Type here to search..."
          style={{
            width: "98%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>
    </div>
  );
};

export default FilterComponent;