import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthState } from "../constants";
import * as projectsActions from "../actions/projects";
import styles from "./Home.module.scss"
import TasksPanel from "./TasksPanel";
import Loading from "./Loading";
import Toolbar from "./Toolbar";
import SidePanel from "./SidePanel";
import Notifications from "./Notifications";
import SyncManager from "./SyncManager";
import NavigationManager from "./NavigationManager";
import TabView from "./UI/TabView";
import YoutubeViewer from "./viewers/YoutubeViewer";
import LoomViewer from "./viewers/LoomViewer";
import FigmaViewer from "./viewers/FigmaViewer";
import CodeViewer from "./viewers/CodeViewer";
import { useTabView } from "./TabViewManager";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { tabs, currentTab, setCurrentTab, closeTab } = useTabView();

  const userState = useSelector(state => state.user.state);

  const fetchLocalProjects = () => {
    if (userState !== AuthState.SignedIn) {
      dispatch(projectsActions.handleFetchOwnedProjects());
    }
  };

  useEffect(() => {
    if (userState === AuthState.SignedIn) {
      window.removeEventListener("storage", fetchLocalProjects)
    } else {
      window.addEventListener("storage", fetchLocalProjects);
    }
    return () => {
      window.removeEventListener("storage", fetchLocalProjects)
    }
  }, [userState]);


  return (
    <div>
      <Notifications />
      {isLoading ? (
        <Loading onFinish={() => setIsLoading(false)} />
      ) : (
				<>
          <NavigationManager />
          <SyncManager />
					<Toolbar />
					<div className={`${styles.MainPage} no-keyboard-portrait-padding-bottom-68`}>
						<SidePanel />
            <TabView
              tabs={tabs}
              value={currentTab}
              onChange={setCurrentTab}
              onCloseTab={closeTab}
            />
						<SidePanel right />
					</div>
				</>
      )}
    </div>
  );
};

export default Home;