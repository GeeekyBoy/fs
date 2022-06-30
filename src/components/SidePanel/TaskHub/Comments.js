import React, { useMemo } from 'react';
import { useOuterClick } from 'react-outer-click';
import { useState, useRef } from "react"
import { AuthState } from "../../../constants";
import styles from "./Comments.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { stateToHTML } from 'draft-js-export-html';
import { Editor, EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { ReactComponent as CommentsIllustartion } from "../../../assets/undraw_Public_discussion_re_w9up.svg"
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_24_regular.svg"
import * as commentsActions from "../../../actions/comments";
import Avatar from '../../UI/Avatar';
import generateId from '../../../utils/generateId';
import Illustration from '../../UI/Illustration';

const Comments = () => {

  const dispatch = useDispatch()

  const selectedProject = useSelector(state => state.app.selectedProject)
  const selectedTask = useSelector(state => state.app.selectedTask)
  const isSynced = useSelector(state => state.app.isSynced)

  const projects = useSelector(state => state.projects)

  const comments = useSelector(state => state.comments)

  const user = useSelector(state => state.user)

  const users = useSelector(state => state.users)

  const newCommentRef = useRef(null)
  const [isNewCommentOpened, setIsNewCommentOpened] = useState(false)
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const processComments = (comments) => {
    const commentsArr = Object.values(comments).sort((a, b) => {
      if (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) {
        return 1
      } else {
        return -1
      }
    })
    const results = []
    for (const comment of commentsArr) {
      const date = new Date(comment.createdAt).setHours(0, 0, 0, 0)
      const textDateOpts = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      }
      const textDate = new Date(date).toLocaleDateString("en-GB", textDateOpts)
      if (!results.includes(textDate)) results.push(textDate)
      results.push(comment)
    }
    return results.length ? results : null
  }
  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return (user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)) ||
    (user.state !== AuthState.SignedIn && projects[selectedProject]?.isTemp)
  }
  const processedComments = useMemo(() => processComments(comments), [comments])
  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])
  const openNewComment = () => {
    if (!isNewCommentOpened) {
      setIsNewCommentOpened(true);
    }
  }
  const removeComment = (comment) => {
    if (comment.owner === user.data.username) {
      dispatch(commentsActions.handleRemoveComment(comment))
    }
  }
  const submitComment = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    dispatch(commentsActions.handleCreateComment({
      id: generateId(),
      taskId: selectedTask,
      content: content
    }))
    setEditorState(EditorState.push(editorState, ContentState.createFromText('')))
    setIsNewCommentOpened(false);
  }
  useOuterClick(newCommentRef, () => {
    if (isNewCommentOpened) {
      setIsNewCommentOpened(false);
    }
  })
  return (
    <div className={styles.CommentsContainer}>
      <div className={styles.CommentUnits}>
        {processedComments && processedComments.map(x => (
          typeof x === "object" ? (
            <div
              className={[
                styles.CommentUnit,
                ...(x.owner === user.data?.username && [styles.self] || [])
              ].join(" ")}
              key={x.id}
            >
              {x.owner !== user.data?.username && (
                <Avatar
                  image={users[x.owner].avatar}
                  initials={users[x.owner].initials}
                  alt={`${users[x.owner].firstName} ${users[x.owner].lastName}`}
                  size={32}
                  circular
                />
              )}
              <div className={styles.CommentContent}>
                <div className={styles.CommentBox}>
                  <div className={styles.CommentHeader}>
                    <span className={styles.CommenterName}>
                      {x.owner === user.data?.username && "You"}
                      {x.owner !== user.data?.username && (
                        `${users[x.owner].firstName} ${users[x.owner].lastName}`
                      )}
                    </span>
                    <button
                      className={styles.RemoveBtn}
                      onClick={() => removeComment(x)}
                    >         
                      <RemoveIcon fill="currentColor" />
                    </button>
                  </div>
                  <div
                    className={styles.CommentBody}
                    dangerouslySetInnerHTML={({
                      __html: stateToHTML(convertFromRaw(JSON.parse(x.content)))
                    })}
                  />
                  <span className={styles.CommentTime}>
                    {!x.isVirtual ? (
                      new Date(x.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ) : "Sending…"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span className={styles.CommentDay} key={x}>
              {x}
            </span>
          )
        ))}
        {!processedComments && (
          <Illustration
            illustration={CommentsIllustartion}
            title="No Comments On This Task"
            secondary
          />
        )}
      </div>
      {readOnly ? (
        <span className={styles.CommentNotAllowed}>
          {user.state !== AuthState.SignedIn ?
          "Login to comment on this task" :
          !isSynced ?
          "Intenret connection is lost" :
          "You don't have permission to comment on this task"}
        </span>
      ) : (
        <div className={styles.NewComment}>
          <Avatar
            image={user.data.avatar}
            initials={user.data.initials}
            alt={`${user.data.firstName} ${user.data.lastName}`}
            size={32}
            circular
          />
          <div
            className={styles.CommentField}
            onClick={openNewComment}
            ref={newCommentRef}
          >
            <div className={styles.CommentInput}>
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Ask a question or post an update…"
                expanded={isNewCommentOpened}
              />
            </div>
            {isNewCommentOpened && (
              <div className={styles.CommentControls}>
                <div>

                </div>
                <div>
                  <button onClick={submitComment}>Comment</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Comments;