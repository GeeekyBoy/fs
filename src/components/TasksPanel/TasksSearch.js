import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import Fuse from "fuse.js"
import sortByRank from "../../utils/sortByRank";
import TaskItem from "./TaskItem";
import NoTasks from './NoTasks';

const TasksSearch = (props) => {
  const { searchKeyword } = props;

  const tasks = useSelector(state => state.tasks);

  const getSearchResults = (tasks, searchKeyword) => {
    const tasksArr = sortByRank(tasks)
    const fuse = new Fuse(tasksArr, {
        keys: ['task', 'description']
    })
    return fuse.search(searchKeyword).map(x => x.item)
  }
  const searchResults = useMemo(() => getSearchResults(tasks, searchKeyword), [tasks, searchKeyword])
  return searchResults.length
    ? (
      <div style={{ flex: 1 }}>
        {searchResults.map((value, index) => (
          <TaskItem
            key={value.id}
            item={value}
            nextTask={searchResults[index + 1]?.id || null}
            prevTask={searchResults[index - 1]?.id || null}
          />
        ))}
      </div>
    ) : (
      <NoTasks msgId="NO_RESULTS" />
    )
}

export default TasksSearch;