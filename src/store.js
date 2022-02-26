import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from "redux"

import thunk from "redux-thunk"
import caching from "./middleware/caching"
import reducers from "./reducers"

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    })) ||
  compose;
export default createStore(
  combineReducers(reducers),
  composeEnhancers(
    applyMiddleware(thunk, caching)
  )
)