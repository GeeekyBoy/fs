import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import sortByRank from "../../../utils/sortByRank";
import Accordion from '../../UI/Accordion';
import TaskItem from "../TaskItem";
import TaskPlaceholder from '../TaskPlaceholder';

const ByStatus = () => {
  const tasks = useSelector(state => state.tasks);
  const getSortedTasks = (tasks) => {
    const defaultSorting = sortByRank(tasks)
    return {
      todo: [...defaultSorting].filter(x => x.status === "todo"),
      pending: [...defaultSorting].filter(x => x.status === "pending"),
      done: [...defaultSorting].filter(x => x.status === "done"),
    }
  }
  const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks])
  return (
    <>
      <Accordion title="Todo">
        {sortedTasks.todo.map((value, index) => (
          <TaskItem
            key={value.id}
            item={value}
            nextTask={
              sortedTasks.todo[index + 1]?.id ||
              sortedTasks.pending[0]?.id ||
              sortedTasks.done[0]?.id ||
              null
            }
            prevTask={sortedTasks.todo[index - 1]?.id || null}
          />
        ))}
        <TaskPlaceholder
          content="Tap to create new todo task"
          preset={{status: "todo"}}
        />
      </Accordion>
      <Accordion title="Pending">
        {sortedTasks.pending.map((value, index) => (
          <TaskItem
            key={value.id}
            item={value}
            nextTask={
              sortedTasks.pending[index + 1]?.id ||
              sortedTasks.done[0]?.id ||
              null
            }
            prevTask={
              sortedTasks.pending[index - 1]?.id ||
              sortedTasks.todo[sortedTasks.todo.length - 1]?.id ||
              null
            }
          />
        ))}
        <TaskPlaceholder
          content="Tap to create new pending task"
          preset={{status: "pending"}}
        />
      </Accordion>
      <Accordion title="Finished">
        {sortedTasks.done.map((value, index) => (
          <TaskItem
            key={value.id}
            item={value}
            nextTask={sortedTasks.done[index + 1]?.id || null}
            prevTask={
              sortedTasks.done[index - 1]?.id ||
              sortedTasks.pending[sortedTasks.pending.length - 1]?.id ||
              sortedTasks.todo[sortedTasks.todo.length - 1]?.id ||
              null
            }
          />
        ))}
        <TaskPlaceholder
          content="Tap to create new finsihed task"
          preset={{status: "done"}}
        />
      </Accordion>
    </>
  )
}

export default ByStatus;