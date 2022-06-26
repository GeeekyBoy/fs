import React from "react";
import { useArgs } from "@storybook/client-api";
import { withPerformance } from "storybook-addon-performance";

import Task from "../components/UI/Task";

export default {
  title: "ForwardSlash/Task",
  component: Task,
  decorators: [withPerformance()],
  argTypes: {
    status: {
      options: ["todo", "pending", "done"],
      control: { type: "select" },
    },
  },
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ task: e.target.value });
  const handleSelect = () => updateArgs({ selected: true });
  const handleToggleStatus = (status) => updateArgs({ status: status });
  return (
    <Task
      onChange={handleChange}
      onSelect={handleSelect}
      onToggleStatus={handleToggleStatus}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  id: "User-JyPYOchUXOQv2gNiUhqc64SBJPZ8ZzpcB73J",
  task: "Let's start our new project 😁",
  status: "todo",
  due: null,
  mobile: false,
  showDueDate: true,
  showAssignees: true,
  showDoneIndicator: true,
  showCopyButton: true,
  showDuplicateButton: true,
  showShareButton: true,
  assignees: [],
  selected: false,
  command: "",
  readOnly: false,
  isSorting: false,
  isDragging: false
};
