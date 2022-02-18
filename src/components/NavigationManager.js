import { useEffect } from "react"
import { connect } from "react-redux"
import { graphqlOperation } from "@aws-amplify/api";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as queries from "../graphql/queries"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { AuthState } from '../constants';
import execGraphQL from "../utils/execGraphQL";

const NavigationManager = (props) => {
  const { app, projects, user, dispatch } = props
  const navigate = useNavigate();
  const routeParams = useParams();
  const routeLocation = useLocation();
  useEffect(() => {
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
          const prevSelectedProject = app.selectedProject
          dispatch(appActions.handleSetProject(reqProject.id, false));
          if (taskPermalink) {
            const tasks = prevSelectedProject === app.selectedProject ?
              props.tasks : await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
            const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(taskPermalink, 10))[0]
            if (reqTask) {
              dispatch(appActions.handleSetTask(reqTask.id, false));
            }
          } else {
            navigate(`/${username}/${projectPermalink}`, { replace: true });
          }
        }
      } else if (user.state !== AuthState.SignedIn && projectPermalink) {
        const reqProject = Object.values(projects).filter((x) => x.permalink === projectPermalink)[0];
        if (reqProject) {
          dispatch(appActions.handleSetProject(reqProject.id, false));
        }
      }
    }
    })()
  }, [routeLocation, user]);
  return null
}

export default connect((state) => ({
  app: {
    selectedProject: state.app.selectedProject,
  },
  user: {
    state: state.user.state,
  },
  projects: state.projects
}))(NavigationManager);