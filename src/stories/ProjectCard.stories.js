import React from "react";
import { useArgs } from "@storybook/client-api";
import { withPerformance } from "storybook-addon-performance";

import ProjectCard from "../components/UI/ProjectCard";

export default {
  title: "ForwardSlash/Project Card",
  component: ProjectCard,
  decorators: [withPerformance()],
  argTypes: {
    privacy: {
      options: ["public", "private"],
      control: { type: "select" },
    },
  },
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleSelect = () => updateArgs({ selected: true });
  return <ProjectCard onSelect={handleSelect} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  id: "User-cSEsCZnThLZdgtFeqyLhQo2NpAyoEjGYwa77",
  title: "Awesome Project",
  privacy: "public",
  permalink: "User/blank-scale",
  todoCount: 20,
  pendingCount: 10,
  doneCount: 15,
  createdAt: "2022-01-14T19:21:49.809Z",
  readOnly: false,
};

export const Untitled = Template.bind({});
Untitled.args = {
  ...Default.args,
  title: "",
};

export const Private = Template.bind({});
Private.args = {
  ...Default.args,
  privacy: "private",
};

export const Selected = Template.bind({});
Selected.args = {
  ...Default.args,
  selected: true,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  ...Default.args,
  readOnly: true,
};
