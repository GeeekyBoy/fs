import React, { useEffect, useRef, useState } from 'react';
import styles from "./FileField.module.scss"

const FileField = (props) => {

  const {
    multiple,
    onChange
  } = props;

  const [inDropZone, setInDropZone] = useState(false);
  const [fileList, setFileList] = useState([]);
  const inputFile = useRef(null);

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
    const files = event.dataTransfer ?
      [...event.dataTransfer.files] :
      [...event.target.files];
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
        onChange && onChange(base64data);
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
      onClick={() => inputFile.current.click()}
    >
      <div>
        <div className={styles.FieldLabel}>
          <span>Drag and drop file here</span>
          <span>or click to select file</span>
        </div>
      </div>
      <input type='file' ref={inputFile} onChange={handleDrop} />
    </div>
  );
}

export default FileField;