import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import Fuse from "fuse.js"
import parseLinkedList from "../../utils/parseLinkedList";
import TaskItem from "./TaskItem";

const TasksSearch = (props) => {
  const { searchKeyword } = props;

  const tasks = useSelector(state => state.tasks);

  const getSearchResults = (tasks, searchKeyword) => {
    const tasksArr = parseLinkedList(tasks, "prevTask", "nextTask")
    const fuse = new Fuse(tasksArr, {
        keys: ['task', 'description']
    })
    return fuse.search(searchKeyword).map(x => x.item)
  }
  const searchResults = useMemo(() => getSearchResults(tasks, searchKeyword), [tasks, searchKeyword])
  return (
    <div>
      {searchResults.map((value, index) => (
        <TaskItem
          key={value.id}
          item={value}
          isSorting={false}
          isDragging={false}
          nextTask={searchResults[index + 1]?.id || null}
          prevTask={searchResults[index - 1]?.id || null}
        />
      ))}
    </div>
  )
}

export default TasksSearch;