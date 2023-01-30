import { useState } from "react";
import {
  getStorage,
  ref as ref_storage,
  uploadBytesResumable,
} from "firebase/storage";
import { getDatabase, ref as ref_databse, set, push } from "firebase/database";
import app from "../firebase";

import React from "react";

const Upload = () => {
  const [data, setData] = useState({
    key: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  // const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length > 0) {
      uploadFiles();
    } else if (data.description.length > 0) {
      uploadData();
    } else {
      alert("Please enter some description or select some file");
    }
  };

  const uploadFiles = () => {
    const storage = getStorage(app);
    const promises = [];
    files.map((file) => {
      const storageRef = ref_storage(storage, `files/${data.key}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      promises.push(uploadTask);
      uploadTask.on(
        "state-changed",
        (snapshot) => {
          const p = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(p);
        },
        (error) => {
          console.log(error);
        },
        async () => {}
      );
    });

    Promise.all(promises)
      .then(() => console.log("All file(s) uploaded"))
      .catch((err) => console.log(err));
  };

  const uploadData = () => {
    const db = getDatabase(app);
    const dataListRef = ref_databse(db, `data/${data.key}`);
    const newDataListRef = push(dataListRef);

    set(newDataListRef, data)
      .then(() => {
        console.log("Data upload complete");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // input box change handler
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // files change handler
  const handleFilesChange = (e) => {
    setFiles([]);
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      const timestamp = new Date().getTime();
      // adding current timestamp to each file to make unique filename
      const fileName = newFile.name + "_" + timestamp;
      newFile["id"] = fileName;
      setFiles((prevState) => [...prevState, newFile]);
    }
  };

  return (
    <>
      <div className="upload-container box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="key"
            value={data.key}
            onChange={handleChange}
            placeholder="Enter Key"
            required
          />
          <textarea
            type="text"
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
          <input
            type="file"
            name="files"
            onChange={handleFilesChange}
            multiple
          />
          <input type="submit" value="Upload" />
          {progress !== 0 && <h3>{progress} % uploaded</h3>}
        </form>
      </div>
    </>
  );
};

export default Upload;
