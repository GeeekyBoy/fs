import React, { useRef, useMemo, memo, useEffect } from "react"
import styles from "./Task.module.scss"
import formatDate from "../../utils/formatDate"
import { ReactComponent as CheckmarkIcon } from "../../assets/checkmark-outline.svg";
import { ReactComponent as OptionsIcon } from "../../assets/ellipsis-vertical.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../../assets/duplicate-outline.svg"
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as DetailsIcon } from "../../assets/information-circle-outline.svg";
//import SlashCommands from "../SlashCommands";
import AvatarGroup from "../UI/AvatarGroup";

const TaskItem = (props) => {

  const {
    id,
    task,
    status,
    due,
    onChange,
    onSelect,
    onToggleStatus,
    onCopy,
    onRemove,
    onDuplicate,
    onShare,
    onDetails,
    onArrowUp,
    onArrowDown,
    onEnter,
    onEscape,
    mobile,
    taskViewers,
    showDueDate,
    showAssignees,
    showDoneIndicator,
    showCopyButton,
    showDuplicateButton,
    showShareButton,
    assignees,
    selected,
    command,
    readOnly,
    listeners,
    isSorting,
    isDragging
  } = props;

  const inputRef = useRef(null)

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

  const slashCommandsPos = useMemo(() => getSlashCommandsPos(inputRef), [task])

  const handleChange = (e) => {
    if (onChange) {
      onChange({
        target: {
          id: id,
          value: e.target.value,
        },
      });
    }
  };

  const handleToggleStatus = () => {
    if (onToggleStatus) {
      onToggleStatus(status === "done" ? "todo" : "done")
    }
  }

  const handleKeyUp = (e) => {
    if (!command) {
      if (e.key === "Enter") {
        if (onEnter) onEnter(id)
      } else if (e.key === "ArrowUp") {
        if (onArrowUp) onArrowUp(id)
      } else if (e.key === "ArrowDown") {
        if (onArrowDown) onArrowDown(id)
      } else if (e.key === "Escape") {
        if (onEscape) onEscape(id)
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault()
    }
  }

  const handleSelect = () => {
    if (onSelect) {
      onSelect(id)
    }
  }

  const handleCopy = () => {
    if (onCopy) {
      onCopy(id)
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate && !readOnly) {
      onDuplicate(id)
    }
  }

  const handleShare = () => {
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
    if (onShare) {
      onShare(id)
    }
  }

  const handleRemove = () => {
    if (onRemove && !readOnly) {
      onRemove(id)
    }
  }

  const handleDetails = () => {
    if (onDetails) {
      onDetails(id)
    }
  }

  useEffect(() => {
    if (selected) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
    }
  }, [selected])

  return (
    <div
      {...listeners}
      className={[
        styles.TaskItemShell,
        ...(isSorting && [styles.sorting] || []),
        ...(isDragging && [styles.dragging] || [])
      ].join(" ")}
    >
      <div
        className={[
          styles.TaskItemCore,
          ...(isSorting && [styles.sorting] || []),
          ...(isDragging && [styles.dragging] || []),
          ...(taskViewers[id] && [styles.collaborativeFocused] || []),
          ...(selected && [styles.focused] || [])
        ].join(" ")}
        // style={{
        //   borderColor: taskViewers[id] && users[taskViewers[id][0]].color,
        // }}
      >
        <div className={styles.TaskItemLeftPart}>
          <div className={styles.TaskItemLeftLeftPart}>
            {showDoneIndicator && (
              <button
                className={[
                  styles.TaskItemStatusToggle,
                  ...(status === "done" && [styles.done] || [])
                ].join(" ")}
                onClick={handleToggleStatus}
                disabled={readOnly}
              >
                {status === "done" && (
                  <CheckmarkIcon
                    width={24}
                    height={24}
                  />
                )}
              </button>
            )}
            {selected ? (
              <div className={styles.TaskItemInput}>
                <input
                  type="text"
                  ref={inputRef}
                  className="task"
                  placeholder="Task…"
                  value={(task || "") + (command || "")}
                  onKeyUp={handleKeyUp}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                  contentEditable={false}
                  readOnly={readOnly}
                />
              </div>
            ) : (
              <span
                onClick={handleSelect}
                className={[
                  styles.TaskItemHeader,
                  ...(!task && [styles.placeholder] || []),
                  ...(status === "done" && [styles.done] || [])
                ].join(" ")}
              >
                {task || "Untitled Task"}
              </span>
            )}
          </div>
          <div className={styles.TaskItemLeftRightPart}>
            {!mobile &&
            <div className={styles.TaskItemActions}>
              {((selected && showCopyButton) || !selected) && (
                <button className={styles.TaskItemAction} onClick={handleCopy}>
                  <CopyIcon height={18} />
                </button>
              )}
              {!readOnly && ((selected && showDuplicateButton) || !selected) && (
                <button className={styles.TaskItemAction} onClick={handleDuplicate}>
                  <DuplicateIcon height={18} />
                </button>
              )}
              {((selected && showShareButton) || !selected) && (
                <button className={styles.TaskItemAction} onClick={handleShare}>
                  <ShareIcon height={18} />
                </button>
              )}
              {!readOnly && (
                <button className={styles.TaskItemAction} onClick={handleRemove}>
                  <RemoveIcon height={18} />
                </button>
              )}
              <button className={styles.TaskItemAction} onClick={handleDetails}>
                <DetailsIcon height={18} />
              </button>
            </div>}
          </div>
        </div>
        <div
          className={[
            styles.TaskItemRightPart,
            ...(selected && [styles.focused] || []),
          ].join(" ")}
        >
          {showAssignees && (
            <AvatarGroup
              max={!mobile ? 4 : 3}
              users={assignees}
              size={!mobile ? 24 : 18}
            />
          )}
          {showDueDate && (
            <span className={styles.TaskItemDueDate}>
              {due ? formatDate(due) : "No Due"}
            </span>
          )}
        </div>
        {mobile && (
          <button className={styles.TaskItemOptsBtn} onClick={handleDetails}>
            <OptionsIcon width={18} />
          </button>
        )}
      </div>
      {/* {(command && selected) && (
        <SlashCommands posInfo={slashCommandsPos} />
      )} */}
    </div>
  );
};

export default memo(TaskItem);
