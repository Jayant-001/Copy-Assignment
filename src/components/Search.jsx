import React, { useState } from "react";
import { getDatabase, ref, get, child, onValue } from "firebase/database";
import app from "../firebase";
import Data from "./Data";

const Search = () => {
  const [searchKey, setSearchKey] = useState("");
  const [data, setData] = useState([]);
  const [found, setFound] = useState(false);

  const handleChange = (e) => {
    setSearchKey(e.target.value);
  };

  const searchData = () => {
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `data/${searchKey}`))
      .then((snapshot) => {
        if (snapshot.val() === null || snapshot.val() === undefined) {
          setFound(true);
        } else {
          setFound(false);
          setData({ ...snapshot.val() });
        //   console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    searchData();
  };

  return (
    <>
      <h1>Search assignments</h1>
      <form onSubmit={handleSearch}>
        <input type="text" onChange={handleChange} name="search" />
        <br />
        <input type="submit" value="Search" />
      </form>

      {found && <h3>No Data found for {searchKey}</h3>}

      {Object.keys(data).map((id, index) => {
        return (
          <Data
            key={index}
            title={data[id].title}
            description={data[id].description}
            files = {data[id].files}
          />
        );
      })}
    </>
  );
};

export default Search;
