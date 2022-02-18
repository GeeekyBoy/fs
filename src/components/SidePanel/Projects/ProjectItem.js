import React from "react";
import { connect } from "react-redux";
import * as appActions from "../../../actions/app";
import * as projectsActions from "../../../actions/projects";
import ProjectCard from "../../UI/ProjectCard";

const ProjectItem = (props) => {
  const {
    app: { selectedProject },
    project,
    readOnly,
    dispatch,
    listeners,
  } = props;
  const shareProject = (e) => {
    e.stopPropagation();
    const linkToBeCopied = window.location.href.replace(/\/\d+/, "");
    navigator.clipboard.writeText(linkToBeCopied);
  };
  const removeProject = (e) => {
    e.stopPropagation();
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
      readOnly={true}
      onShare={shareProject}
      onRemove={removeProject}
      onSelect={selectProject}
      selected={selectedProject === project.id}
      {...listeners}
    />
  );
};

export default connect((state) => ({
  app: {
    selectedProject: state.app.selectedProject,
  },
}))(ProjectItem);
