import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../actions/app";
import * as projectsActions from "../../actions/projects";
import { panelPages, initProjectState, OK } from "../../constants";
import parseLinkedList from "../../utils/parseLinkedList";
import { ReactComponent as NotFoundIllustartion } from "../../assets/undraw_empty_xct9.svg";
import { ReactComponent as TasksIllustartion } from "../../assets/undraw_teamwork_hpdk.svg";
import filterObj from "../../utils/filterObj";
import Illustration from "../UI/Illustration";
import { useRouterNoUpdates } from "../Router";

const ProjectNotSelected = () => {
  const { routeParams } = useRouterNoUpdates();
  const dispatch = useDispatch();

  const projectAddingStatus = useSelector(state => state.app.projectAddingStatus);

  const projects = useSelector(state => state.projects);

  const createNewProject = async () => {
    projectAddingStatus === OK &&
      dispatch(
        projectsActions.handleCreateProject(
          await initProjectState(
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
        routeParams.projectPermalink
          ? NotFoundIllustartion
          : TasksIllustartion
      }
      title={
        routeParams.projectPermalink
          ? "Requested Project Not Found"
          : "Create A Project To Get Started"
      }
      actionLabel={
        routeParams.projectPermalink
        ? "My Projects"
        : "+ Create New"
      }
      onAction={
        routeParams.projectPermalink
        ? openProjectsPanel
        : createNewProject
      }
    />
  );
};

export default ProjectNotSelected;
