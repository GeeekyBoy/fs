import React, { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as usersActions from "../../actions/users";
import styles from "./AssigneeChooser.module.scss"
import * as tasksActions from "../../actions/tasks"
import { panelPages, AuthState } from "../../constants";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as AssigneeSearchIllustartion } from "../../assets/undraw_People_search_re_5rre.svg"
import { ReactComponent as NoResultsIllustartion } from "../../assets/undraw_not_found_60pq.svg"
import Avatar from '../UI/Avatar';
import Illustration from '../UI/Illustration';

const AssigneeChooser = forwardRef((props, ref) => {
  const {
    app: {
      selectedTask
    },
    tasks,
    user,
    users,
    dispatch
  } = props;

  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])
  const [isBusy, setIsBusy] = useState(false)
  const [pendingUser, setPendingUser] = useState(null)

  const closeChooser = () => {
    return dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
  }
  const handleAssignTask = async (username) => {
    setPendingUser(username)
    setIsBusy(true)
    try {
      await dispatch(tasksActions.handleAssignTask(selectedTask, username))
      closeChooser()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
    }
  }
  const filterResults = (results, tasks, selectedTask) => {
    const currAssignees = tasks[selectedTask].assignees.filter(x => /^user:.*$/.test(x) & x !== pendingUser)
    return results.filter(x => !currAssignees.includes(`user:${x}`))
  }
  const filteredResults = useMemo(
    () => filterResults(results, tasks, selectedTask),
    [results, tasks, selectedTask]
  )
  const handleChangeKeyword = (e) => {
    const nextKeyword = e.target.value
    if (!keyword) {
      setResults([])
    }
    setKeyword(nextKeyword)
    if (user.state === AuthState.SignedIn && nextKeyword.trim()) {
      dispatch(usersActions.handleSearchUsers(nextKeyword)).then(res => setResults(res))
    } else {
      setResults([])
    }
  }
  const shareTask = () => {
      const linkToBeCopied = window.location.href
      navigator.clipboard.writeText(linkToBeCopied)
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Add Assignee",
      actionIcon: ShareIcon,
      onClose: () => {
        closeChooser()
      },
      onAction: () => {
        shareTask();
      }
    }
  }));
  return (
    <>
      <input
        className={styles.KeywordField}
        type="text"
        name="keyword"
        placeholder="Start searching…"
        onChange={handleChangeKeyword}
        disabled={isBusy}
        value={keyword}
      />
      <div className={styles.SearchResults}>
        {keyword &&
        (pendingUser === `anonymous:${keyword.trim()}` ||
        !tasks[selectedTask].assignees.includes(`anonymous:${keyword.trim()}`)) && (
          <button
            className={styles.SearchResultsItem}
            key="::anonymous::"
            disabled={isBusy}
            onClick={() => handleAssignTask(`anonymous:${keyword.trim()}`)}
          >
            <Avatar user={{name: keyword}} size={32} circular />
            <div>
              <span>{keyword.trim()}</span>
              <span>Anonymous Assignee</span>
            </div>
          </button>
        )}
        {keyword && filteredResults.map(x => (
          <button
            className={styles.SearchResultsItem}
            key={x}
            disabled={isBusy}
            onClick={() => handleAssignTask(`user:${x}`)}
          >
            <Avatar user={users[x]} size={32} circular />
            <div>
              <span>{`${users[x].firstName} ${users[x].lastName}`}</span>
              <span>@{x}</span>
            </div>
          </button>
        ))}
        {!keyword && (
          <Illustration
            illustration={AssigneeSearchIllustartion}
            title="Search For A User To Assign"
            secondary={true}
          />
        )}
        {keyword &&
        !filteredResults.length &&
        pendingUser !== `anonymous:${keyword.trim()}` &&
        tasks[selectedTask].assignees.includes(`anonymous:${keyword.trim()}`) && (
          <Illustration
            illustration={NoResultsIllustartion}
            title="No Results Found"
            secondary={true}
          />
        )}
      </div>
    </>
  );
});

AssigneeChooser.displayName = "AssigneeChooser";

export default connect((state) => ({
  user: {
    state: state.user.state,
  },
  tasks: state.tasks,
  app: {
    selectedTask: state.app.selectedTask
  },
  users: state.users
}), null, null, { forwardRef: true })(AssigneeChooser);
