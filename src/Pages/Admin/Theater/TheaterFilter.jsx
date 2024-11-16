import React, { useState, useEffect } from "react";

const FilterComponent = ({ fixedlen, theater, setTheater }) => {
  const [originalItems, setOriginalItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  useEffect(() => {
	console.log('the fixed length', fixedlen, 'the theater', theater)
    if (theater.length === fixedlen) {
      setOriginalItems(theater);
    }
  }, [theater]);

  const filterItems = (searchValue, status) => {
    let filteredItems = [...originalItems];

    if (searchValue.trim() !== "") {
      const searchValueLower = searchValue.toLowerCase();
      filteredItems = filteredItems.filter((item) => {
        return (
          item.email?.toLowerCase().includes(searchValueLower) ||
          item.theater_name?.toLowerCase().includes(searchValueLower) ||
          item.address?.toLowerCase().includes(searchValueLower) ||
          item.city?.toLowerCase().includes(searchValueLower) ||
          item.state?.toLowerCase().includes(searchValueLower)
        );
      });
    }

    if (status !== "ALL") {
      filteredItems = filteredItems.filter(
        (item) => item.theater_status === status
      );
    }

    setTheater(filteredItems);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    filterItems(searchValue, selectedStatus);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
    filterItems(searchTerm, value);
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
	    🔍 Search by Name, Email, or Address:
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
  
	<div>
	  <label
	    style={{
	      marginRight: "10px",
	      fontSize: "16px",
	      fontWeight: "bold",
	    }}
	  >
	    Filter by Status:
	  </label>
	  <label style={{ marginRight: "15px" }}>
	    <input
	      type="radio"
	      value="ALL"
	      checked={selectedStatus === "ALL"}
	      onChange={handleStatusChange}
	    />{" "}
	    ALL
	  </label>
	  <label style={{ marginRight: "15px" }}>
	    <input
	      type="radio"
	      value="APPROVED"
	      checked={selectedStatus === "APPROVED"}
	      onChange={handleStatusChange}
	    />{" "}
	    Approved
	  </label>
	  <label style={{ marginRight: "15px" }}>
	    <input
	      type="radio"
	      value="PENDING"
	      checked={selectedStatus === "PENDING"}
	      onChange={handleStatusChange}
	    />{" "}
	    Pending
	  </label>
	  <label>
	    <input
	      type="radio"
	      value="REJECTED"
	      checked={selectedStatus === "REJECTED"}
	      onChange={handleStatusChange}
	    />{" "}
	    Rejected
	  </label>
	</div>
      </div>
  );
};

export default FilterComponent;