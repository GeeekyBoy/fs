import React, { useState } from "react";
import useWindowSize from "../../utils/useWindowSize";
import { useGlobalModalContext } from "../ModalManager";
import FileField from "../UI/fields/FileField";
import Modal from "../UI/Modal/";

const Import = (props) => {
  const [fileType, setFileType] = useState("csv");
  const { hideModal } = useGlobalModalContext();
  const { width } = useWindowSize();

  return (
    <Modal
      title="Import Project"
      primaryButtonText="Import"
      secondaryButtonText="Cancel"
      onPrimaryButtonClick={() => {}}
      onSecondaryButtonClick={() => hideModal()}
    >
      <FileField />
    </Modal>
  );
};

export default Import;