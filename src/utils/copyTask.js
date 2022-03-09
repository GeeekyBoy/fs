import generateID from "./generateID";

export default (taskState, projectID, rank) => {
  return {
    id: generateID(),
    projectID: projectID,
    rank: rank,
    task: taskState.task,
    description: taskState.description,
    due: taskState.due,
    tags: taskState.tags,
    status: taskState.status,
    priority: taskState.priority,
    assignees: [],
  };
};
