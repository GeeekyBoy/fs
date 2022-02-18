import { lazy } from "react";
const BY_DEFAULT = lazy(() => import("./ByDefault"));
const BY_DUE = lazy(() => import("./ByDue"));
const BY_STATUS = lazy(() => import("./ByStatus"));
const BY_PRIORITY = lazy(() => import("./ByPriority"));
const BY_TAG = lazy(() => import("./ByTag"));

export default {
  BY_DEFAULT,
  BY_DUE,
  BY_STATUS,
  BY_PRIORITY,
  BY_TAG,
};
