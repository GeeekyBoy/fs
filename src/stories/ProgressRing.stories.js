import React from "react";
import { withPerformance } from "storybook-addon-performance";

import ProgressRing from "../components/UI/ProgressRing";

export default {
  title: "ForwardSlash/Progress Ring",
  component: ProgressRing,
  decorators: [withPerformance()],
  argTypes: {
    progress: {
      min: 0,
      max: 100,
      step: 1,
      control: { type: "range" },
    },
  },
};

const Template = (args) => <ProgressRing {...args} />;

export const Default = Template.bind({});
Default.args = {
  radius: 58,
  stroke: 8,
  progress: 32,
};
