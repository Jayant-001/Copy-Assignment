import React from "react";

const FileBox = ({ file }) => {

    const trimName = (filename) => {
        console.log(filename)
        const id = filename.lastIndexOf('_');
        if(id === -1) {
          const name = file.name.substring(0, Math.min(30, file.name.length));
          return name;
        }
        const name = file.name.substring(0, Math.min(30, id));
        return name;
    }
    
  return (
    <>
      <div className="file-box">

        <a target="_blank" download href={file.url}>
          <i className="fa-lg fa-solid fa-file-arrow-down"></i>
        <span id="file-name">{trimName(file.name)}</span> { trimName(file.name).length + 14 < file.name.length ? <span>...</span> : "" }
        </a>
            {/* <h1 onClick={e => }>sklj</h1> */}
      </div>
    </>
  );
};

export default FileBox;
