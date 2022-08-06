import React, { useState, useEffect, useMemo } from 'react';
import styles from "./Status.module.scss"
import * as tasksActions from "../../actions/tasks"
import { useDispatch, useSelector } from "react-redux";

const Status = (props) => {
  const {
    commandParam,
    onCommandChange,
    scrollableNodeRef,
  } = props

  const dispatch = useDispatch()

  const selectedTask = useSelector(state => state.app.selectedTask);

  const supportedStatus = [["Todo", "#FF1744"], ["Started", "#FF9100"], ["Finished", "#00E676"]]

  const getSuggestedStatus = (commandParam) => {
    return supportedStatus.filter(x => new RegExp(`^${commandParam || ".*"}`, "i").test(x[0]))
  }

  const suggestedStatus = useMemo(() => getSuggestedStatus(commandParam), [commandParam])

  const [selection, setSelection] = useState(0)

  const chooseStatus = (selectedStatus) => {
    switch(selectedStatus) {
      case "TODO":
        onCommandChange(null)
        return dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          action: "update",
          field: "status",
          value: "todo"
        }))
      case "STARTED":
        onCommandChange(null)
        return dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          action: "update",
          field: "status",
          value: "pending"
        }))
      case "FINISHED":
        onCommandChange(null)
        return dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          action: "update",
          field: "status",
          value: "done"
        }))
      default:
        return 0
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      const scrollableElem = scrollableNodeRef?.current
      const scrollableElemHeight = scrollableElem?.getBoundingClientRect().height
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        chooseStatus(suggestedStatus[selection][0].toUpperCase()) 
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        e.stopPropagation()
        if (selection > 0) {
          const minHeight = scrollableElem?.scrollTop - 47 * (selection - 1) + scrollableElemHeight - 15
          if (scrollableElemHeight < minHeight) {
            scrollableElem?.scrollBy(0, scrollableElemHeight - minHeight)
          }
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        e.stopPropagation()
        if (selection < suggestedStatus.length - 1) {
          const minHeight = 15 + 47 * (selection + 2) - scrollableElem?.scrollTop
          if (scrollableElemHeight < minHeight) {
            scrollableElem?.scrollBy(0, minHeight - scrollableElemHeight)
          }
          setSelection(selection + 1)
        }
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [selection, suggestedStatus])

  useEffect(() => {
    setSelection(0)
  }, [commandParam])

  return (
    <>
      {suggestedStatus.map((x, i) => (
        <div
          className={[
            styles.StatusSuggestion,
            ...(selection === i && [styles.selected] || [])
          ].join(" ")}
          key={x}
          onMouseEnter={() => setSelection(i)}
          onClick={() => chooseStatus(x[0].toUpperCase())}
        >
          <div>
            <span style={{ color: x[1], marginRight: 10 }}>⬤</span>
            <span>{x[0]}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Status;