import React from "react";
import { withPerformance } from "storybook-addon-performance";

import Avatar from "../components/UI/Avatar";

export default {
  title: "ForwardSlash/Avatar",
  component: Avatar,
  decorators: [withPerformance()],
};

const Template = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 128,
  user: {
    avatar: "https://i.pravatar.cc/150?img=68",
    abbr: "JD",
    name: "John Doe",
  },
  circular: false,
};

export const Circular = Template.bind({});
Circular.args = {
  ...Default.args,
  circular: true,
};

export const Initials = Template.bind({});
Initials.args = {
  ...Default.args,
  user: {
    avatar: null,
    abbr: "JD",
    name: "John Doe",
  },
};

export const Initial = Template.bind({});
Initial.args = {
  ...Default.args,
  user: {
    avatar: null,
    abbr: null,
    name: "John Doe",
  },
};
