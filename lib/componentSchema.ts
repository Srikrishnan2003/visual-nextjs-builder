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
