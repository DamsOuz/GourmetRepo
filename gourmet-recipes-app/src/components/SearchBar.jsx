import React from 'react';

const SearchBar = ({ onSearch }) => {
    const handleChange = (e) => {
        const query = e.target.value;
        onSearch(query);
    };

    return (
        <input
            type="text"
            onChange={handleChange}
            placeholder="Rechercher une recette..."
            aria-label="Recherche de recette"
            style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
        />
    );
};

export default SearchBar;
