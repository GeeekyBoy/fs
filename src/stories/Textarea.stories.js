import React from "react";
import { withPerformance } from "storybook-addon-performance";

import Textarea from "../components/UI/fields/Textarea";

export default {
  title: "ForwardSlash/Fields/Textarea",
  component: Textarea,
  decorators: [withPerformance()]
};

const Template = (args) => <Textarea {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: "demo text\nYou can write multiple lines of text here.",
  placeholder: "",
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
