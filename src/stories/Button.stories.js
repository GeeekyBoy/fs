import React from "react";
import { withPerformance } from "storybook-addon-performance";

import Button from "../components/UI/Button";

export default {
  title: "ForwardSlash/Button",
  component: Button,
  decorators: [withPerformance()]
};

const testIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    {...props}
  >
    <circle
      cx={256}
      cy={256}
      r={192}
      fill="none"
      stroke="currentColor"
      strokeWidth={32}
    />
  </svg>
);

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

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  ...Disabled.args,
  secondary: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  ...Default.args,
  icon: testIcon,
};
