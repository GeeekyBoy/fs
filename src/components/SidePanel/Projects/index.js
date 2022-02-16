import React, { forwardRef, useImperativeHandle, useState } from "react"
import { connect } from "react-redux";
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

const Projects = forwardRef((props, ref) => {
  const {
    user,
    app: {
      projectAddingStatus,
      isSynced
    },
    projects,
    dispatch
  } = props
  const [scope, setScope] = useState("owned")
  const createNewProject = () => {
    if (projectAddingStatus === OK) {
      dispatch(appActions.handleSetLeftPanel(false))
      dispatch(
        projectsActions.handleCreateProject(
          initProjectState(
            parseLinkedList(
              filterObj(projects, x => x.isOwned),
              "prevProject",
              "nextProject"
            ).reverse()[0]?.id
          )
        )
      )
    }
  }
  const closePanel = () => {
    dispatch(appActions.handleSetLeftPanel(false))
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Projects",
      actionIcon: AddIcon,
      onClose: () => {
        closePanel()
      },
      onAction: () => {
        createNewProject();
      }
    }
  }));
  return (
    <>
      {user.state === AuthState.SignedIn && (
        <PanelTabs
          tabs={[
            ["owned", "Owned"],
            ["assigned", "Assigned"],
            ["watched", "Watched"]
          ]}
          value={scope}
          onChange={(newVal) => setScope(newVal)}
        />
      )}
      {scope === "assigned" && <Assigned />}
      {scope === "watched" && <Watched />}
      {scope === "owned" && <Owned />}
    </>
  );  
})

Projects.displayName = "Projects"

export default connect((state) => ({
  user: state.user,
  app: state.app,
  projects: state.projects
}), null, null, { forwardRef: true })(Projects);