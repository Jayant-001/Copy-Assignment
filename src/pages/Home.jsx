import Data from "../components/Data";
import Search from "../pages/Search";
import Upload from "../pages/Upload";
import { useState } from "react";

const Home = () => {
  const [searchKey, setSearchKey] = useState(null);

  return (
    <>
      <div className="home-container">
        <Upload />
        <Search setSearchKey={setSearchKey} />
      </div>
      <Data searchKey={searchKey} />
    </>
  );
};

export default Home;
