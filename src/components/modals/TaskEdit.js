import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useWindowSize } from "../../components/WindowSizeListener";
import { useModal } from "../ModalManager";
import * as appActions from "../../actions/app";
import * as tasksActions from "../../actions/tasks";
import Modal from "../UI/Modal/";
import TextField from "../UI/fields/TextField";
import SlashCommands from "../SlashCommands";

const TaskEdit = (props) => {
  const {
    app: {
      selectedTask,
      lockedTaskField,
      command
    },
    tasks,
    dispatch
  } = props
  const inputRef = useRef(null)
  const { modalRef, hideModal } = useModal();
  const { isMobile } = useWindowSize();

  useEffect(() => {
    if (!selectedTask || !isMobile) {
      hideModal();
    }
  }, [selectedTask, isMobile]);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 0);
    }
  }, [inputRef.current]);

  const onChange = (e) => {
    if (lockedTaskField !== "task") {
      dispatch(appActions.setLockedTaskField("task"))
    }
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        task: e.target.value,
      })
    );
  };

  const onChooseSuggestion = (suggestion) =>
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        task: tasks[selectedTask] + suggestion,
      })
    );

  return (
    <Modal
      title="Edit Task"
      primaryButtonText="Done"
      onPrimaryButtonClick={() => hideModal()}
      modalRef={modalRef}
    >
      <TextField
        placeholder="Task…"
        value={(tasks[selectedTask].task || "") + (command || "")}
        onChange={onChange}
        inputRef={inputRef}
      />
      {command && (
        <SlashCommands
          onChooseSuggestion={onChooseSuggestion}
        />
      )}
    </Modal>
  );
};

export default connect((state) => ({
  app: state.app,
  projects: state.projects,
  tasks: state.tasks,
}))(TaskEdit);