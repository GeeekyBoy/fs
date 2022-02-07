import React, { useMemo } from 'react';
import { connect } from "react-redux";
import parseLinkedList from "../../../utils/parseLinkedList";
import Accordion from '../../UI/Accordion';
import TaskItem from "../TaskItem";
import TaskPlaceholder from '../TaskPlaceholder';

const ByStatus = (props) => {
  const { tasks } = props;
  const getSortedTasks = (tasks) => {
    const defaultSorting = parseLinkedList(tasks, "prevTask", "nextTask")
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
          <div key={value.id}>
            <TaskItem
              item={value}
              isSorting={false}
              isDragging={false}
              nextTask={
                sortedTasks.todo[index + 1]?.id ||
                sortedTasks.pending[0]?.id ||
                sortedTasks.done[0]?.id ||
                null
              }
              prevTask={sortedTasks.todo[index - 1]?.id || null}
            />
          </div>
        ))}
        <TaskPlaceholder
          content="Tap to create new todo task"
          preset={{status: "todo"}}
        />
      </Accordion>
      <Accordion title="Pending">
        {sortedTasks.pending.map((value, index) => (
          <div key={value.id}>
            <TaskItem
              item={value}
              isSorting={false}
              isDragging={false}
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
          </div>
        ))}
        <TaskPlaceholder
          content="Tap to create new pending task"
          preset={{status: "pending"}}
        />
      </Accordion>
      <Accordion title="Finished">
        {sortedTasks.done.map((value, index) => (
          <div key={value.id}>
            <TaskItem
              item={value}
              isSorting={false}
              isDragging={false}
              nextTask={sortedTasks.done[index + 1]?.id || null}
              prevTask={
                sortedTasks.done[index - 1]?.id ||
                sortedTasks.pending[sortedTasks.pending.length - 1]?.id ||
                sortedTasks.todo[sortedTasks.todo.length - 1]?.id ||
                null
              }
            />
          </div>
        ))}
        <TaskPlaceholder
          content="Tap to create new finsihed task"
          preset={{status: "done"}}
        />
      </Accordion>
    </>
  )
}

export default connect((state) => ({
  tasks: state.tasks
}))(ByStatus);