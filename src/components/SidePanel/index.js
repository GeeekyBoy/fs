import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from "react-redux";
import "draft-js/dist/Draft.css";
import SidPanel from "../UI/SidePanel";
import ASSIGNEE_CHOOSER from "./AssigneeChooser"
import WATCHER_CHOOSER from "./WatcherChooser"
import TASK_HUB from "./TaskHub"
import PROJECTS from "./Projects"
import ACCOUNT_SETTINGS from "./AccountSettings"
import PROJECT_SETTINGS from "./ProjectSettings"
import APP_SETTINGS from "./AppSettings"
import NOTIFICATIONS from "./Notifications"

const sidePanelPages = {
    ASSIGNEE_CHOOSER,
    WATCHER_CHOOSER,
    TASK_HUB,
    PROJECTS,
    ACCOUNT_SETTINGS,
    PROJECT_SETTINGS,
    APP_SETTINGS,
    NOTIFICATIONS
}

const SidePanel = (props) => {
  const {
    app: {
      isRightPanelOpened,
      isLeftPanelOpened,
      rightPanelPage,
      leftPanelPage
    },
    right
  } = props;
  const [panelProps, setPanelProps] = useState({})
  const [shouldRender, setShouldRender] = useState(false)
  const pageRef = useCallback(node => {
    if (node !== null) {
      setPanelProps(node.panelProps);
    }
  }, []);
  const getPanelPageInstance = (panelPage) => {
    if (sidePanelPages[panelPage]) {
      const Page = sidePanelPages[panelPage];
      return <Page ref={pageRef} />;
    } else {
      pageRef.current = null;
      return null;
    }
  }
  const handleAnimationEnd = () => {
    if ((right && !isRightPanelOpened) || (!right && !isLeftPanelOpened)) {
      setShouldRender(false);
    }
  }
  useEffect(() => {
    if ((right && isRightPanelOpened) || (!right && isLeftPanelOpened)) {
      setShouldRender(true);
    }
  }, [isRightPanelOpened, isLeftPanelOpened]);
  const pageInstance = right
    ? useMemo(() => getPanelPageInstance(rightPanelPage), [rightPanelPage])
    : useMemo(() => getPanelPageInstance(leftPanelPage), [leftPanelPage]);
  return pageInstance && shouldRender ? (
    <SidPanel
      right={right}
      open={right ? isRightPanelOpened : isLeftPanelOpened}
      onAnimationEnd={handleAnimationEnd}
      {...panelProps}
    >
      {pageInstance}
    </SidPanel>
  ) : null;
};

export default connect((state) => ({
  app: state.app
}))(SidePanel);