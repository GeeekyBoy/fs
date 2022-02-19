import React from 'react'
import styles from "./TasksToolbar.module.scss"
import { useDispatch, useSelector } from "react-redux"
import * as appActions from "../../actions/app"
import { ReactComponent as SearchIcon } from "../../assets/search-outline.svg"
import HeadingTextField from '../UI/fields/HeadingTextField';

const TasksToolbar = (props) => {
  const {
    searchKeyword,
    setSearchKeyword,
  } = props;
  const dispatch = useDispatch()

  const selectedProject = useSelector(state => state.app.selectedProject)

  const projects = useSelector(state => state.projects)

  return (
    <div className={styles.ToolbarContainer}>
      <HeadingTextField
        name="searchKeyword"
        placeholder={"Search " + projects[selectedProject].permalink}
        value={searchKeyword}
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
