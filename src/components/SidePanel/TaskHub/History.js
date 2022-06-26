import React from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../../UI/Avatar';
import formatDate from '../../../utils/formatDate';
import styles from "./History.module.scss";
import { convertFromRaw } from 'draft-js';

const History = () => {

  const history = useSelector(state => state.history)

  const users = useSelector(state => state.users)

  return (
    <div className={styles.HistoryContainer}>
      {history.map(({ action, field, value, owner, createdAt }, index) => (
        <div key={index} className={styles.HistoryItem}>
          <div className={styles.HistoryOwnerAvatar}>
            <div className={styles.AvatarContainer}>
              <Avatar
                size={42}
                user={users[owner]}
                circular
              />
            </div>
          </div>
          <div className={styles.HistoryContent}>
            <div className={styles.HistoryOwner}>
              {users[owner]
                ? `${users[owner]?.firstName} ${users[owner]?.lastName}`
                : "Deleted User"
              }
            </div>
            <div className={styles.HistoryDate}>
              {formatDate(createdAt)}
            </div>
            <div className={styles.HistoryItemInfo}>
              {field === "assignees" && action === "append" && (
                <span>
                  assigned task to&nbsp;
                  {
                    <Avatar
                      size={24}
                      user={users[value]}
                      circular
                    />
                  }
                  &nbsp;<b>{value}</b>.
                </span> 
              )}
              {field === "assignees" && action === "remove" && (
                <span>
                  removed&nbsp;
                  {
                    <Avatar
                      size={24}
                      user={users[value]}
                      circular
                    />
                  }
                  &nbsp;<b>{value}</b>&nbsp;from task.
                </span> 
              )}
              {field === "anonymousAssignees" && action === "append" && (
                <span>
                  assigned task to anonymous assignee&nbsp;
                  &quot;<b>{value}</b>&quot;.
                </span> 
              )}
              {field === "anonymousAssignees" && action === "remove" && (
                <span>
                  removed anonymous assignee&nbsp;
                  &quot;<b>{value}</b>&quot; from task.
                </span> 
              )}
              {field === "invitedAssignees" && action === "append" && (
                <span>
                  invited&nbsp;
                  &quot;<b>{value}</b>&quot; to be assigned.
                </span> 
              )}
              {field === "invitedAssignees" && action === "remove" && (
                <span>
                  invited&nbsp;
                  &quot;<b>{value}</b>&quot; to be assigned.
                </span> 
              )}
              {field === "watchers" && action === "append" && (
                <span>
                  added&nbsp;
                  {
                    <Avatar
                      size={24}
                      user={users[value]}
                      circular
                    />
                  }
                  &nbsp;<b>{value}</b> to task watchers.
                </span> 
              )}
              {field === "watchers" && action === "remove" && (
                <span>
                  removed&nbsp;
                  {
                    <Avatar
                      size={24}
                      user={users[value]}
                      circular
                    />
                  }
                  &nbsp;<b>{value}</b>&nbsp;from task watchers.
                </span> 
              )}
              {field === "due" && action === "update" && (
                parseInt(value, 10) ? (
                  <span>
                    changed due date to&nbsp;
                    <b>{formatDate(value)}</b>.
                  </span>
                ) : (
                  <span>
                    cleared task due date.
                  </span>
                )
              )}
              {field === "priority" && action === "update" && (
                <span>
                  changed priority to&nbsp;
                  <b>{value}</b>.
                </span>
              )}
              {field === "status" && action === "update" && (
                <span>
                  changed status to&nbsp;
                  <b>{value}</b>.
                </span>
              )}
              {field === "comment" && action === "create" && (
                <span>
                  commented&nbsp;
                  &quot;<b>{convertFromRaw(JSON.parse(value)).getPlainText()}</b>&quot;.
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default History;