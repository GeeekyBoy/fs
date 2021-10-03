import { API, graphqlOperation } from "aws-amplify";
import * as projectsActions from "../actions/projects"
import * as queries from "../graphql/queries"

const updateAssignedTasks = async (dispatch, getState, pushedUpdate) => {
  const { watchedTasks } = pushedUpdate
  const { projects } = getState()
  const currAssignedProjects = Object.values(projects).filter(x => x.isAssigned).map(x => x.id)
  const assignedProjects = [...new Set(watchedTasks.map(taskPath => taskPath.match(/(.*)\/.*/)[1]))]
  const newAssignedProjects = assignedProjects.filter(x => !currAssignedProjects.includes(x))
  const unassignedProjects = currAssignedProjects.filter(x => !assignedProjects.includes(currAssignedProjects));
  for (const unassignedProject of unassignedProjects) {
    dispatch(projectsActions.removeProject(unassignedProject, "assigned"))
  }
  for (const newAssignedProject of newAssignedProjects) {
    const { projects } = getState()
    if (Object.keys(projects).includes(newAssignedProject)) {
      dispatch(projectsActions.createProject(projects[newAssignedProject], "assigned"))
    } else {
      try {
        const newAssignedProjectData = (await API.graphql(graphqlOperation(queries.getProjectById, {
          projectID: newAssignedProject
        }))).data.getProjectByID
        if (newAssignedProjectData) {
          dispatch(projectsActions.createProject(newAssignedProjectData, "assigned"))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default updateAssignedTasks