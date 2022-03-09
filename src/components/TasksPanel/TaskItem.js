import React, { useRef, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "../../components/WindowSizeListener";
import copyTaskCore from "../../utils/copyTask"
import generateRank from "../../utils/generateRank";
import * as appActions from "../../actions/app";
import * as tasksActions from "../../actions/tasks";
import SlashCommands from "../SlashCommands";
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
  
  const selectedProject = useSelector(state => state.app.selectedProject)
  const nextTaskRank = useSelector(state => state.tasks[nextTask]?.rank)
  const taskAddingStatus = useSelector(state => state.app.taskAddingStatus)
  const isRightPanelOpened = useSelector(state => state.app.isRightPanelOpened)
  const isSynced = useSelector(state => state.app.isSynced)
  const lockedTaskField = useSelector(state => state.app.lockedTaskField)
  const command = useSelector(state => state.app.command)

  const showDueDate = useSelector(state => state.appSettings.showDueDate)
  const showAssignees = useSelector(state => state.appSettings.showAssignees)
  const showDoneIndicator = useSelector(state => state.appSettings.showDoneIndicator)
  const showCopyButton = useSelector(state => state.appSettings.showCopyButton)
  const showDuplicateButton = useSelector(state => state.appSettings.showDuplicateButton)
  const showShareButton = useSelector(state => state.appSettings.showShareButton)

  const selectedTask = useSelector(state => state.app.selectedTask)
  const taskViewers = useSelector(state => state.collaboration.taskViewers)

  const users = useSelector(state => state.users)
  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.projects)

  useEffect(() => {
    if (selectedTask === item.id) {
      setTimeout(() => {
        if (!(isRightPanelOpened || isModalOpened)) {
          inputRef.current?.focus()
        } else {
          inputRef.current?.blur()
        }
      }, 0)
    }
  }, [isRightPanelOpened, isModalOpened, selectedTask])

  const processAssingees = (value, users) => {
    const result = []
    for (const assignee of value) {
      const isValidAssignee = /^(user|anonymous):(.*)$/.test(assignee)
      if (isValidAssignee) {
        const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
        const isUser = assigneeType === "user"
        if (isUser) {
          result.push({...users[assigneeID], isUser})
        } else {
          result.push({ name: assigneeID, isUser })
        }
      }
    }
    return result
  }

  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return (user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)) ||
    (user.state !== AuthState.SignedIn && projects[selectedProject]?.isTemp)
  }

  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])
  
  const processedAssingees = useMemo(() => processAssingees(item.assignees, users), [item.assignees, users]);

  const getSlashCommandsPos = (inputRef) => {
    if (inputRef.current) {
      const inputPos = inputRef.current.getBoundingClientRect()
      const cursorPos = 
        inputRef.current.selectionStart * 9.6 < inputPos.left - 40 ?
        inputPos.left - 40 :
        inputRef.current.selectionStart * 9.6
      return {
        top: inputPos.top + 40,
        left: inputPos.left - 160 + cursorPos
      }
    } else {
      return {
        top: 0,
        left: 0
      }
    }
  }

  const slashCommandsPos = useMemo(() => getSlashCommandsPos(inputRef), [item])

  const handleChange = (e) => {
    if (lockedTaskField !== "task") {
      dispatch(appActions.setLockedTaskField("task"))
    }
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        task: e.target.value,
      })
    );
  };

  const handleToggleStatus = (nextStatus) => {
    dispatch(
      tasksActions.handleUpdateTask({
        id: item.id,
        status: nextStatus,
      })
    );
  };

  const handleArrowUp = () => {
    if (!prevTask) {
      dispatch(appActions.handleSetProjectTitle(true))
    } else {
      dispatch(appActions.handleSetTask(prevTask))
    }
  }

  const handleArrowDown = () => {
    if (nextTask) {
      dispatch(appActions.handleSetTask(nextTask))
    }
  }

  const handleEnter = () => {
    if (taskAddingStatus === OK && !readOnly) {
      dispatch(
        tasksActions.handleCreateTask(
          initTaskState(
            selectedProject,
            generateRank(item.rank, nextTaskRank),
          )
        )
      );
    }
  }

  const handleEscape = () => {
    dispatch(appActions.handleSetTask(null))
  }

  const handleSelect = () => {
    dispatch(appActions.handleSetTask(item.id))
  }

  const handleDetails = () => {
    if (width < 768) {
      dispatch(
        appActions.handleSetTask(item.id)
      )
      showModal(modals.TASK_OPTS)
    } else {
      if (item.id !== selectedTask) {
        dispatch(appActions.handleSetTask(item.id))
      }
      if (!isRightPanelOpened) {
        dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
        dispatch(appActions.handleSetRightPanel(true))
      }
    }
  }

  const handleCopy = () => {
    window.localStorage.setItem(
      "tasksClipboard",
      "COPIEDTASKSTART=>" +
      JSON.stringify(item) +
      "<=COPIEDTASKEND"
    );
  }

  const handleDuplicate = () => {
    dispatch(
      tasksActions.handleCreateTask(
        copyTaskCore(
          item,
          selectedProject,
          generateRank(item.rank, nextTaskRank),
        )
      )
    );
  }

  const handleShare = () => {
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
  }

  const handleRemove = () => {
    dispatch(tasksActions.handleRemoveTask(item, prevTask))
  }

  return (
    <Task
      id={item.id}
      task={item.task}
      status={item.status}
      due={item.due}
      onChange={handleChange}
      onSelect={handleSelect}
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
      taskViewers={taskViewers}
      showDueDate={showDueDate}
      showAssignees={showAssignees}
      showDoneIndicator={showDoneIndicator}
      showCopyButton={showCopyButton}
      showDuplicateButton={showDuplicateButton}
      showShareButton={showShareButton}
      assignees={processedAssingees}
      selected={item.id === selectedTask}
      command={command}
      readOnly={readOnly}
      listeners={listeners}
      isSorting={isSorting}
      isDragging={isDragging}
    />
  );
};

export default TaskItem;
