import React, { useEffect, useState } from "react";
import app from "../firebase";
import {
  getStorage,
  ref as storage_ref,
  listAll,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { get, getDatabase, ref as db_ref } from "firebase/database";
import FileBox from "./FileBox";
import TextBox from "./TextBox";

const Data = ({ searchKey }) => {
  const [fileUrls, setFileUrls] = useState([]);
  const [textData, setTextData] = useState([]);
  // const [url, setUrl] = useState();

  const getFiles = (searchKey) => {
    const storage = getStorage(app);
    const listRef = storage_ref(storage, `files/${searchKey}/`);

    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          getMetadata(itemRef).then((metadata) => {
            // console.log(metadata.name);
            getDownloadURL(itemRef)
              .then((url) => {
                setFileUrls((prev) => [
                  ...prev,
                  { name: metadata.name, url: url },
                ]);

                // console.log(url);
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = (searchKey) => {
    const database = getDatabase(app);
    const dataListRef = db_ref(database, `data/${searchKey}/`);
    get(dataListRef).then((snapshot) => {
      
      snapshot.forEach((data) => {
        const desc = data.val().description;
        setTextData((prev) => [...prev, desc]);
      })

    })
    .catch((error) => {
      console.log(error)
    })
  };

  useEffect(() => {
    setFileUrls([]);
    setTextData([])
    getFiles(searchKey);
    getData(searchKey);
  }, [searchKey]);

  return (
    <>
      {searchKey !== null && <h1>Data for {searchKey}</h1>}
      {searchKey !== null && <>To download file: Click to open in new tab and press Ctrl + s</>}
      <div className="data-container">
        <div className="file-container">
          {fileUrls.map((file, index) => {
            // console.log(url)
            return (
              <FileBox key={index} file={file}  />
            );
          })}
        </div>
        <div className="text-container"><h1>text data will show here</h1>
        <br />
        {
          textData.map((text, index) => {
            return (
              <TextBox key={index} textData={text} />
            )
          })
        }
        </div>
      </div>
    </>
  );
};

export default Data;
