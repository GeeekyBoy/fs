import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import parseLinkedList from "../../../utils/parseLinkedList";
import Accordion from '../../UI/Accordion';
import TaskItem from "../TaskItem";
import TaskPlaceholder from '../TaskPlaceholder';

const ByPriority = () => {
  const tasks = useSelector(state => state.tasks);
  const getSortedTasks = (tasks) => {
    const defaultSorting = parseLinkedList(tasks, "prevTask", "nextTask")
    return {
      high: [...defaultSorting].filter(x => x.priority === "high"),
      normal: [...defaultSorting].filter(x => x.priority === "normal"),
      low: [...defaultSorting].filter(x => x.priority === "low"),
    }
  }
  const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks])
  return (
    <>
      <Accordion title="High">
        {sortedTasks.high.map((value, index) => (
          <div key={value.id}>
            <TaskItem
              item={value}
              isSorting={false}
              isDragging={false}
              nextTask={
                sortedTasks.high[index + 1]?.id ||
                sortedTasks.normal[0]?.id ||
                sortedTasks.low[0]?.id ||
                null
              }
              prevTask={sortedTasks.high[index - 1]?.id || null}
            />
          </div>
        ))}
        <TaskPlaceholder
          content="Tap to create new task with high priority"
          preset={{priority: "high"}}
        />
      </Accordion>
      <Accordion title="Normal">
        {sortedTasks.normal.map((value, index) => (
          <div key={value.id}>
            <TaskItem
              item={value}
              isSorting={false}
              isDragging={false}
              nextTask={
                sortedTasks.normal[index + 1]?.id ||
                sortedTasks.low[0]?.id ||
                null
              }
              prevTask={
                sortedTasks.normal[index - 1]?.id ||
                sortedTasks.high[sortedTasks.high.length - 1]?.id ||
                null
              }
            />
          </div>
        ))}
        <TaskPlaceholder
          content="Tap to create new task with normal priority"
          preset={{priority: "normal"}}
        />
      </Accordion>
      <Accordion title="Low">
        {sortedTasks.low.map((value, index) => (
          <div key={value.id}>
            <TaskItem
              item={value}
              isSorting={false}
              isDragging={false}
              nextTask={sortedTasks.low[index + 1]?.id || null}
              prevTask={
                sortedTasks.low[index - 1]?.id ||
                sortedTasks.normal[sortedTasks.normal.length - 1]?.id ||
                sortedTasks.high[sortedTasks.high.length - 1]?.id ||
                null
              }
            />
          </div>
        ))}
        <TaskPlaceholder
          content="Tap to create new task with low priority"
          preset={{priority: "low"}}
        />
      </Accordion>
    </>
  )
}

export default ByPriority;