import React, { useState, useEffect, useCallback } from "react";

const FilterComponent = ({handleFilterReset, fixedlen, obj, updateFunc }) => {
  const [originalItems, setOriginalItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rangeValue, setRangeValue] = useState(100);


  const handleReset = () => {
    setSearchTerm(""); 
    setRangeValue(100);
    };
  
    useEffect(()=>{
      handleReset();
    }, [handleFilterReset])


  useEffect(() => {
    if (obj?.length === fixedlen) {
      setOriginalItems(obj);
    }
  }, [obj, fixedlen]);

  const filterItems = useCallback(
    (searchValue, rangeValue) => {
      let filteredItems = [...originalItems];

      if (searchValue.trim() !== "") {
        const searchValueLower = searchValue.toLowerCase();
        filteredItems = filteredItems.filter((item) => {
          return (
            item.name?.toLowerCase().includes(searchValueLower)
          );
        });
      }

      filteredItems = filteredItems.filter(
        (item) => parseFloat(item.price_multi) <= parseFloat(rangeValue)
      );


      updateFunc(filteredItems);
    },
    [originalItems, updateFunc]
  );

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    filterItems(searchValue, rangeValue);
  };

  const handleRangeChange = (e) => {
    const value = e.target.value;
    setRangeValue(value);
    filterItems(searchTerm, value);
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
          🎚️ Extra Cost Percentage: <strong>{rangeValue}%</strong>
        </label>
        <input
          type="range"
          id="range"
          value={rangeValue}
          min="1"
          max="100"
          step="1"
          onChange={handleRangeChange}
          style={{
            width: "100%",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default FilterComponent;
