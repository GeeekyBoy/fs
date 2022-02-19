import React from "react";
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as projectsActions from "../../actions/projects";
import { panelPages, initProjectState, OK } from "../../constants";
import parseLinkedList from "../../utils/parseLinkedList";
import { ReactComponent as NotFoundIllustartion } from "../../assets/undraw_empty_xct9.svg";
import { ReactComponent as TasksIllustartion } from "../../assets/undraw_teamwork_hpdk.svg";
import filterObj from "../../utils/filterObj";
import Illustration from "../UI/Illustration";
import { useParamsNoUpdates } from "../RouterUtils";

const ProjectNotSelected = (props) => {
  const {
    app: { projectAddingStatus },
    projects,
    dispatch,
  } = props;
  const params = useParamsNoUpdates();
  const createNewProject = () => {
    projectAddingStatus === OK &&
      dispatch(
        projectsActions.handleCreateProject(
          initProjectState(
            parseLinkedList(
              filterObj(projects, (x) => x.isOwned),
              "prevProject",
              "nextProject"
            ).reverse()[0]?.id
          )
        )
      );
  };
  const openProjectsPanel = () => {
    dispatch(appActions.setLeftPanelPage(panelPages.PROJECTS));
    dispatch(appActions.handleSetLeftPanel(true));
  };
  return (
    <Illustration
      illustration={
        params.projectPermalink
          ? NotFoundIllustartion
          : TasksIllustartion
      }
      title={
        params.projectPermalink
          ? "Requested Project Not Found"
          : "Create A Project To Get Started"
      }
      actionLabel={
        params.projectPermalink
        ? "My Projects"
        : "+ Create New"
      }
      onAction={
        params.projectPermalink
        ? openProjectsPanel
        : createNewProject
      }
    />
  );
};

export default connect((state) => ({
  app: {
    projectAddingStatus: state.app.projectAddingStatus,
  },
  projects: state.projects,
}))(ProjectNotSelected);
