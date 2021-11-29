import React, { useState, useEffect } from 'react';
import styles from "./Assign.module.scss"
import { connect } from "react-redux";
import * as usersActions from "../../actions/users";
import * as appActions from "../../actions/app"
import * as tasksActions from "../../actions/tasks"
import { AuthState } from "../../constants";
import Avatar from '../UI/Avatar';

const Assign = (props) => {
  const {
    app: {
      selectedTask
    },
    commandParam,
    user,
    users,
    dispatch
  } = props

  const [results, setResults] = useState([])
  const [selection, setSelection] = useState(0)

  const handleAssignTask = async (username) => {
    dispatch(tasksActions.handleAssignTask(selectedTask, username))
    dispatch(appActions.setCommand(""))
  }
  useEffect(() => {
    const nextKeyword = commandParam?.trim()
    if (user.state === AuthState.SignedIn && nextKeyword) {
      dispatch(usersActions.handleSearchUsers(nextKeyword)).then(res => setResults(res))
    } else {
      setResults([])
    }
  }, [commandParam])

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        if (selection === 0) {
          handleAssignTask(`anonymous:${commandParam}`) 
        } else {
          handleAssignTask(`user:${results[selection - 1].username}`) 
        }
      } else if (e.key === "ArrowUp") {
        if (selection > 0) {
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
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
        onClick={() => handleAssignTask(`anonymous:${commandParam}`)}
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
          key={x.username}
          onMouseEnter={() => setSelection(i + 1)}
          onClick={() => handleAssignTask(`user:${x.username}`)}
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

export default connect((state) => ({
	app: state.app,
	user: state.user,
	users: state.users
}))(Assign);