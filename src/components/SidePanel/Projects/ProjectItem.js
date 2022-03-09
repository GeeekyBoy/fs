import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../../actions/app";
import * as projectsActions from "../../../actions/projects";
import ProjectCard from "../../UI/ProjectCard";

const ProjectItem = (props) => {
  const {
    project,
    readOnly,
    listeners,
  } = props;
  const dispatch = useDispatch();
  const selectedProject = useSelector(state => state.app.selectedProject);
  const shareProject = () => {
    const linkToBeCopied = window.location.href.replace(/\/\d+/, "");
    navigator.clipboard.writeText(linkToBeCopied);
  };
  const removeProject = () => {
    if (!readOnly) {
      dispatch(projectsActions.handleRemoveProject(project));
    }
  };
  const selectProject = (id) => {
    if (selectedProject !== project.id) {
      dispatch(appActions.handleSetLeftPanel(false));
      dispatch(appActions.handleSetProject(id));
    }
  };
  return (
    <ProjectCard
      id={project.id}
      title={project.title}
      permalink={project.permalink}
      privacy={project.privacy}
      todoCount={project.todoCount}
      pendingCount={project.pendingCount}
      doneCount={project.doneCount}
      createdAt={project.createdAt}
      readOnly={readOnly}
      onShare={shareProject}
      onRemove={removeProject}
      onSelect={selectProject}
      selected={selectedProject === project.id}
      listeners={listeners}
    />
  );
};

export default ProjectItem;
