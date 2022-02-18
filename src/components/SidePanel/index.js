import React, { useCallback, useEffect, useMemo, useState, lazy } from 'react';
import { connect } from "react-redux";
import "draft-js/dist/Draft.css";
import SidPanel from "../UI/SidePanel";
const ASSIGNEE_CHOOSER = lazy(() => import("./AssigneeChooser"));
const WATCHER_CHOOSER = lazy(() => import("./WatcherChooser"));
const TASK_HUB = lazy(() => import("./TaskHub"));
const PROJECTS = lazy(() => import("./Projects"));
const ACCOUNT_SETTINGS = lazy(() => import("./AccountSettings"));
const PROJECT_SETTINGS = lazy(() => import("./ProjectSettings"));
const APP_SETTINGS = lazy(() => import("./AppSettings"));
const NOTIFICATIONS = lazy(() => import("./Notifications"));

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
  app: {
    isRightPanelOpened: state.app.isRightPanelOpened,
    isLeftPanelOpened: state.app.isLeftPanelOpened,
    rightPanelPage: state.app.rightPanelPage,
    leftPanelPage: state.app.leftPanelPage
  }
}))(SidePanel);