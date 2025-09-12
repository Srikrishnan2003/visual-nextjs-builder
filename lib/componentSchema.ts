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
};
