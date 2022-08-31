import API from "../amplify/API";
import * as cacheController from "../controllers/cache"
import * as mutations from "../graphql/mutations"

const uploadLocal = async () => {
  const { localCache } = cacheController.getCache()
  if (localCache) {
    const dataToBeSent = Object.values(localCache.projects);
    if (dataToBeSent.length) {
      for (const [index, project] of [...dataToBeSent].entries()) {
        dataToBeSent[index].tasks = Object.values(localCache.tasks[project.id] || {});
      }
      try {
        await API.execute(mutations.importData, {
          data: JSON.stringify(dataToBeSent)
        })
        cacheController.deleteLocalCache()
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default uploadLocal;
