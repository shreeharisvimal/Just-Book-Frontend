import React, { useState, useEffect, useCallback } from "react";

const FilterComponent = ({ fixedlen, obj, updateFunc }) => {
  const [originalItems, setOriginalItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rangeValue, setRangeValue] = useState(500);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (obj?.length === fixedlen) {
      setOriginalItems(obj);
    }
  }, [obj, fixedlen]);

  const filterItems = useCallback(
	(searchValue, rangeValue, startDate, endDate) => {
	  let filteredItems = [...originalItems];
      
	  if (searchValue.trim() !== "") {
	    const searchValueLower = searchValue.toLowerCase();
	    filteredItems = filteredItems.filter((item) =>
	      ["movie.title", "theater.theater_name", "screen.name", "screen.screen_type.name"]
		.some((field) =>
		  field.split(".").reduce((acc, key) => acc?.[key], item)?.toLowerCase().includes(searchValueLower)
		)
	    );
	  }
      
	  filteredItems = filteredItems.filter(
	    (item) => parseFloat(item.price) <= parseFloat(rangeValue)
	  );
      
	  if (startDate) {
	    const start = new Date(startDate);
	    filteredItems = filteredItems.filter(
	      (item) => new Date(item.show_date) >= start
	    );
	  }
      
	  if (endDate) {
	    const end = new Date(endDate);
	    filteredItems = filteredItems.filter(
	      (item) => new Date(item.show_date) <= end
	    );
	  }
      
	  updateFunc(filteredItems);
	},
	[originalItems, updateFunc]
      );

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    filterItems(searchValue, rangeValue, startDate, endDate);
  };

  const handleRangeChange = (e) => {
    const value = e.target.value;
    setRangeValue(value);
    filterItems(searchTerm, value, startDate, endDate);
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    filterItems(searchTerm, rangeValue, value, endDate);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    filterItems(searchTerm, rangeValue, startDate, value);
  };

  return (
    <div
      style={{
        width: "95%",
        maxWidth: "600px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="search"
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          🔍 Search by Name, Theater, or Screen Type:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Type here to search..."
          style={{
            width: "98%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="range"
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          🎚️ Ticket Price: <strong>{rangeValue}</strong>
        </label>
        <input
          type="range"
          id="range"
          value={rangeValue}
          min="1"
          max="500"
          step="1"
          onChange={handleRangeChange}
          style={{
            width: "100%",
            cursor: "pointer",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="date-range"
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          📅 Filter by Date Range:
        </label>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            style={{
              flex: "1",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            style={{
              flex: "1",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
