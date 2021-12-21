import React, { useEffect, useState } from 'react';
import styles from "./FileField.module.scss"

const FileField = (props) => {

  const {
    multiple
  } = props;

  const [inDropZone, setInDropZone] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setInDropZone(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setInDropZone(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = [...event.dataTransfer.files];
    if (files) {
      setFileList(multiple ? fileList.concat(files) : files);
      setInDropZone(false);
    }
  };

  useEffect(() => {
    if (fileList[0]) {
      const latestFile = fileList[fileList.length - 1];
      const reader = new FileReader();
      reader.readAsDataURL(latestFile);
      reader.onloadend = function () {
        const base64data = reader.result;
        console.log(base64data);
        props?.changeInputFile({
          file: base64data
        });
      };
    }
  }, [fileList]);

  return (
    <div
      id="FileFielddnd-container"
      className={styles.FileFieldContainer}
      onDrop={(event) => handleDrop(event)}
      onDragOver={(event) => handleDragOver(event)}
      onDragEnter={(event) => handleDragEnter(event)}
    >
      <div>
        <div>
          Drag and drop file here
        </div>
      </div>
    </div>
  );
}

export default FileField;