import * as projectsActions from "../actions/projects"
import API from "../amplify/API";
import * as queries from "../graphql/queries"
import PubSub from "../amplify/PubSub";

const updateAssignedTasks = async (dispatch, getState, pushedUpdate) => {
  const { watchedTasks } = pushedUpdate
  const { projects } = getState()
  const currAssignedProjects = Object.values(projects).filter(x => x.isAssigned).map(x => x.id)
  const assignedProjects = [...new Set(watchedTasks.map(taskPath => taskPath.match(/(.*)\/.*/)[1]))]
  const newAssignedProjects = assignedProjects.filter(x => !currAssignedProjects.includes(x))
  const unassignedProjects = currAssignedProjects.filter(x => !assignedProjects.includes(x));
  for (const unassignedProject of unassignedProjects) {
    if (!(projects[unassignedProject].isWatched || projects[unassignedProject].isTemp)) {
      PubSub.unsubscribeTopic("project", unassignedProject)
    }
    dispatch(projectsActions.removeProject(unassignedProject, "assigned"))
  }
  for (const newAssignedProject of newAssignedProjects) {
    const { projects } = getState()
    if (projects[newAssignedProject]) {
      dispatch(projectsActions.createProject(projects[newAssignedProject], "assigned"))
    } else {
      try {
        const newAssignedProjectData = (await API.execute(queries.getProjectById, {
          projectID: newAssignedProject
        })).data.getProjectByID
        if (newAssignedProjectData) {
          dispatch(projectsActions.createProject(newAssignedProjectData, "assigned"))
          PubSub.subscribeTopic("project", newAssignedProject)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default updateAssignedTasks