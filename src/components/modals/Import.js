import React, { useState } from "react";
import { useWindowSize } from "../../components/WindowSizeListener";
import dataUrlToTxt from "../../utils/dataUrlToTxt";
import { useModal } from "../ModalManager";
import { parse } from 'csv-parse/browser/esm';
import FileField from "../UI/fields/FileField";
import Modal from "../UI/Modal/";
import * as tasksActions from "../../actions/tasks";
import copyTask from "../../utils/copyTask";
import { connect } from "react-redux";
import parseLinkedList from "../../utils/parseLinkedList";
import store from "../../store";

const Import = (props) => {
  const {
    app: {
      selectedProject
    },
    tasks,
    dispatch
  } = props;
  const [fileType, setFileType] = useState("csv");
  const { modalRef, hideModal } = useModal();
  const { width } = useWindowSize();

  const handleImport = (dataUrl) => {
    const fileContents = dataUrlToTxt(dataUrl)
    parse(fileContents, {
      columns: true,
      skip_empty_lines: true
    }, (err, output) => {
      if (err) {
        console.log(err);
        return;
      }
      const tasksToImport = output.map(task => ({
        task: task.task,
        description: task.description,
        due: task.due ? new Date(task.due) : null,
        tags: task.tags ? task.tags.split(",").map(tag => tag.trim()) : [],
        status: task.status,
        priority: task.priority,
        assignees: []
      }));
      for (const taskToImport of tasksToImport) {
        dispatch(
          tasksActions.handleCreateTask(
            copyTask(
              taskToImport,
              selectedProject,
              parseLinkedList(store.getState().tasks, "prevTask", "nextTask").reverse()[0]?.id
            )
          )
        )
      }
      console.log(tasks);
      hideModal();
    });
  }

  return (
    <Modal
      title="Import Tasks"
      primaryButtonText="Import"
      secondaryButtonText="Cancel"
      onPrimaryButtonClick={() => {}}
      onSecondaryButtonClick={() => hideModal()}
      modalRef={modalRef}
    >
      <FileField onChange={handleImport} />
    </Modal>
  );
};

export default connect((state) => ({
  app: {
    selectedProject: state.app.selectedProject
  },
  projects: state.projects,
  tasks: state.tasks,
}))(Import);