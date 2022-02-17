import loadable from "@loadable/component";
const BY_DEFAULT = loadable(() => import("./ByDefault"));
const BY_DUE = loadable(() => import("./ByDue"));
const BY_STATUS = loadable(() => import("./ByStatus"));
const BY_PRIORITY = loadable(() => import("./ByPriority"));
const BY_TAG = loadable(() => import("./ByTag"));

export default {
  BY_DEFAULT,
  BY_DUE,
  BY_STATUS,
  BY_PRIORITY,
  BY_TAG,
};
