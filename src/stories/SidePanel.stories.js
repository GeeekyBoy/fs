import React from "react";
import { useArgs } from "@storybook/client-api";
import { withPerformance } from "storybook-addon-performance";

import SidePanel from "../components/UI/SidePanel";

export default {
  title: "ForwardSlash/Side Panel",
  component: SidePanel,
  decorators: [withPerformance()]
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleClose = () => updateArgs({ open: false });
  return <SidePanel onClose={handleClose} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: "Task Hub",
  open: false,
  right: false,
  disabled: false,
};

export const Open = Template.bind({});
Open.args = {
  ...Default.args,
  open: true,
};

export const Right = Template.bind({});
Right.args = {
  ...Default.args,
  right: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
