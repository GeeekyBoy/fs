import React, { useEffect, useState } from "react";
import { useModal } from "../ModalManager";
import FileField from "../UI/fields/FileField";
import Modal from "../UI/Modal/";
import { useSelector } from "react-redux";
import styles from "./Upload.module.scss";
import upload from "../../utils/upload";
import formatSize from "../../utils/formatSize";
import ProgressBar from "../UI/ProgressBar";

const Upload = ({ importedBlobs }) => {
  
  const selectedTask = useSelector(state => state.app.selectedTask);

  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const { modalRef, hideModal } = useModal();

  const handleChange = (blobs) => {
    setFiles(blobs);
  }

  const handleUpload = async () => {
    setIsBusy(true);
    for (let i = 0; i < files.length; i++) {
      setProgress((prevState) => [...prevState, 0]);
      const fileProgressSetter = (progress) => {
        setProgress((prevState) => {
          const stateClone = [...prevState];
          stateClone[i] = progress;
          return stateClone;
        });
      }
      await upload(files[i], selectedTask, fileProgressSetter);
    }
    setTimeout(() => {
      hideModal();
    }, 1000);
  }

  useEffect(() => {
    if (importedBlobs) {
      handleChange(importedBlobs);
    }
  }, [importedBlobs]);

  return (
    <Modal
      title="Upload Attachments"
      primaryButtonText="Upload"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={files.length === 0 || isBusy}
      secondaryButtonDisabled={isBusy}
      onPrimaryButtonClick={handleUpload}
      onSecondaryButtonClick={hideModal}
      modalRef={modalRef}
    >
      {files.length ? (
        <div className={styles.FilesList}>
          {files.map((file, i) => (
            <div key={i} className={styles.FileItem}>
              <div className={styles.FileData}>
                <span className={styles.FileName}>{file.name}</span>
                {" "}
                <span className={styles.FileSize}>{formatSize(file.size)}</span>
              </div>
              {progress[i] !== undefined && (
                <ProgressBar max={100} value={progress[i]} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <FileField onChange={handleChange} multiple />
      )}
    </Modal>
  );
};

export default Upload;