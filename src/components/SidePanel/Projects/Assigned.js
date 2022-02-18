import React, { Fragment, useMemo } from "react";
import { connect } from "react-redux";
import styles from "./Assigned.module.scss";
import ProjectItem from "./ProjectItem";
import { ReactComponent as NoAssignedIllustartion } from "../../../assets/undraw_Surveillance_re_8tkl.svg";

const Projects = (props) => {
  const { projects } = props;
  const getAssignedProjects = (projects) => {
    return Object.values(projects).filter((x) => x.isAssigned);
  };
  const assignedProjects = useMemo(
    () => getAssignedProjects(projects),
    [projects]
  );
  return assignedProjects.length ? (
    assignedProjects.map((project) => (
      <Fragment key={project.id}>
        <ProjectItem project={project} readOnly={true} />
      </Fragment>
    ))
  ) : (
    <div className={styles.NoAssignedProjects}>
      <NoAssignedIllustartion />
      <span>No Projects Assigned To You</span>
    </div>
  );
};

export default connect((state) => ({
  projects: state.projects,
}))(Projects);
