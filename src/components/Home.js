import React, { useState, useEffect, Suspense, lazy } from "react";
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

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

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
    <div>
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
    </div>
  );
};

export default Home;
