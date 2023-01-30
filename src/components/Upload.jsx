import { useState, useEffect } from "react";
import {
  getStorage,
  ref as ref_storage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, ref as ref_databse, set, push } from "firebase/database";
import app from "../firebase";

const Upload = () => {
  // states
  const [data, setData] = useState({
    key: "",
    title: "",
    description: "",
    files: [],
  });
  const [files, setFiles] = useState([]);
  // const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  // // upload file to firebase
  // const uploadFiles = async () => {
  //   const promises = [];
  //   const storage = getStorage(app);
  //   const temp = [];
  //   files.map((file) => {
  //     const storageRef = ref_storage(storage, `files/${file.id}`);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     promises.push(uploadTask);
  //     uploadTask.on(
  //       "state-changed",
  //       (snapshot) => {
  //         const p = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         );
  //         setProgress(p);
  //       },
  //       (error) => {
  //         console.log(error);
  //       },
  //       async () => {
  //         await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           // setUrls((prevState) => [prevState, downloadURL]);
  //           temp.push({ file_id: file.id, url: downloadURL });
  //         });
  //       }
  //     );
  //   });

  //   Promise.all(promises)
  //     .then(() => {
  //       // upload data to firebase database
  //       const dataToUpload = {
  //         key: data.key,
  //         title: data.title,
  //         description: data.description,
  //         files: temp,
  //       };

  //       console.log(dataToUpload);

  //       if (dataToUpload.files && dataToUpload.files.length > 0) {
  //         const db = getDatabase(app);
  //         const dataListRef = ref_databse(db, `data/${data.key}`);
  //         const newDataListRef = push(dataListRef);

  //         set(newDataListRef, dataToUpload)
  //           .then(() => {
  //             console.log("Data upload complete");
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const filesUpload = async () => {
    const storage = getStorage(app);
    const temp = [];
    const promise = new Promise((resolve, reject) => {
      files.map((file) => {
        const storageRef = ref_storage(storage, `files/${data.key}/${file.id}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

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
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURL) => {
                // setUrls((prevState) => [prevState, downloadURL]);
                temp.push({ file_id: file.id, url: downloadURL });
              }
            );
          }
        );
      });
      resolve(temp);
    });
  };

  // input box change handler
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFilesChange = (e) => {
    setFiles([]);
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      const timestamp = new Date().getTime();
      // adding current timestamp to each file to make unique filename
      const fileName = newFile.name + "_" + timestamp;
      newFile["id"] = fileName;
      setFiles((prevState) => [...prevState, newFile]);
      setData({ ...data, files: files });
    }
  };

  const dataUpload = () => {
    if (data.files && data.files.length > 0) {
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
    }
  };

  useEffect(() => {
    setData({ ...data, files: files });
  }, [files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    filesUpload().then(() => {
      console.log("files upload complete");
    });
    dataUpload();
  };

  const debug = () => {};

  return (
    <>
      <div className="upload-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="key"
            value={data.key}
            onChange={handleChange}
            placeholder="Enter Key"
            required
          />
          <br /> <br />
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="Enter title"
            required
          />
          <br /> <br />
          <textarea
            type="text"
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
          <br /> <br />
          <input
            type="file"
            name="files"
            onChange={handleFilesChange}
            multiple
          />
          <br /> <br />
          <input type="submit" value="Upload" />
        </form>
      </div>
      <h1 onClick={debug}>Debug</h1>
      {progress !== 0 && <h3>{progress} % uploaded</h3>}
    </>
  );
};

export default Upload;
