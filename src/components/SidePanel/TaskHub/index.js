import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../../actions/app";
import { AuthState } from "../../../constants";
import Comments from "./Comments";
import { ReactComponent as ShareIcon } from "../../../assets/share-outline.svg"
import PanelTabs from '../../UI/PanelTabs';
import Details from './Details';

const TaskHub = forwardRef((props, ref) => {
  const {
    user,
    app: {
      lockedTaskField,
      selectedProject
    },
    projects,
    dispatch
  } = props;
  
  const idleTrigger = useRef(null)
	
	const forceIdle = () => {
		if (["task", "description"].includes(lockedTaskField)) {
			dispatch(appActions.setLockedTaskField(null))
		}
		clearTimeout(idleTrigger.current)
	}

	useEffect(() => () => forceIdle(), [])

  const [tab, setTab] = useState("details")

  const closePanel = () => {
    forceIdle()
    return dispatch(appActions.handleSetRightPanel(false))
  }
	const shareTask = () => {
		const linkToBeCopied = window.location.href
		navigator.clipboard.writeText(linkToBeCopied)
	}
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Task Hub",
      actionIcon: ShareIcon,
      header: (user.state === AuthState.SignedIn ||
        (user.state !== AuthState.SignedIn &&
          projects[selectedProject]?.isTemp)) && (
        <center>
          <PanelTabs
            tabs={[
              ["details", "Details"],
              ["comments", "Comments"],
            ]}
            value={tab}
            onChange={(newVal) => setTab(newVal)}
          />
        </center>
      ),
      onClose: () => {
        closePanel()
      },
      onAction: () => {
        shareTask();
      }
    }
  }));
  return tab === "details" ? (
    <Details />
  ) : tab === "comments" ? (
    <Comments />
  ) : null;
});

TaskHub.displayName = "TaskHub";

export default connect((state) => ({
  user: {
    state: state.user.state,
  },
  app: {
    lockedTaskField: state.app.lockedTaskField,
    selectedProject: state.app.selectedProject,
  },
  projects: state.projects,
}), null, null, { forwardRef: true })(TaskHub);
