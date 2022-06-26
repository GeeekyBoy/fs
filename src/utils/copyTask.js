import generateId from "./generateId";

export default (taskState, projectId, rank) => {
  return {
    id: generateId(),
    projectId: projectId,
    rank: rank,
    task: taskState.task,
    description: taskState.description,
    due: taskState.due,
    tags: taskState.tags,
    status: taskState.status,
    priority: taskState.priority,
    assignees: [],
    anonymousAssignees: [],
    invitedAssignees: [],
  };
};
