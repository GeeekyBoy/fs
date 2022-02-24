import React, { forwardRef, useImperativeHandle, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import * as projectsActions from "../../../actions/projects"
import * as appActions from "../../../actions/app"
import { initProjectState, OK, PENDING, AuthState } from "../../../constants"
import parseLinkedList from "../../../utils/parseLinkedList"
import { ReactComponent as AddIcon } from "../../../assets/add-outline.svg";
import filterObj from "../../../utils/filterObj";
import PanelTabs from "../../UI/PanelTabs";
import Assigned from "./Assigned";
import Watched from "./Watched";
import Owned from "./Owned";

const Projects = forwardRef((_, ref) => {
  const [scope, setScope] = useState("owned")
  const dispatch = useDispatch();

  const userState = useSelector(state => state.user.state);

  const projectAddingStatus = useSelector(state => state.app.projectAddingStatus);

  const projects = useSelector(state => state.projects);

  const createNewProject = async () => {
    if (projectAddingStatus === OK) {
      dispatch(appActions.handleSetLeftPanel(false))
      dispatch(
        projectsActions.handleCreateProject(
          (
            await initProjectState(
              parseLinkedList(
                filterObj(projects, (x) => x.isOwned),
                "prevProject",
                "nextProject"
              )
            )
          ).reverse()[0]?.id
        )
      );
    }
  }
  const closePanel = () => {
    dispatch(appActions.handleSetLeftPanel(false))
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Projects",
      actionIcon: AddIcon,
      header: userState === AuthState.SignedIn && (
        <center>
          <PanelTabs
            tabs={[
              ["owned", "Owned"],
              ["assigned", "Assigned"],
              ["watched", "Watched"],
            ]}
            value={scope}
            onChange={(newVal) => setScope(newVal)}
          />
        </center>
      ),
      onClose: () => {
        closePanel();
      },
      onAction: () => {
        createNewProject();
      },
    },
  }));
  return scope === "assigned" ? (
    <Assigned />
  ) : scope === "watched" ? (
    <Watched />
  ) : scope === "owned" ? (
    <Owned />
  ) : null;
    
})

Projects.displayName = "Projects"

export default Projects;