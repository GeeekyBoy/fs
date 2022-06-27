import React from "react";
import { withPerformance } from "storybook-addon-performance";

import Button from "../components/UI/Button";

export default {
  title: "ForwardSlash/Button",
  component: Button,
  decorators: [withPerformance()]
};

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Button",
  fullWidth: false,
  secondary: false,
  disabled: false,
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...Default.args,
  secondary: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const SecondaryDefault = Template.bind({});
SecondaryDefault.args = {
  ...Disabled.args,
  secondary: true,
};
