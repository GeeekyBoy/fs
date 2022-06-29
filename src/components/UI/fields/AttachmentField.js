import React, { memo } from 'react';
import formatSize from '../../../utils/formatSize';
import styles from './AttachmentField.module.scss';
import { useModal } from '../../ModalManager';
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_24_regular.svg"
import { ReactComponent as UploadIcon } from "@fluentui/svg-icons/icons/cloud_arrow_up_16_regular.svg";
import modals from '../../modals';
import Button from '../Button';

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
        {!readOnly && (
          <Button
            sm
            secondary
            icon={UploadIcon}
            onClick={() => showModal(modals.UPLOAD)}
          />
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
              <RemoveIcon fill="currentColor" />
            </button>
          )}
        </div>
      )) : (
        <div className={styles.NoAttachments}>
          {emptyMsg}
        </div>
      )}
    </div>
  )
}

export default memo(AttachmentField);