import API from "../amplify/API";
import * as cacheController from "../controllers/cache"
import * as mutations from "../graphql/mutations"
import prepareProjectToBeSent from "./prepareProjectToBeSent";
import prepareTaskToBeSent from "./prepareTaskToBeSent";

const uploadLocal = async () => {
  const { localCache } = cacheController.getCache()
  try {
  if (localCache) {
    for (const projectId of Object.keys(localCache.projects)) {
      const project = localCache.projects[projectId];
      await API.execute(mutations.createProject, {
        input: prepareProjectToBeSent(project)
      });
      delete localCache.projects[projectId];
      const projectTasks = localCache.tasks[projectId];
      for (const taskId of Object.keys(projectTasks)) {
        const task = projectTasks[taskId];
        await API.execute(mutations.createTask, {
          input: prepareTaskToBeSent(task)
        });
        for (const anonymousAssignee of task.anonymousAssignees) {
          await API.execute(mutations.addAnonymousAssignee, {
            input: {
              id: task.id,
              assingee: anonymousAssignee
            }
          });
        }
        delete projectTasks[taskId];
      }
      if (!Object.keys(projectTasks).length) {
        delete localCache.tasks[projectId];
      }
    }
    // cacheController.deleteLocalCache()
  }
} catch(err) {
  console.error(err)
}
}

export default uploadLocal;
