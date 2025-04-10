import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      onChange={handleChange}
      placeholder="Rechercher une recette..."
      className="search-bar"
      aria-label="Recherche de recette"
    />
  );
};

export default SearchBar;
