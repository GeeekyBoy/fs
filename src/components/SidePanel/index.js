import React, { useCallback, useEffect, useMemo, useState } from 'react';
import loadable from '@loadable/component'
import { connect } from "react-redux";
import "draft-js/dist/Draft.css";
const SidPanel = loadable(() => import("../UI/SidePanel"));
const ASSIGNEE_CHOOSER = loadable(() => import("./AssigneeChooser"));
const WATCHER_CHOOSER = loadable(() => import("./WatcherChooser"));
const TASK_HUB = loadable(() => import("./TaskHub"));
const PROJECTS = loadable(() => import("./Projects"));
const ACCOUNT_SETTINGS = loadable(() => import("./AccountSettings"));
const PROJECT_SETTINGS = loadable(() => import("./ProjectSettings"));
const APP_SETTINGS = loadable(() => import("./AppSettings"));
const NOTIFICATIONS = loadable(() => import("./Notifications"));

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