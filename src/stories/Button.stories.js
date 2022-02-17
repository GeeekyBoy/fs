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
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
