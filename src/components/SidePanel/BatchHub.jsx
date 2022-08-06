import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AuthState } from "../../constants";
import DateField from "../UI/fields/DateField";
import * as appActions from "../../actions/app";
import * as tasksActions from "../../actions/tasks";
import styles from "./BatchHub.module.scss";
import TagField from "../UI/fields/TagField";
import AssigneeField from "../UI/fields/AssigneeField";
import WatcherField from '../UI/fields/WatcherField';
import ComboBox from '../UI/fields/ComboBox';

const TaskHub = forwardRef((_, ref) => {
  const dispatch = useDispatch();

  const userState = useSelector(state => state.user.state);
  const username = useSelector(state => state.user.data?.username);

  const projects = useSelector(state => state.projects);

  const tasks = useSelector(state => state.tasks);

  const selectedProject = useSelector(state => state.app.selectedProject);
  const selectedTasks = useSelector(state => state.app.selectedTasks);
  const isSynced = useSelector(state => state.app.isSynced);

  const closePanel = () => {
    return dispatch(appActions.handleSetRightPanel(false))
  }

  const getReadOnly = (userState, username, projects, selectedProject, isSynced) => {
    return (userState === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)) ||
    (userState !== AuthState.SignedIn && projects[selectedProject]?.isTemp)
  }

  const readOnly = useMemo(
    () => getReadOnly(userState, username, projects, selectedProject, isSynced),
    [userState, username, projects, selectedProject, isSynced]
  );
  
  const handleChange = (e) => {
    for (const taskId of selectedTasks) {
      dispatch(
        tasksActions.handleUpdateTask({
          id: taskId,
          action: "update",
          field: e.target.name,
          value: e.target.value
        })
      );
    }
  };
  const getCommonProps = (tasks, selectedTasks) => {
    const commonProps = {
      assignees: [],
      anonymousAssignees: [],
      invitedAssignees: [],
      watchers: [],
      tags: [],
      due: undefined,
      status: undefined,
      priority: undefined,
    };
    const arrayProps = [
      "assignees",
      "anonymousAssignees",
      "invitedAssignees",
      "watchers",
      "tags",
    ];
    const stringProps = [
      "status",
      "priority",
      "due",
    ];
    let first = true;
    if (selectedTasks) {
      for (const selectedTask of selectedTasks) {
        if (first ^ (first = false)) {
          for (const key of arrayProps) {
            commonProps[key] = tasks[selectedTask][key];
          }
          for (const key of stringProps) {
            commonProps[key] = tasks[selectedTask][key];
          }
        } else {
          for (const key of arrayProps) {
            commonProps[key] = [
              ...new Set([
                ...commonProps[key],
                ...tasks[selectedTask][key],
              ]),
            ].filter(
              (x) =>
                commonProps[key].includes(x) &&
                tasks[selectedTask][key].includes(x)
            );
          }
          for (const key of stringProps) {
            if (commonProps[key] !== tasks[selectedTask][key]) {
              commonProps[key] = undefined;
            }
          }
        }
      }
    }
    return commonProps;
  };

  const commonProps = useMemo(() => getCommonProps(tasks, selectedTasks), [tasks, selectedTasks]);
    
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: `${selectedTasks.length} Task${
        selectedTasks.length > 1 ? "s" : ""
      } Selected`,
      onClose: () => {
        closePanel()
      },
    },
  }));
  return selectedTasks && (
    <form onSubmit={(e) => e.preventDefault()} className={styles.DetailsForm}>
      <input type="submit" name="submit" value="Submit"></input>
      <AssigneeField
        name="assignees"
        label="Assigned To"
        emptyMsg="No Common Assignees Found"
        value={{
          assignees: commonProps.assignees,
          anonymousAssignees: commonProps.anonymousAssignees,
          invitedAssignees: commonProps.invitedAssignees
        }}
        readOnly={readOnly}
      />
      {(userState === AuthState.SignedIn || (userState !== AuthState.SignedIn && projects[selectedProject]?.isTemp)) && (
        <WatcherField
          name="watchers"
          label="Watched By"
          emptyMsg="No Common Watchers Found"
          value={commonProps.watchers}
          readOnly={readOnly}
        />
      )}
      <DateField
        name="due"
        label={
          commonProps.due === undefined
            ? "Due Date (conflict)"
            : "Due Date"
        }
        onChange={handleChange}
        placeholder="no date selected"
        value={commonProps.due}
        readOnly={readOnly}
        clearable
      />
      <TagField
        name="tags"
        label="Tags"
        onChange={handleChange}
        placeholder="tag…"
        value={commonProps.tags}
        readOnly={readOnly}
      />
      <ComboBox
        name="status"
        label={
          commonProps.status === undefined
            ? "Status (conflict)"
            : "Status"
        }
        onChange={handleChange}
        value={commonProps.status}
        options={{
          todo: "Todo",
          pending: "Pending",
          done: "Done",
        }}
        readOnly={readOnly}
      />
      <ComboBox
        name="priority"
        label={
          commonProps.priority === undefined
            ? "Priority (conflict)"
            : "Priority"
        }
        onChange={handleChange}
        value={commonProps.priority}
        options={{
          low: "Low",
          normal: "Normal",
          high: "High",
        }}
        readOnly={readOnly}
      />
    </form>
  )
});

TaskHub.displayName = "TaskHub";

export default TaskHub;
