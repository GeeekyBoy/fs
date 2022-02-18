import React, { memo } from "react"
import styles from "./ProjectCard.module.scss"
import formatDate from "../../utils/formatDate";
import ProgressRing from "./ProgressRing";
import { ReactComponent as GlobeIcon } from "../../assets/earth-outline.svg"
import { ReactComponent as DocumentLockIcon } from "../../assets/document-lock-outline.svg"
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"

const ProjectCard = (props) => {
  const {
    id,
    title,
    privacy,
    permalink,
    todoCount,
    pendingCount,
    doneCount,
    createdAt,
    readOnly,
    selected,
    onShare,
    onRemove,
    onSelect,
    listeners,
    class: className,
    style,
  } = props
  const shareProject = (e) => {
    e.stopPropagation()
    if (onShare) {
      onShare()
    }
  }
  const removeProject = (e) => {
    e.stopPropagation()
    if (!readOnly && onRemove) {
      onRemove(id)
    }
  }
  const selectProject = () => {
    if (!selected && onSelect) {
      onSelect(id)
    }
  } 
  return (
    <div
      className={[
        styles.ProjectCardShell,
        "noselect",
        className || "",
      ].join(" ")}
      onClick={() => selectProject(id)}
      style={style}
      {...listeners}
    >
      <div
        className={[
          styles.ProjectCardContainer,
          ...(selected && [styles.selected] || []),
        ].join(" ")}
      >
      <div className={styles.ProjectCardPermission}>
          {privacy === "public" && (
            <GlobeIcon
              height={200}
              width={200}
              strokeWidth={24}
            />
          )}
          {privacy === "private" && (
            <DocumentLockIcon
              height={200}
              width={200}
              strokeWidth={24}
            />
          )}
        </div>
        <div className={styles.ProjectCardLeftPart}>
          <div className={styles.ProjectCardHeader}>
            <span className={styles.ProjectCardTitle}>
              {title || "Untitled Project"}
            </span>
            <span className={styles.ProjectCardPermalink}>
              {permalink}
            </span>
          </div>
          <div className={styles.TasksCount}>
            <span
              className={[
                styles.TasksCountItem,
                styles.TodoTasksCount
              ].join(" ")}
            >
              {todoCount}
            </span>
            <span
              className={[
                styles.TasksCountItem,
                styles.PendingTasksCount
              ].join(" ")}
            >
              {pendingCount}
            </span>
            <span
              className={[
                styles.TasksCountItem,
                styles.DoneTasksCount
              ].join(" ")}
            >
              {doneCount}
            </span>
          </div>
          <span className={styles.ProjectCardDate}>
            Created {formatDate(new Date(createdAt).getTime())}
          </span>
        </div>
        <div className={styles.ProjectCardRightPart}>
          <ProgressRing
            radius={36}
            stroke={3.5}
            progress={doneCount / (todoCount + pendingCount + doneCount) * 100}
          />
          <div className={styles.ProjectCardActions}>
            <button className={styles.ProjectCardAction}>
              <ShareIcon
                onClick={shareProject}
                height={20}
                width={20}
              />
            </button>
            {!readOnly && (
              <button className={styles.ProjectCardAction}>
                <RemoveIcon
                  onClick={removeProject}
                  height={20}
                  width={20}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProjectCard);