import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as usersActions from "../../actions/users";
import styles from "./AssigneeChooser.module.scss"
import * as tasksActions from "../../actions/tasks"
import { AuthState } from "../../constants";
import { ReactComponent as SearchIcon } from "../../assets/search-outline.svg"
import { ReactComponent as AssigneeSearchIllustartion } from "../../assets/undraw_People_search_re_5rre.svg"
import { ReactComponent as NoResultsIllustartion } from "../../assets/undraw_not_found_60pq.svg"
import Avatar from '../UI/Avatar';
import Illustration from '../UI/Illustration';
import { useModal } from '../ModalManager';
import Modal from '../UI/Modal';
import TextField from '../UI/fields/TextField';

const AssigneeChooser = () => {
  const dispatch = useDispatch();

  const userState = useSelector(state => state.user.state);

  const tasks = useSelector(state => state.tasks);

  const users = useSelector(state => state.users);

  const selectedTask = useSelector(state => state.app.selectedTask);
  const selectedTasks = useSelector(state => state.app.selectedTasks);

  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])
  const [isBusy, setIsBusy] = useState(false)
  const [pendingUser, setPendingUser] = useState(null)
  const [pendingUserType, setPendingUserType] = useState(null)
  const { modalRef, hideModal } = useModal();

  const handleAddAssignee = async (username) => {
    setPendingUser(username)
    setPendingUserType("assignee")
    setIsBusy(true)
    try {
      if (selectedTask) {
        await dispatch(tasksActions.handleAddAssignee(selectedTask, username))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          await dispatch(tasksActions.handleAddAssignee(task, username))
        }
      }
      hideModal()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
      setPendingUserType(null)
    }
  }
  const handleAddAnonymousAssignee = async (username) => {
    setPendingUser(username)
    setPendingUserType("anonymousAssignee")
    setIsBusy(true)
    try {
      if (selectedTask) {
        await dispatch(tasksActions.handleAddAnonymousAssignee(selectedTask, username))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          await dispatch(tasksActions.handleAddAnonymousAssignee(task, username))
        }
      }
      hideModal()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
      setPendingUserType(null)
    }
  }
  const handleAddInvitedAssignee = async (username) => {
    setPendingUser(username)
    setPendingUserType("invitedAssignee")
    setIsBusy(true)
    try {
      if (selectedTask) {
        await dispatch(tasksActions.handleAddInvitedAssignee(selectedTask, username))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          await dispatch(tasksActions.handleAddInvitedAssignee(task, username))
        }
      }
      hideModal()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
      setPendingUserType(null)
    }
  }
  const handleChangeKeyword = (e) => {
    const nextKeyword = e.target.value
    if (!keyword) {
      setResults([])
    }
    setKeyword(nextKeyword)
    if (userState === AuthState.SignedIn && nextKeyword.trim()) {
      dispatch(usersActions.handleSearchUsers(nextKeyword, selectedTask || selectedTasks[0], "toAssign")).then(res => setResults(res))
    } else {
      setResults([])
    }
  }
  return (
    <Modal
      title="Add Assignee"
      primaryButtonText="Cancel"
      primaryButtonDisabled={isBusy}
      onPrimaryButtonClick={hideModal}
      modalRef={modalRef}
    >
      <TextField
        type="text"
        name="keyword"
        placeholder="Start searching…"
        onChange={handleChangeKeyword}
        disabled={isBusy}
        value={keyword}
        prefix={() => (
          <SearchIcon
            width={18}
            height={18}
            strokeWidth={32}
            style={{
              marginRight: 5
            }}
          />
        )}
      />
      <div className={styles.SearchResults}>
        {keyword &&
        ((pendingUser === keyword.trim() && pendingUserType === "anonymousAssignee") ||
        !tasks[selectedTask || selectedTasks[0]].anonymousAssignees.includes(keyword.trim())) && (
          <button
            className={styles.SearchResultsItem}
            key="::anonymous::"
            disabled={isBusy}
            onClick={() => handleAddAnonymousAssignee(keyword.trim())}
          >
            <Avatar user={{name: keyword}} size={32} circular />
            <div>
              <span>{keyword.trim()}</span>
              <span>Anonymous Assignee</span>
            </div>
          </button>
        )}
        {keyword.match(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/) &&
        ((pendingUser === keyword.trim() && pendingUserType === "invitedAssignee") ||
        !tasks[selectedTask || selectedTasks[0]].invitedAssignees.includes(keyword.trim())) && (
          <button
            className={styles.SearchResultsItem}
            key="::invited::"
            disabled={isBusy}
            onClick={() => handleAddInvitedAssignee(keyword.trim())}
          >
            <Avatar user={{name: keyword}} size={32} circular />
            <div>
              <span>{keyword.trim()}</span>
              <span>Assign &amp; invite to Forwardslash</span>
            </div>
          </button>
        )}
        {keyword && results.map(x => (
          <button
            className={styles.SearchResultsItem}
            key={x}
            disabled={isBusy}
            onClick={() => handleAddAssignee(x)}
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
            secondary
          />
        )}
        {keyword &&
        !results.length &&
        (pendingUser !== keyword.trim() && pendingUserType !== "anonymousAssignee") &&
        tasks[selectedTask || selectedTasks[0]].assignees.includes(`anonymous:${keyword.trim()}`) && (
          <Illustration
            illustration={NoResultsIllustartion}
            title="No Results Found"
            secondary
          />
        )}
      </div>
    </Modal>
  );
};

export default AssigneeChooser;
