import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import styles from "./WatcherField.module.scss"
import * as tasksActions from "../../../actions/tasks"
import * as appActions from "../../../actions/app";
import { ReactComponent as RemoveIcon } from "../../../assets/close-outline.svg"
import { panelPages } from "../../../constants";
import ShadowScroll from '../../ShadowScroll';
import Avatar from '../Avatar';
import { useModal } from '../../ModalManager';
import modals from '../../modals';

const WatcherField = (props) => {
  const {
    name,
    label,
    emptyMsg = "No Watchers Added Yet",
    value,
    readOnly,
    style
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
    <div className={styles.WatcherFieldShell} style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      {(value.length) ? (
        <ShadowScroll>
          {!readOnly && (
            <button
              className={styles.NewWatcherBtn}
              onClick={() => showModal(modals.WATCHER_CHOOSER)}
            >
              <div>+</div>
              <span>Add</span>
            </button>
          )}
          {value.map(x => (
            <span className={styles.WatcherItem} key={x}>
              {!readOnly && (
                <button
                  className={styles.RemoveBtn}
                  onClick={() => handleRemoveWatcher(x)}
                >
                  <RemoveIcon
                    height={16}
                    width={16}
                  />
                </button>
              )}
              <Avatar user={users[x]} size={36} circular />
              <div className={styles.WatcherDetails}>
                <span>{users[x].firstName}</span>
                <span>@{x}</span>
              </div>
            </span>
          ))}
        </ShadowScroll>
      ) : (
        <div className={styles.NoWatchers}>
          <span>{emptyMsg}</span>
          {!readOnly && (
            <button onClick={() => showModal(modals.WATCHER_CHOOSER)}>
              + Add Watcher
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default WatcherField;