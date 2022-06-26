import React, { useRef, useMemo, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "../../components/WindowSizeListener";
import copyTaskCore from "../../utils/copyTask"
import generateRank from "../../utils/generateRank";
import * as appActions from "../../actions/app";
import * as tasksActions from "../../actions/tasks";
import { useModal } from "../ModalManager";
import { OK, initTaskState, AuthState, panelPages } from "../../constants";
import modals from '../modals';
import Task from "../UI/Task";

const TaskItem = (props) => {

  const {
    item,
    nextTask,
    prevTask,
    listeners,
    isSorting,
    isDragging
  } = props;

  const { width } = useWindowSize();
  const { isModalOpened, showModal } = useModal();

  const inputRef = useRef(null)
  const dispatch = useDispatch()
  
  const nextTaskRank = useSelector(state => state.tasks[nextTask]?.rank)
  const taskAddingStatus = useSelector(state => state.app.taskAddingStatus)
  const isRightPanelOpened = useSelector(state => state.app.isRightPanelOpened)
  const isSynced = useSelector(state => state.app.isSynced)

  const showDueDate = useSelector(state => state.appSettings.showDueDate)
  const showAssignees = useSelector(state => state.appSettings.showAssignees)
  const showDoneIndicator = useSelector(state => state.appSettings.showDoneIndicator)
  const showCopyButton = useSelector(state => state.appSettings.showCopyButton)
  const showDuplicateButton = useSelector(state => state.appSettings.showDuplicateButton)
  const showShareButton = useSelector(state => state.appSettings.showShareButton)

  const isSelected = useSelector(state => state.app.selectedTask === item.id)
  const isLocked = useSelector(state => state.app.lockedTaskField && isSelected)
  const batchSelected = useSelector(state => state.app.selectedTasks?.includes(item.id))
  const isBatchSelecting = useSelector(state => state.app.selectedTasks != null)

  const users = useSelector(state => state.users)
  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.projects)

  useEffect(() => {
    if (isSelected) {
      setTimeout(() => {
        if (!(isRightPanelOpened || isModalOpened)) {
          inputRef.current?.focus()
        } else {
          inputRef.current?.blur()
        }
      }, 0)
    }
  }, [isRightPanelOpened, isModalOpened, isSelected])

  const processAssingees = (value, users) => {
    const result = []
    for (const assigneeId of value.assignees) {
      result.push({...users[assigneeId], username: assigneeId, isUser: true})
    }
    for (const assigneeId of value.anonymousAssignees) {
      result.push({ name: assigneeId, isUser: false })
    }
    return result
  }

  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return (user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)) ||
    (user.state !== AuthState.SignedIn && projects[selectedProject]?.isTemp)
  }

  const readOnly = useMemo(() => getReadOnly(user, projects, item.projectId, isSynced), [user, projects, item.projectId, isSynced])
  
  const processedAssingees = useMemo(() => {
    const allAssignees = {
      assignees: item.assignees,
      anonymousAssignees: item.anonymousAssignees,
      invitedAssignees: item.invitedAssignees
    }
    return processAssingees(allAssignees, users)
  }, [item.assignees, item.anonymousAssignees, item.invitedAssignees, users]);

  const handleChange = useCallback((e) => {
    if (isLocked) {
      dispatch(appActions.setLockedTaskField("task"))
    }
    dispatch(
      tasksActions.handleUpdateTask({
        id: item.id,
        action: "update",
        field: "task",
        value: e.target.value,
      })
    );
  }, [item.id, isLocked]);

  const handleToggleStatus = useCallback((nextStatus) => {
    dispatch(
      tasksActions.handleUpdateTask({
        id: item.id,
        action: "update",
        field: "status",
        value: nextStatus,
      })
    );
  }, [item.id]);

  const handleArrowUp = useCallback(() => {
    if (!prevTask) {
      dispatch(appActions.handleSetProjectTitle(true))
    } else {
      dispatch(appActions.handleSetTask(prevTask))
    }
  }, [prevTask]);

  const handleArrowDown = useCallback(() => {
    if (nextTask) {
      dispatch(appActions.handleSetTask(nextTask))
    }
  }, [nextTask]);

  const handleEnter = useCallback(() => {
    if (taskAddingStatus === OK && !readOnly) {
      dispatch(
        tasksActions.handleCreateTask(
          initTaskState(
            item.projectId,
            generateRank(item.rank, nextTaskRank),
            projects[item.projectId].defaultStatus,
          )
        )
      );
    }
  }, [taskAddingStatus, readOnly, item.rank, nextTaskRank]);

  const handleEscape = useCallback(() => {
    dispatch(appActions.handleSetTask(null))
  }, []);

  const handleSelect = useCallback(() => {
    dispatch(appActions.handleSetTask(item.id))
  }, [item.id]);

  const handleBatchSelect = useCallback(() => {
    dispatch(appActions.handleBatchSelectTask(item.id))
  }, [item.id]);

  const handleBatchDeselect = useCallback(() => {
    dispatch(appActions.handleBatchDeselectTask(item.id))
  }, [item.id]);

  const handleDetails = useCallback(() => {
    if (width < 768) {
      dispatch(
        appActions.handleSetTask(item.id)
      )
      showModal(modals.TASK_OPTS)
    } else {
      if (!isSelected) {
        dispatch(appActions.handleSetTask(item.id))
      }
      if (!isRightPanelOpened) {
        dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
        dispatch(appActions.handleSetRightPanel(true))
      }
    }
  }, [item.id, width, isRightPanelOpened, isSelected]);

  const handleCopy = useCallback(() => {
    window.localStorage.setItem(
      "tasksClipboard",
      "COPIEDTASKSTART=>" +
      JSON.stringify(item) +
      "<=COPIEDTASKEND"
    );
  }, [item]);

  const handleDuplicate = useCallback(() => {
    dispatch(
      tasksActions.handleCreateTask(
        copyTaskCore(
          item,
          item.projectId,
          generateRank(item.rank, nextTaskRank),
        )
      )
    );
  }, [item, nextTaskRank]);

  const handleShare = useCallback(() => {
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
  }, []);

  const handleRemove = useCallback(() => {
    dispatch(tasksActions.handleRemoveTask(item, prevTask))
  }, [item, prevTask]);

  return (
    <Task
      id={item.id}
      task={item.task}
      status={item.status}
      due={item.due}
      onChange={handleChange}
      onSelect={handleSelect}
      onBatchSelect={handleBatchSelect}
      onBatchDeselect={handleBatchDeselect}
      onToggleStatus={handleToggleStatus}
      onCopy={handleCopy}
      onRemove={handleRemove}
      onDuplicate={handleDuplicate}
      onShare={handleShare}
      onDetails={handleDetails}
      onArrowUp={handleArrowUp}
      onArrowDown={handleArrowDown}
      onEnter={handleEnter}
      onEscape={handleEscape}
      mobile={width < 768}
      showDueDate={showDueDate}
      showAssignees={showAssignees}
      showDoneIndicator={showDoneIndicator}
      showCopyButton={showCopyButton}
      showDuplicateButton={showDuplicateButton}
      showShareButton={showShareButton}
      assignees={processedAssingees}
      selected={isSelected}
      batchSelected={batchSelected}
      readOnly={readOnly}
      listeners={listeners}
      isSorting={isSorting}
      isDragging={isDragging}
      isBatchSelecting={isBatchSelecting}
    />
  );
};

export default TaskItem;
