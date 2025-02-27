import React, { useState } from "react";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Пошуковий запит:", searchTerm);
  };
  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введіть текст для пошуку"
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit">Load issues</button>
      </form>
      {searchTerm && <p>Пошуковий запит: {searchTerm}</p>}
    </div>
  );
};

export default Search;
