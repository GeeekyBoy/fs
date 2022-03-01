import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as projectsActions from "../../actions/projects";
import { AuthState } from "../../constants";
import styles from "./ProjectSettings.module.scss"
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import TextField from '../UI/fields/TextField';
import CardSelect from '../UI/fields/CardSelect';

const ProjectSettings = forwardRef((props, ref) => {
  const {
    app: {
      selectedProject,
      isSynced
    },
    user,
    projects,
    dispatch
  } = props;

  const {
    [selectedProject]: {
      id,
      title,
      permalink,
      privacy,
      permissions
    }
  } = projects

  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)
  }
  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])

  const [newTitle, setNewTitle] = useState(title || "")
  const [newPermalink, setNewPermalink] = useState(/\w+\/(.*)/.exec(permalink)?.[1] || permalink)
  const [newPrivacy, setNewPrivacy] = useState(privacy)
  const [newPermissions, setNewPermissions] = useState(permissions)

  const checkIsChanaged = (
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    title,
    permalink,
    privacy,
    permissions
  ) => (
    !(newTitle === (title || "") &&
    newPermalink === (/\w+\/(.*)/.exec(permalink)?.[1] || permalink) &&
    newPrivacy === privacy &&
    newPermissions === permissions)
  )

  const isChanged = useMemo(() => checkIsChanaged(
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    title,
    permalink,
    privacy,
    permissions
  ), [
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    title,
    permalink,
    privacy,
    permissions
  ])
  
  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const removeProject = () => {
    dispatch(projectsActions.handleRemoveProject(projects[selectedProject]))
  }
  const saveChanges = () => {
    dispatch(projectsActions.handleUpdateProject({
      id,
      ...(newTitle !== (title || "") && { title: newTitle }),
      ...(newPermalink !== (/\w+\/(.*)/.exec(permalink)?.[1] || permalink) && { permalink: newPermalink }),
      ...(newPrivacy !== privacy && { privacy: newPrivacy }),
      ...(newPermissions !== permissions && { permissions: newPermissions })
    }))
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Project Settings",
      actionIcon: RemoveIcon,
      submitLabel: isSynced
        ? "Save Changes"
        : "No Connection!",
      onClose: () => {
        closePanel()
      },
      onAction: () => {
        removeProject();
      },
      onSubmit: () => {
        saveChanges();
      },
    }
  }));
  return (
    <form className={styles.ProjectSettingsForm} onSubmit={(e) => e.preventDefault()}>
      <TextField
        type="text"
        name="title"
        label="Title"
        placeholder="title…"
        onChange={(e) => setNewTitle(e.target.value)}
        value={newTitle}
        readOnly={readOnly}
      />
      <TextField
        type="text"
        name="permalink"
        label="Permalink"
        placeholder="permalink…"
        onChange={(e) => setNewPermalink(e.target.value)}
        value={newPermalink}
        readOnly={readOnly}
        prefix={() => (
          <span>
            {/(\w+\/).*/.exec(permalink)?.[1]}
          </span>
        )}
      />
      {user.state === AuthState.SignedIn && (
        <>
          <CardSelect
            name="privacy"
            value={newPrivacy}
            label="Privacy"
            values={["public", "private"]}
            options={["Public", "Private"]}
            descriptions={[
              "Make this project accessible to others via its unique permalink.",
              "Make this project not visible to anyone other than you."
            ]}
            onChange={(e) => setNewPrivacy(e.target.value)}
            readOnly={readOnly}
          />
          {(privacy === "public" || newPrivacy === "public") && (
            <CardSelect
              name="permissions"
              value={newPermissions}
              label="Permissions"
              values={["rw", "r"]}
              options={["Read Write", "Read Only"]}
              descriptions={[
                "Make this project writable by other users who have the permission to access its tasks.",
                "Prevent other users who have the permission to access this project from modifying its contents."
              ]}
              onChange={(e) => setNewPermissions(e.target.value)}
              readOnly={readOnly}
            />
          )}
        </>
      )}
    </form>
  );
});

ProjectSettings.displayName = "ProjectSettings";

export default connect((state) => ({
  app: {
    selectedProject: state.app.selectedProject,
    isSynced: state.app.isSynced
  },
  projects: state.projects,
  user: {
    state: state.user.state,
    data: {
      username: state.user.data.username
    }
  }
}), null, null, { forwardRef: true })(ProjectSettings);
