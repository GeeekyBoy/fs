import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import formatDate from '../../../utils/formatDate';
import parseLinkedList from "../../../utils/parseLinkedList";
import sortObj from '../../../utils/sortObj';
import Accordion from '../../UI/Accordion';
import TaskItem from "../TaskItem";
import TaskPlaceholder from '../TaskPlaceholder';

const ByDue = () => {
  const tasks = useSelector(state => state.tasks);
  // const getSortedTasks = (tasks) => {
  //   return parseLinkedList(tasks, "prevTask", "nextTask").sort(
  //     (a, b) => (b.due || 0) - (a.due || 0)
  //   )
  // }
  const getSortedTasks = (tasks) => {
    let result = {}
    const noDue = [];
    const defaultSorting = parseLinkedList(tasks, "prevTask", "nextTask")
    for (const task of defaultSorting) {
      if (task.due) {
        if (!result[task.due]) {
          result[task.due] = []
        }
        result[task.due].push(task)
      } else {
        noDue.push(task)
      }
    }
    result = sortObj(result, true)
    result = Object.entries(result).map(x => [parseInt(x[0], 10), x[1]]);
    if (noDue.length) {
      result.push([0, noDue])
    }
    return result;
  }
  const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks])
  return (
    <>
      {sortedTasks.map((x, tagIndex) => (
        <Accordion title={x[0] ? formatDate(x[0]) : "No Due Date"} key={x[0]}>
          {x[1].map((value, taskIndex) => (
            <div key={value.id}>
              <TaskItem
                item={value}
                isSorting={false}
                isDragging={false}
                nextTask={
                  (x[1][taskIndex + 1]?.id !== value.id && x[1][taskIndex + 1]?.id) ||
                  (sortedTasks[tagIndex + 1]?.[1][0].id !== value.id && sortedTasks[tagIndex + 1]?.[1][0].id) ||
                  null
                }
                prevTask={
                  (x[1][taskIndex - 1]?.id !== value.id && x[1][taskIndex - 1]?.id) ||
                  (sortedTasks[tagIndex - 1]?.[1][0].id !== value.id && sortedTasks[tagIndex - 1]?.[1][0].id) ||
                  null
                }
              />
            </div>
          ))}
          <TaskPlaceholder
            content={
              x[0] ?
              "Tap to create new task due '" + formatDate(x[0]) + "'" :
              "Tap to create new task with no due date"
            }
            preset={{due: x[0] ? x[0] : null}}
          />
        </Accordion>
      ))}
    </>
  )
}

export default ByDue;