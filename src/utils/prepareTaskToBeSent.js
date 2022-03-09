export default (taskState) => {
  return {
    id: taskState.id,
    projectID: taskState.projectID,
    rank: taskState.rank,
    task: taskState.task,
    description: taskState.description,
    due: taskState.due,
    tags: taskState.tags,
    status: taskState.status,
    priority: taskState.priority,
  };
};
