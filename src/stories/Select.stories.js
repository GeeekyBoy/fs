import React from "react";
import { useArgs } from "@storybook/client-api";
import { withPerformance } from "storybook-addon-performance";

import Select from "../components/UI/fields/Select";

export default {
  title: "ForwardSlash/Fields/Select",
  component: Select,
  decorators: [withPerformance()],
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => updateArgs({ value: e.target.value });
  return <Select onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: "todo",
  label: "Status",
  values: ["todo", "pending", "done"],
  options: ["Todo", "Pending", "Done"],
  readOnly: false,
  disabled: false
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  ...Default.args,
  readOnly: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
