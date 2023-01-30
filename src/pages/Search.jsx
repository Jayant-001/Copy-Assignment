import { useState } from "react";

const Search = ({ setSearchKey }) => {
  const [key, setKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchKey(key);
  };

  const handleChange = (e) => {
    const value = e.target.value.trim();
    setKey(value);
  };

  return (
    <>
      <div className="search-container box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handleChange}
            name="search"
            placeholder="Enter key to search"
          />
          <br />
          <input type="submit" value="Search" />
        </form>
      </div>
    </>
  );
};

export default Search;
