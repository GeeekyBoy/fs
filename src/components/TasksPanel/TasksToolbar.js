import React from 'react'
import styles from "./TasksToolbar.module.scss"
import { useDispatch, useSelector } from "react-redux"
import * as appActions from "../../actions/app"
import { ReactComponent as SearchIcon } from "../../assets/search-outline.svg"
import TextField from '../UI/fields/TextField'

const TasksToolbar = (props) => {
  const {
    searchKeyword,
    setSearchKeyword,
  } = props;
  const dispatch = useDispatch()

  const selectedProject = useSelector(state => state.projects[state.app.selectedProject])

  return (
    <div className={styles.ToolbarContainer}>
      <TextField
        name="searchKeyword"
        placeholder={selectedProject ? "Search " + selectedProject.permalink : "Select a project to search"}
        value={searchKeyword}
        disabled={!selectedProject}
        autoComplete="off"
        onChange={(e) => setSearchKeyword(e.target.value)}
        onFocus={() => dispatch(appActions.handleSetTask(null))}
        prefix={() => (
          <SearchIcon
            width={18}
            height={18}
            strokeWidth={32}
            style={{
              marginRight: 5
            }}
          />
        )}
        style={{
          flex: 1
        }}
      />
    </div>     
  )
}

export default TasksToolbar;
