import React, { useMemo, useState } from "react";
import * as tasksActions from "../../actions/tasks";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../ModalManager";
import Modal from "../UI/Modal/";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";

const DueDateChooser = () => {
  const dispatch = useDispatch();

  const selectedTask = useSelector(state => state.tasks[state.app.selectedTask])

  const { modalRef, hideModal } = useModal();

  const [newDate, setNewDate] = useState(selectedTask.due);

  const pickValue = ({ day, month, year }) => {
    setNewDate(new Date(`${month}/${day}/${year} GMT`).toISOString());
  }

  const getPickerValue = (value) => {
    if (!value) return null
    const dateObj = new Date(value)
    const day = dateObj.getDate()
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()
    return { day, month, year }
  }

  const pickerValue = useMemo(() => getPickerValue(newDate), [newDate])

  const handleApply = () => {
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask.id,
        action: "update",
        field: "due",
        value: newDate
      })
    );
    hideModal();
  }
  
  const handleClear= () => {
    setNewDate(null);
    handleApply();
  }

  return (
    <Modal
      title="Choose Due Date"
      primaryButtonText="Apply"
      secondaryButtonText="Clear"
      onPrimaryButtonClick={handleApply}
      onSecondaryButtonClick={handleClear}
      modalRef={modalRef}
    >
      <Calendar
        value={pickerValue}
        onChange={pickValue}
        shouldHighlightWeekends
      />
    </Modal>
  );
};

export default DueDateChooser;