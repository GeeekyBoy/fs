import React, { useState } from "react";
import { useWindowSize } from "../../components/WindowSizeListener";
import { useModal } from "../ModalManager";
import CardSelect from "../UI/fields/CardSelect";
import Modal from "../UI/Modal/";

const Export = (props) => {
  const [fileType, setFileType] = useState("csv");
  const { hideModal } = useModal();
  const { width } = useWindowSize();

  return (
    <Modal
      title="Export Project"
      primaryButtonText="Export"
      secondaryButtonText="Cancel"
      onPrimaryButtonClick={() => {}}
      onSecondaryButtonClick={() => hideModal()}
    >
      <CardSelect
        name="privacy"
        value={fileType}
        values={["csv", "json"]}
        options={["CSV", "JSON"]}
        descriptions={[
          "Supported by most of spreadsheet software.",
          "Perfect for processing exported data by code.",
        ]}
        onChange={(e) => setFileType(e.target.value)}
        row={width > 768}
        readOnly={false}
        center={true}
      />
    </Modal>
  );
};

export default Export;