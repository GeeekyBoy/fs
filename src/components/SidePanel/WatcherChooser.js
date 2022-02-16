import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import styles from "./WatcherChooser.module.scss"
import * as tasksActions from "../../actions/tasks"
import * as usersActions from "../../actions/users"
import { panelPages, AuthState } from "../../constants";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as WatcherSearchIllustartion } from "../../assets/undraw_People_search_re_5rre.svg"
import { ReactComponent as NoResultsIllustartion } from "../../assets/undraw_not_found_60pq.svg"
import Avatar from '../UI/Avatar';
import Illustration from '../UI/Illustration';

const WatcherChooser = forwardRef((props, ref) => {
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
  const handleAddWatcher = async (username) => {
    setPendingUser(username)
    setIsBusy(true)
    try {
      await dispatch(tasksActions.handleAddWatcher(selectedTask, username))
      closeChooser()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
    }
  }
  const filterResults = (results, tasks, selectedTask) => {
    const currWatchers = tasks[selectedTask].watchers.filter(x => x !== pendingUser)
    return results.filter(x => !currWatchers.includes(x))
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
      title: "Add Watcher",
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
        {keyword && filteredResults.map(x => (
          <button
            className={styles.SearchResultsItem}
            key={x}
            disabled={isBusy}
            onClick={() => handleAddWatcher(x)}
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
          illustration={WatcherSearchIllustartion}
          title="Search For A Watcher"
          secondary={true}
        />
        )}
        {keyword &&
        !filteredResults.length && (
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

WatcherChooser.displayName = "WatcherChooser";

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  users: state.users
}), null, null, { forwardRef: true })(WatcherChooser);