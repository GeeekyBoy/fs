import React from 'react'
import styles from "./TasksToolbar.module.scss"
import { connect } from "react-redux"
import * as appActions from "../../actions/app"
import { ReactComponent as SearchIcon } from "../../assets/search-outline.svg"
import HeadingTextField from '../UI/fields/HeadingTextField';

const TasksToolbar = (props) => {
  const {
    app: {
      selectedProject
    },
    projects,
    searchKeyword,
    setSearchKeyword,
    dispatch,
  } = props;
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

export default connect((state) => ({
  app: {
    selectedProject: state.app.selectedProject,
  },
  projects: state.projects
}))(TasksToolbar);
