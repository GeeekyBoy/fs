import React from "react";
import { withPerformance } from "storybook-addon-performance";

import Toggle from "../components/UI/fields/Toggle";

export default {
  title: "ForwardSlash/Fields/Toggle",
  component: Toggle,
  decorators: [withPerformance()]
};

const Template = (args) => <Toggle {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: false,
  label: "label",
  error: "",
  readOnly: false,
  disabled: false,
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  error: "error message",
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
