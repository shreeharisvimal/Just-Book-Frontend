import React, { useState, useEffect } from "react";

const FilterComponent = ({handleFilterReset, fixedlen, myMovies, setmyMovies }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [originalMovies, setOriginalMovies] = useState([]);

  useEffect(() => {
    if(myMovies.length === fixedlen){
      setOriginalMovies(myMovies);
    }
  }, [myMovies]);

  const handleReset = () => {
    setSearchTerm(""); 
    };
  
    useEffect(()=>{
      handleReset();
    }, [handleFilterReset])

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setmyMovies(originalMovies);
    } else {
      const filteredMovies = originalMovies.filter((movie) => {
        const searchValue = value.toLowerCase();
        return (
          movie.title?.toLowerCase().includes(searchValue) ||
          movie.release_date?.toLowerCase().includes(searchValue) ||
          movie.language?.toLowerCase().includes(searchValue)
        );
      });
      setmyMovies(filteredMovies);
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
          🔍 Search by Name, Release Date, or Language:
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