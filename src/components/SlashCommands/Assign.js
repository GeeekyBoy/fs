import React, { useState, useEffect } from 'react';
import styles from "./Assign.module.scss"
import { useDispatch, useSelector } from "react-redux";
import * as usersActions from "../../actions/users";
import * as tasksActions from "../../actions/tasks"
import { AuthState } from "../../constants";
import Avatar from '../UI/Avatar';

const Assign = (props) => {
  const {
    onCommandChange,
    commandParam,
  } = props

  const dispatch = useDispatch();

  const selectedTask = useSelector(state => state.app.selectedTask);

  const user = useSelector(state => state.user);

  const users = useSelector(state => state.users);

  const [results, setResults] = useState([])
  const [selection, setSelection] = useState(0)

  const handleAddAssignee = async (username) => {
    dispatch(tasksActions.handleAddAssignee(selectedTask, username))
    onCommandChange(null)
  }
  const handleAddAnonymousAssignee = async (username) => {
    dispatch(tasksActions.handleAddAnonymousAssignee(selectedTask, username))
    onCommandChange(null)
  }
  useEffect(() => {
    const nextKeyword = commandParam?.trim()
    if (user.state === AuthState.SignedIn && nextKeyword) {
      dispatch(usersActions.handleSearchUsers(nextKeyword, selectedTask, "toAssign")).then(res => setResults(res))
    } else {
      setResults([])
    }
  }, [commandParam])

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        if (selection === 0) {
          handleAddAnonymousAssignee(commandParam.trim())
        } else {
          handleAddAssignee(results[selection - 1]) 
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        e.stopPropagation()
        if (selection > 0) {
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        e.stopPropagation()
        if (selection < results.length) {
          setSelection(selection + 1)
        }
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [selection, results])

  useEffect(() => {
    setSelection(0)
  }, [commandParam])

  return (
    <>
      {!commandParam && (
        <span className={styles.NoKeyword}>
          Search For Assignees
        </span>
      )}
      {commandParam && <div
        className={[
          styles.AssigneeSuggestion,
          ...(selection === 0 && [styles.selected] || [])
        ].join(" ")}
        key="::anonymous::"
        onMouseEnter={() => setSelection(0)}
        onClick={() => handleAddAnonymousAssignee(commandParam.trim())}
      >
        <Avatar user={{name: commandParam[0]}} size={32} circular />
        <div>
          <span>{commandParam}</span>
          <span>Anonymous Assignee</span>
        </div>
      </div>}
      {results.map((x, i) => (
        <div
          className={[
            styles.AssigneeSuggestion,
            ...(selection === i + 1 && [styles.selected] || [])
          ].join(" ")}
          key={x}
          onMouseEnter={() => setSelection(i + 1)}
          onClick={() => handleAddAssignee(x)}
        >
          <Avatar user={users[x]} size={32} circular />
          <div>
            <span>{`${users[x].firstName} ${users[x].lastName}`}</span>
            <span>{users[x].email}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Assign;