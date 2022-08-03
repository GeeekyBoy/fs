import React from "react";
import { useArgs } from "@storybook/client-api";
import { withPerformance } from "storybook-addon-performance";

import AttachmentsField from "../components/UI/fields/AttachmentField";

export default {
  title: "ForwardSlash/Fields/AttachmentsField",
  component: AttachmentsField,
  decorators: [withPerformance()],
};

const Template = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e) => console.log(e.target.files);
  return <AttachmentsField onChange={handleChange} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  name: "attachments",
  label: "Attachments",
  value: [{
    id: "1",
    filename: "[WhWc3b3KhnY](Spring - Blender Open Movie)",
    contentType: "embed/youtube",
    size: 0,
    url: "https://www.youtube.com/watch?v=WhWc3b3KhnY",
  }]
};
