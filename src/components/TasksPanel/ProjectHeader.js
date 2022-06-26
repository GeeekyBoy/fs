import React from "react"
import { AuthState } from '../../constants';
import { useSelector } from "react-redux";
import { useWindowSize } from "../../components/WindowSizeListener";
import AvatarGroup from "../UI/AvatarGroup";
import styles from "./ProjectHeader.module.scss"
import ProjectTitle from "./ProjectTitle"

const ProjectHeader = () => {
  const { width } = useWindowSize();

  const isSynced = useSelector(state => state.app.isSynced);

  const userState = useSelector(state => state.user.state);

  const users = useSelector(state => state.users);

  return (
    <div className={styles.ProjectHeader}>
      <ProjectTitle />
    </div>
  )
}

export default ProjectHeader;