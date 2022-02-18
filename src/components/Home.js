import React, { useState, useEffect, Suspense, lazy } from "react";
import { connect } from "react-redux";
import { AuthState } from "../constants";
import * as projectsActions from "../actions/projects";
import styles from "./Home.module.scss"
const TasksPanel = lazy(() => import("./TasksPanel"));
const Loading = lazy(() => import("./Loading"));
const Toolbar = lazy(() => import("./Toolbar"));
const SidePanel = lazy(() => import("./SidePanel"));
const Notifications = lazy(() => import("./Notifications"));
const SyncManager = lazy(() => import("./SyncManager"));
import NavigationManager from "./NavigationManager";

const Home = (props) => {
  const {
    user,
    dispatch
  } = props;
  const [isLoading, setIsLoading] = useState(true);

  const fetchLocalProjects = () => {
    if (user.state !== AuthState.SignedIn) {
      dispatch(projectsActions.handleFetchOwnedProjects());
    }
  };

  useEffect(() => {
    if (user.state === AuthState.SignedIn) {
      window.removeEventListener("storage", fetchLocalProjects)
    } else {
      window.addEventListener("storage", fetchLocalProjects);
    }
    return () => {
      window.removeEventListener("storage", fetchLocalProjects)
    }
  }, [user.state]);


  return (
    <div><Suspense fallback={<span>Loading</span>}>
      <Notifications />
      {isLoading ? (
        <Loading onFinish={() => setIsLoading(false)} />
      ) : (
				<>
          <NavigationManager />
          <SyncManager />
					<Toolbar />
					<div className={`${styles.MainPage} no-keyboard-portrait-padding-bottom-90`}>
						<SidePanel right={false} />
						<TasksPanel />
						<SidePanel right={true} />
					</div>
				</>
      )}
    </Suspense></div>
  );
};

export default connect((state) => ({
  app: {
    selectedProject: state.app.selectedProject,
    isLoading: state.app.isLoading,
  },
  user: {
    state: state.user.state,
  },
  projects: state.projects
}))(Home);
