import React from "react";
import { withPerformance } from "storybook-addon-performance";

import Checkbox from "../components/UI/fields/Checkbox";

export default {
  title: "ForwardSlash/Fields/Checkbox",
  component: Checkbox,
  decorators: [withPerformance()]
};

const Template = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: false,
  label: "label",
  readOnly: false,
  disabled: false,
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
