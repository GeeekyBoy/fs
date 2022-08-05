import React, { useRef, useMemo, memo, useEffect, useState } from "react"
import styles from "./Task.module.scss"
import formatDate from "../../utils/formatDate"
import { ReactComponent as CheckmarkIcon } from "@fluentui/svg-icons/icons/checkmark_16_filled.svg";
import { ReactComponent as OptionsIcon } from "@fluentui/svg-icons/icons/more_vertical_16_filled.svg";
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_16_regular.svg"
import { ReactComponent as CopyIcon } from "@fluentui/svg-icons/icons/copy_16_regular.svg"
import { ReactComponent as DuplicateIcon } from "@fluentui/svg-icons/icons/document_copy_16_regular.svg"
import { ReactComponent as ShareIcon } from "@fluentui/svg-icons/icons/share_16_regular.svg"
import { ReactComponent as DetailsIcon } from "@fluentui/svg-icons/icons/chevron_right_16_regular.svg"
import { ReactComponent as DragIcon } from "@fluentui/svg-icons/icons/re_order_dots_vertical_16_filled.svg";
import SlashCommands from "../SlashCommands";
import AvatarGroup from "../UI/AvatarGroup";
import Checkbox from "./fields/Checkbox";
import IconButton from "./IconButton";

const lastTaskCaretPos = { current: null };

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
    onBatchSelect,
    onBatchDeselect,
    mobile,
    shouldAutoFocus,
    showDueDate,
    showAssignees,
    showDoneIndicator,
    showCopyButton,
    showDuplicateButton,
    showShareButton,
    assignees,
    selected,
    batchSelected,
    readOnly,
    listeners,
    isSorting,
    isDragging,
    isBatchSelecting,
  } = props;

  const inputRef = useRef(null);
  const grabberRef = useRef(null);
  const wasUnselected = useRef(true);
  const shellLongPressTimeout = useRef(null);
  const typingIdleTimeout = useRef(null);
  const taskCaretPos = useRef(task.length);
  const commandCaretPos = useRef(null);

  const [command, setCommand] = useState(null);

  const getSlashCommandsPos = (inputRef) => {
    if (document.activeElement === inputRef.current) {
      const selection = document.getSelection();
      const caretPos = selection.getRangeAt(0).getBoundingClientRect();
      const leftPos = caretPos.left - 160;
      return {
        top: caretPos.top + 30,
        left: leftPos < 120
          ? 120
          : leftPos > window.innerWidth - 360
            ? window.innerWidth - 360
            : leftPos,
      };
    } else {
      return {
        top: 0,
        left: 0,
      };
    }
  };

  const slashCommandsPos = useMemo(() => getSlashCommandsPos(inputRef), [taskCaretPos.current, commandCaretPos.current]);
  
  const handleTaskInput = (e) => {
    if (onChange) {
      taskCaretPos.current = document.getSelection().focusOffset;
      onChange({
        target: {
          id: id,
          value: e.target.innerText,
        },
      });
    }
  };

  const handleToggleStatus = () => {
    if (onToggleStatus) {
      onToggleStatus(status === "done" ? "todo" : "done");
    }
  };

  const handleKeyUp = (e) => {
    if (
      e.key === "Enter" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "Escape" ||
      e.key === "/"
    ) {
      e.preventDefault();
    }
    taskCaretPos.current = document.getSelection().focusOffset;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onEnter) onEnter(id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (onArrowUp) {
        lastTaskCaretPos.current = taskCaretPos.current;
        onArrowUp(id);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (onArrowDown) {
        lastTaskCaretPos.current = taskCaretPos.current;
        onArrowDown(id);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (onEscape) onEscape(id);
    } else if (e.key === "/" && !command) {
      e.preventDefault();
      commandCaretPos.current = 0;
      clearTimeout(typingIdleTimeout.current);
      setCommand("");
    }
  };

  const handleCommandInput = (e) => {
    commandCaretPos.current = document.getSelection().focusOffset;
    setCommand(e.target.innerText || null);
  };

  const handleCommandKeyUp = (e) => {
    if (
      e.key === "Enter" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "Escape"
    ) {
      e.preventDefault();
    }
    commandCaretPos.current = document.getSelection().focusOffset;
  };

  const setCommandAndMoveCaretToEnd = (nextCommand) => {
    commandCaretPos.current = nextCommand.length;
    setCommand(nextCommand);
  }

  const handleSelect = () => {
    if (onSelect && !selected) {
      onSelect(id);
    }
    taskCaretPos.current = document.getSelection().focusOffset;
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy(id);
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate && !readOnly) {
      onDuplicate(id);
    }
  };

  const handleShare = () => {
    const linkToBeCopied = window.location.href;
    navigator.clipboard.writeText(linkToBeCopied);
    if (onShare) {
      onShare(id);
    }
  };

  const handleRemove = () => {
    if (onRemove && !readOnly) {
      onRemove(id);
    }
  };

  const handleDetails = () => {
    if (onDetails) {
      onDetails(id);
    }
  };

  const handleBatchToggle = () => {
    if (batchSelected) {
      onBatchDeselect && onBatchDeselect(id);
    } else {
      onBatchSelect && onBatchSelect(id);
    }
  };

  const handleShellClick = () => {
    if (isBatchSelecting) {
      handleBatchToggle();
    }
  }

  const handleShellPointerDown = (e) => {
    if (!isBatchSelecting && !isSorting && mobile && !grabberRef.current?.contains(e.target)) {
      shellLongPressTimeout.current = setTimeout(() => {
        handleBatchToggle();
      }, 500);
    }
  }

  const handleShellPointerUp = () => {
    clearTimeout(shellLongPressTimeout.current);
  }

  const setCaretPos = (caretPos) => {
    if (inputRef.current) {
      const textNode = inputRef.current.childNodes[0];
      const selection = document.getSelection();
      selection.collapse(textNode, caretPos);
    }
  }

  const focusInput = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }

  useEffect(() => {
    if (selected) {
      if (wasUnselected.current) {
        if (lastTaskCaretPos.current !== null) {
          const caretPos = lastTaskCaretPos.current < task.length
            ? lastTaskCaretPos.current
            : task.length
          lastTaskCaretPos.current = null;
          taskCaretPos.current = caretPos;
          setCaretPos(caretPos);
        }
        wasUnselected.current = false;
      } else {
        if (command !== null) {
          setCaretPos(commandCaretPos.current);
        } else {
          setCaretPos(taskCaretPos.current);
        }
      }
      if (shouldAutoFocus) focusInput();
    } else {
      setCommand(null);
      wasUnselected.current = true;
    }
  }, [selected, command, task]);

  return (
    <div
      className={[
        styles.TaskItemShell,
        ...(isSorting && [styles.sorting] || []),
        ...(isDragging && [styles.dragging] || [])
      ].join(" ")}
      onClick={handleShellClick}
      onPointerDown={handleShellPointerDown}
      onPointerUp={handleShellPointerUp}
    >
      <div
        className={[
          styles.TaskItemCore,
          ...(isSorting && [styles.sorting] || []),
          ...(isDragging && [styles.dragging] || []),
          ...(selected && [styles.focused] || []),
          ...(batchSelected && [styles.batchSelected] || []),
          ...(isBatchSelecting && [styles.isBatchSelecting] || [])
        ].join(" ")}
      >
        <div className={styles.TaskItemExtras}>
          {!isBatchSelecting ? (
            <DragIcon
              {...listeners}
              fill="currentColor"
              color="var(--color-fill-color-text-tertiary)"
              cursor="grab"
              ref={grabberRef}
            />
          ) : (
            <div className={styles.DragIconPlaceholder} />
          )}
          {!(mobile && !isBatchSelecting) && (
            <Checkbox
              value={batchSelected}
              onChange={handleBatchToggle}
              className={styles.BatchCheckboxOverride}
            />
          )}
        </div>
        <div className={styles.TaskItemLeftPart}>
          <div className={styles.TaskItemLeftLeftPart}>
            {showDoneIndicator && !isBatchSelecting && (
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
                    fill="currentColor"
                    width={24}
                    height={24}
                  />
                )}
              </button>
            )}
            {command !== null && selected ? (
              <div className={styles.TaskItemCommandInput}>
                <span>{task.slice(0, taskCaretPos.current)}</span>
                <span
                  ref={inputRef}
                  onKeyUp={handleCommandKeyUp}
                  onInput={handleCommandInput}
                  contentEditable 
                  suppressContentEditableWarning
                >
                  {command}
                </span>
                <span>{task.slice(taskCaretPos.current)}</span>
              </div>
            ) : (
              <span
                className={[
                  styles.TaskItemInput,
                  ...(status === "done" && [styles.done] || [])
                ].join(" ")}
                ref={inputRef}
                onClick={handleSelect}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                onInput={handleTaskInput}
                contentEditable 
                readOnly={readOnly}
                suppressContentEditableWarning
              >
                {task || ""}
              </span>
            )}
          </div>
          <div className={styles.TaskItemLeftRightPart}>
            {!mobile && !isBatchSelecting && !isSorting &&
            <div className={styles.TaskItemActions}>
              {((selected && showCopyButton) || !selected) && (
                <IconButton icon={CopyIcon} onClick={handleCopy} />
              )}
              {!readOnly && ((selected && showDuplicateButton) || !selected) && (
                <IconButton icon={DuplicateIcon} onClick={handleDuplicate} />
              )}
              {((selected && showShareButton) || !selected) && (
                <IconButton icon={ShareIcon} onClick={handleShare} />
              )}
              {!readOnly && (
                <IconButton icon={RemoveIcon} onClick={handleRemove} />
              )}
              <IconButton icon={DetailsIcon} onClick={handleDetails} />
            </div>}
          </div>
        </div>
        {!selected && (
          <div
            className={[
              styles.TaskItemRightPart,
              ...(selected && [styles.focused] || []),
            ].join(" ")}
          >
            {showAssignees && !batchSelected && (
              <AvatarGroup
                max={!mobile ? 4 : 3}
                users={assignees}
                size={!mobile ? 24 : 18}
              />
            )}
            {showDueDate && !batchSelected && (
              <span className={styles.TaskItemDueDate}>
                {due ? formatDate(due) : "No Due"}
              </span>
            )}
          </div>
        )}
        {mobile && !isBatchSelecting && (
          <button className={styles.TaskItemOptsBtn} onClick={handleDetails}>
            <OptionsIcon fill="currentColor" />
          </button>
        )}
      </div>
      {(command !== null && selected) && (
        <SlashCommands
          command={command}
          posInfo={slashCommandsPos}
          onCommandChange={setCommandAndMoveCaretToEnd}
        />
      )}
    </div>
  );
};

export default memo(TaskItem);
