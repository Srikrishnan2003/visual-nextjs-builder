export type PropField = {
  key: string;
  label: string;
  type: "string" | "boolean" | "className" | "select";
  options?: string[]; // only for "select"
};

export const propSchemas: Record<string, PropField[]> = {
  Button: [
    { key: "children", label: "Text", type: "string" },
    { key: "disabled", label: "Disabled", type: "boolean" },
    { key: "isLoading", label: "Is Loading", type: "boolean" },
    { key: "loadingText", label: "Loading Text", type: "string" },
    { key: "iconLeft", label: "Left Icon", type: "select", options: ["none", "ArrowRight", "ArrowLeft", "Download", "Upload", "Plus", "Minus", "Check", "X", "Info", "Warning", "Settings", "User"] },
    { key: "iconRight", label: "Right Icon", type: "select", options: ["none", "ArrowRight", "ArrowLeft", "Download", "Upload", "Plus", "Minus", "Check", "X", "Info", "Warning", "Settings", "User"] },
    { key: "href", label: "Link URL", type: "string" },
    { key: "target", label: "Link Target", type: "select", options: ["_self", "_blank"] },
    { key: "variant", label: "Variant", type: "select", options: ["default", "destructive", "outline", "secondary", "ghost", "link"] },
    { key: "size", label: "Size", type: "select", options: ["default", "sm", "lg", "icon"] },
    { key: "type", label: "Button Type", type: "select", options: ["button", "submit", "reset"] },
    { key: "className", label: "CSS Class", type: "className" },
  ],
  Div: [
    { key: "children", label: "Content", type: "string" },
    { key: "display", label: "Display", type: "select", options: ["block", "flex"] },
    { key: "flexDirection", label: "Flex Direction", type: "select", options: ["row", "col"] },
    { key: "justifyContent", label: "Justify Content", type: "select", options: ["justify-start", "justify-center", "justify-end", "justify-between", "justify-around"] },
    { key: "alignItems", label: "Align Items", type: "select", options: ["items-start", "items-center", "items-end", "items-stretch"] },
    { key: "gap", label: "Gap", type: "select", options: ["gap-0", "gap-1", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6", "gap-8"] },
    { key: "padding", label: "Padding", type: "select", options: ["p-0", "p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-8"] },
    { key: "bgColor", label: "Background Color", type: "select", options: ["bg-white", "bg-gray-100", "bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-500"] },
    { key: "className", label: "CSS Class", type: "className" },
  ],
  FlexBox: [
    { key: "direction", label: "Direction", type: "select", options: ["row", "col"] },
    { key: "gap", label: "Gap", type: "select", options: ["0", "2", "4", "6", "8"] },
    { key: "className", label: "CSS Class", type: "className" },
  ],
  P: [
    { key: "children", label: "Text", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    { key: "fontSize", label: "Font Size", type: "select", options: ["12px", "14px", "16px", "20px", "24px"] },
  ],
  Card: [
    { key: "children", label: "Content", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
  ],
  Accordion: [
    { key: "type", label: "Type", type: "select", options: ["single", "multiple"] },
    { key: "collapsible", label: "Collapsible", type: "boolean" },
    { key: "className", label: "CSS Class", type: "className" },
  ],
  Tabs: [
    { key: "defaultValue", label: "Default Value", type: "string" }, // This would correspond to a tab's value
    { key: "className", label: "CSS Class", type: "className" },
  ],
  Alert: [
    { key: "title", label: "Title", type: "string" },
    { key: "description", label: "Description", type: "string" },
    { key: "variant", label: "Variant", type: "select", options: ["default", "destructive"] },
    { key: "className", label: "CSS Class", type: "className" },
  ],
  Input: [
    { key: "placeholder", label: "Placeholder", type: "string" },
    { key: "type", label: "Input Type", type: "select", options: ["text", "email", "password", "number"] },
    { key: "className", label: "CSS Class", type: "className" },
  ],
  Textarea: [
    { key: "placeholder", label: "Placeholder", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
  ],
  Checkbox: [
    { key: "label", label: "Label", type: "string" },
    { key: "checked", label: "Checked", type: "boolean" },
    { key: "className", label: "CSS Class", type: "className" },
  ],
};
