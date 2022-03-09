export default (projectState) => {
  return {
    id: projectState.id,
    rank: projectState.rank,
    permalink: projectState.permalink,
    privacy: projectState.privacy,
    permissions: projectState.permissions,
    members: projectState.members,
    title: projectState.title,
  };
};
