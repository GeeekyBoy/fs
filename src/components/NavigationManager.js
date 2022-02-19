import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { graphqlOperation } from "@aws-amplify/api";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as queries from "../graphql/queries"
import { useLocation } from "wouter"
import { AuthState } from '../constants';
import execGraphQL from "../utils/execGraphQL";
import { useParamsNoUpdates } from "./RouterUtils";

const NavigationManager = () => {
  const [routeLocation, navigate] = useLocation()
  const routeParams = useParamsNoUpdates();
  const dispatch = useDispatch()

  const selectedProject = useSelector(state => state.app.selectedProject)

  const projects = useSelector(state => state.projects)

  const loadedTasks = useSelector(state => state.tasks)

  const userState = useSelector(state => state.user.state)

  useEffect(() => {
    console.log("Hello");
    (async () => {
    if (routeParams) {
      const {
        username, projectPermalink, taskPermalink
      } = routeParams;
      if (username && projectPermalink) {
        let reqProject = Object.values(projects).filter(x => x.permalink === `${username}/${projectPermalink}`)[0]
        if (!reqProject) {
          try {
            reqProject = (await execGraphQL(graphqlOperation(queries.getProjectByPermalink, {
              permalink: `${username}/${projectPermalink}`
            }))).data.getProjectByPermalink
            dispatch(projectsActions.createProject(reqProject, "temp"))
          } catch {
            reqProject = null
            if (taskPermalink) {
              navigate(`/${username}/${projectPermalink}`, { replace: true })
            }
          }
        }
        if (reqProject) {
          const prevSelectedProject = selectedProject
          dispatch(appActions.handleSetProject(reqProject.id, false));
          if (taskPermalink) {
            const tasks = prevSelectedProject === selectedProject ?
              loadedTasks : await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
            const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(taskPermalink, 10))[0]
            if (reqTask) {
              dispatch(appActions.handleSetTask(reqTask.id, false));
            }
          } else {
            navigate(`/${username}/${projectPermalink}`, { replace: true });
          }
        }
      } else if (userState !== AuthState.SignedIn && projectPermalink) {
        const reqProject = Object.values(projects).filter((x) => x.permalink === projectPermalink)[0];
        if (reqProject) {
          dispatch(appActions.handleSetProject(reqProject.id, false));
        }
      }
    }
    })()
  }, [routeLocation, userState]);
  return null
}

export default NavigationManager;