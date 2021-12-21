import React, { useState } from "react";
import { useWindowSize } from "../../components/WindowSizeListener";
import { useModal } from "../ModalManager";
import FileField from "../UI/fields/FileField";
import Modal from "../UI/Modal/";

const Import = (props) => {
  const [fileType, setFileType] = useState("csv");
  const { hideModal } = useModal();
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