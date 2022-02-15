import React from "react";
import { useArgs } from "@storybook/client-api";
import { withPerformance } from "storybook-addon-performance";

import PanelTabs from "../components/PanelTabs";

export default {
  title: "ForwardSlash/Panel Tabs",
  component: PanelTabs,
  decorators: [withPerformance()]
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (nextVal) => updateArgs({ value: nextVal });
  return <PanelTabs onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  value: "owned",
  tabs: [
    ["owned", "Owned"],
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
