import React, { memo } from 'react';
import formatSize from '../../../utils/formatSize';
import styles from './AttachmentField.module.scss';
import { useModal } from '../../ModalManager';
import { ReactComponent as RemoveIcon } from "../../../assets/trash-outline.svg"
import { ReactComponent as UploadIcon } from "../../../assets/cloud-upload-outline.svg";
import modals from '../../modals';

const AttachmentField = (props) => {
  const {
    name,
    label,
    emptyMsg = "No Files Attached Yet",
    value = [],
    readOnly,
    style
  } = props

  const { showModal } = useModal();

  const handleDownload = (url) => {
    window.open(url, '_blank');
  }

  return (
    <div className={styles.AttachmentFieldShell} style={style}>
      <div className={styles.AttachmentFieldHeader}>
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        {!readOnly && value.length !== 0 && (
          <button
            className={styles.NewAttachmentBtn}
            onClick={() => showModal(modals.UPLOAD)}
          >
            <UploadIcon
              width="1rem"
              height="1rem"
            />
            <span>Upload</span>
          </button>
        )}
      </div>
      {value.length ? value.map(attachment => (
        <div key={attachment.id} className={styles.AttachmentItem}>
          <div className={styles.AttachmentInfo}>
            <span
              className={styles.AttachmentFilename}
              onClick={() => handleDownload(attachment.url)}
            >
              {attachment.filename}
            </span>
            <span className={styles.AttachmentSize}>
              {formatSize(attachment.size)}
            </span>
          </div>
          {!readOnly && (
            <button className={styles.AttachmentControl}>
              <RemoveIcon
                width={24}
                height={24}
              />
            </button>
          )}
        </div>
      )) : (
        <div className={styles.NoAttachments}>
        <span>{emptyMsg}</span>
        {!readOnly && (
          <button
            className={styles.NewAttachmentBtn}
            onClick={() => showModal(modals.UPLOAD)}
          >
            <UploadIcon
              width="1rem"
              height="1rem"
            />
            <span>Upload</span>
          </button>
        )}
      </div>
      )}
    </div>
  )
}

export default memo(AttachmentField);