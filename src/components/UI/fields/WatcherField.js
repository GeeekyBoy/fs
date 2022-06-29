import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import styles from "./WatcherField.module.scss"
import * as tasksActions from "../../../actions/tasks"
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_16_regular.svg"
import { ReactComponent as AddIcon } from "@fluentui/svg-icons/icons/add_16_regular.svg"
import ShadowScroll from '../../ShadowScroll';
import Avatar from '../Avatar';
import { useModal } from '../../ModalManager';
import modals from '../../modals';
import Button from '../Button';
import Chip from '../Chip';

const WatcherField = (props) => {
  const {
    name,
    label,
    emptyMsg = "No Watchers Added Yet",
    value,
    readOnly,
  } = props

  const { showModal } = useModal();
  const dispatch = useDispatch();

  const selectedTask = useSelector(state => state.app.selectedTask)
  const selectedTasks = useSelector(state => state.app.selectedTasks)

  const users = useSelector(state => state.users)
  
  const watcherFieldRef = useRef(null)

  useEffect(() => {
    if (watcherFieldRef.current) {
      watcherFieldRef.current.addEventListener("wheel", (e) => {
        e.preventDefault();
        watcherFieldRef.current.scrollLeft += e.deltaY;
      });
    }
  }, [watcherFieldRef])

  const handleRemoveWatcher = (username) => {
    if (selectedTask) {
      dispatch(tasksActions.handleRemoveWatcher(selectedTask, username))
    } else if (selectedTasks) {
      for (const task of selectedTasks) {
        dispatch(tasksActions.handleRemoveWatcher(task, username))
      }
    }
  }

  return (
    <div className={styles.WatcherFieldShell}>
      <div className={styles.WatcherFieldHeader}>
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        {!readOnly && (
          <Button
            sm
            secondary
            icon={AddIcon}
            onClick={() => showModal(modals.WATCHER_CHOOSER)}
          />
        )}
      </div>
      {(value.length) ? (
        <ShadowScroll>
          {value.map(x => (
            <Chip
              key={x}
              user={users[x]}
              primaryLabel={`${users[x].firstName} ${users[x].lastName[0]}.`}
              secondaryLabel={`@${x}`}
              actionIcon={RemoveIcon}
              onAction={() => handleRemoveWatcher(x)}
              actionAllowed={!readOnly}
            />
          ))}
        </ShadowScroll>
      ) : (
        <div className={styles.NoWatchers}>
          {emptyMsg}
        </div>
      )}
    </div>
  )
}

export default WatcherField;