import React from "react";
import { useArgs } from "@storybook/client-api";
import { withPerformance } from "storybook-addon-performance";

import TabView from "../components/UI/TabView";

export default {
  title: "ForwardSlash/TabView",
  component: TabView,
  decorators: [withPerformance()]
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (nextVal) => updateArgs({ value: nextVal });
  return <TabView onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: "owned",
  tabs: [
    ["owned", "Live Makkah"],
    ["assigned", "Assigned"],
    ["watched", "Watched"]
  ],
  disabled: false
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
