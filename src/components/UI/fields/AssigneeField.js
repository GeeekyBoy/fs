import React, { useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import styles from "./AssigneeField.module.scss"
import * as tasksActions from "../../../actions/tasks"
import { ReactComponent as RemoveIcon } from "../../../assets/close-outline.svg"
import ShadowScroll from '../../ShadowScroll';
import Avatar from '../Avatar';
import { useModal } from '../../ModalManager';
import modals from '../../modals';

const AssigneeField = (props) => {
  const {
    label,
    emptyMsg = "No Users Assigned Yet",
    name,
    value,
    readOnly,
    style
  } = props

  const { showModal } = useModal();
  const dispatch = useDispatch();

  const selectedTask = useSelector(state => state.app.selectedTask)
  const selectedTasks = useSelector(state => state.app.selectedTasks)

  const users = useSelector(state => state.users)

  const assigneeFieldRef = useRef(null)

  useEffect(() => {
    if (assigneeFieldRef.current) {
      assigneeFieldRef.current.addEventListener("wheel", (e) => {
        e.preventDefault();
        assigneeFieldRef.current.scrollLeft += e.deltaY;
      });
    }
  }, [assigneeFieldRef])

  const processValue = (value, users) => {
    const result = []
    for (const assigneeId of value.assignees) {
      result.push({...users[assigneeId], username: assigneeId, isUser: true})
    }
    for (const assigneeId of value.anonymousAssignees) {
      result.push({ name: assigneeId, isUser: false })
    }
    return result
  }

  const processedValue = useMemo(() => processValue(value, users), [value, users]);

  const handleRemoveAssignee = (assignee) => {
    if (assignee.isUser) {
      if (selectedTask) {
        dispatch(tasksActions.handleRemoveAssignee(selectedTask, assignee.username))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          dispatch(tasksActions.handleRemoveAssignee(task, assignee.username))
        }
      }
    } else {
      if (selectedTask) {
        dispatch(tasksActions.handleRemoveAnonymousAssignee(selectedTask, assignee.name))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          dispatch(tasksActions.handleRemoveAnonymousAssignee(task, assignee.name))
        }
      }
    }
  }

  return (
    <div className={styles.AssigneeFieldShell} style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      {(processedValue.length) ? (
        <ShadowScroll>
          {!readOnly && (
            <button
              className={styles.NewAssigneeBtn}
              onClick={() => showModal(modals.ASSIGNEE_CHOOSER)}
            >
              <div>+</div>
              <span>Assign</span>
            </button>
          )}
          {processedValue.map(x => (
            <span className={styles.AssigneeItem} key={x.name || x.username}>
              {!readOnly && (
                <button
                  className={styles.RemoveBtn}
                  onClick={() => handleRemoveAssignee(x)}
                >
                  <RemoveIcon
                    height={16}
                    width={16}
                  />
                </button>
              )}
              <Avatar user={x} size={36} circular />
              <div className={styles.AssigneeDetails}>
                <span>{x.firstName || x.name}</span>
                <span>{x.username ? `@${x.username}` : "Anonymous"}</span>
              </div>
            </span>
          ))}
        </ShadowScroll>
      ) : (
        <div className={styles.NoAssignees}>
          <span>{emptyMsg}</span>
          {!readOnly && (
            <button onClick={() => showModal(modals.ASSIGNEE_CHOOSER)}>
              + Add Assignee
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default AssigneeField;