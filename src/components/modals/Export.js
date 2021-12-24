import React, { useState } from "react";
import { connect } from "react-redux";
import { useWindowSize } from "../../components/WindowSizeListener";
import parseLinkedList from "../../utils/parseLinkedList";
import { useModal } from "../ModalManager";
import { stringify } from 'csv-stringify/browser/esm/index.js';
import CardSelect from "../UI/fields/CardSelect";
import Modal from "../UI/Modal/";

const Export = (props) => {
  const {
    app: {
      selectedProject
    },
    projects,
    tasks
  } = props
  const [fileType, setFileType] = useState("csv");
  const { modalRef ,hideModal } = useModal();
  const { width } = useWindowSize();

  const handleExport = () => {
    const orderedTasks = parseLinkedList(tasks, "prevTask", "nextTask");
    const preparedTasks = orderedTasks.map(task => ({
        task: task.task,
        description: task.description,
        due: task.due ? new Date(task.due).toLocaleDateString() : null,
        tags: task.tags.join(", "),
        status: task.status,
        priority: task.priority
      }
    ));
    if (fileType === "csv") {
      stringify(preparedTasks, { header: true }, (err, output) => {
        const a = document.createElement('a');
        const file = new Blob([output], {type: "text/csv"});
        a.href = URL.createObjectURL(file);
        a.download = projects[selectedProject].title + "_" + new Date().toLocaleString() + ".csv";
        a.click();
      });
    } else if (fileType === "json") {
      const a = document.createElement('a');
      const file = new Blob([JSON.stringify(preparedTasks, null, 2)], {type: "text/json"});
      a.href = URL.createObjectURL(file);
      a.download = projects[selectedProject].title + "_" + new Date().toLocaleString() + ".json";
      a.click();
    }
    hideModal();
  }

  return (
    <Modal
      title="Export Project"
      primaryButtonText="Export"
      secondaryButtonText="Cancel"
      onPrimaryButtonClick={() => handleExport()}
      onSecondaryButtonClick={() => hideModal()}
      modalRef={modalRef}
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

export default connect((state) => ({
  app: state.app,
  projects: state.projects,
  tasks: state.tasks,
}))(Export);