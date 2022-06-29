import React from "react";
import { withPerformance } from "storybook-addon-performance";

import Chip from "../components/UI/Chip";

export default {
  title: "ForwardSlash/Chip",
  component: Chip,
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

const Template = (args) => <Chip {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: {
    avatar: "https://i.pravatar.cc/150?img=68",
    initials: "JD",
    name: "John Doe",
  },
  primaryLabel: "John D.",
  secondary: "@Johny",
  actionIcon: testIcon,
  actionAllowed: true,
};

export const ActionNotAllowed = Template.bind({});
ActionNotAllowed.args = {
  ...Default.args,
  actionAllowed: false,
};