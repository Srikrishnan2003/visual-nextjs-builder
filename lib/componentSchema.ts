export type PropField = {
  key: string;
  label: string;
  type: "string" | "boolean" | "className" | "select";
  options?: string[]; // only for "select"
};

const commonStylingProps: PropField[] = [
  { key: "display", label: "Display", type: "select", options: ["block", "flex", "inline-block", "inline-flex"] },
  { key: "flexDirection", label: "Flex Direction", type: "select", options: ["row", "col", "row-reverse", "col-reverse"] },
  { key: "justifyContent", label: "Justify Content", type: "select", options: ["justify-start", "justify-center", "justify-end", "justify-between", "justify-around", "justify-evenly"] },
  { key: "alignItems", label: "Align Items", type: "select", options: ["items-start", "items-center", "items-end", "items-baseline", "items-stretch"] },
  { key: "gap", label: "Gap", type: "select", options: ["gap-0", "gap-1", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6", "gap-8", "gap-10", "gap-12", "gap-16"] },
  { key: "paddingTop", label: "Padding Top", type: "select", options: ["pt-0", "pt-1", "pt-2", "pt-3", "pt-4", "pt-5", "pt-6", "pt-8", "pt-10", "pt-12", "pt-16"] },
  { key: "paddingRight", label: "Padding Right", type: "select", options: ["pr-0", "pr-1", "pr-2", "pr-3", "pr-4", "pr-5", "pr-6", "pr-8", "pr-10", "pr-12", "pr-16"] },
  { key: "paddingBottom", label: "Padding Bottom", type: "select", options: ["pb-0", "pb-1", "pb-2", "pb-3", "pb-4", "pb-5", "pb-6", "pb-8", "pb-10", "pb-12", "pb-16"] },
  { key: "paddingLeft", label: "Padding Left", type: "select", options: ["pl-0", "pl-1", "pl-2", "pl-3", "pl-4", "pl-5", "pl-6", "pl-8", "pl-10", "pl-12", "pl-16"] },
  { key: "paddingX", label: "Padding X-axis", type: "select", options: ["px-0", "px-1", "px-2", "px-3", "px-4", "px-5", "px-6", "px-8", "px-10", "px-12", "px-16"] },
  { key: "paddingY", label: "Padding Y-axis", type: "select", options: ["py-0", "py-1", "py-2", "py-3", "py-4", "py-5", "py-6", "py-8", "py-10", "py-12", "py-16"] },
  { key: "marginTop", label: "Margin Top", type: "select", options: ["mt-0", "mt-1", "mt-2", "mt-3", "mt-4", "mt-5", "mt-6", "mt-8", "mt-10", "mt-12", "mt-16"] },
  { key: "marginRight", label: "Margin Right", type: "select", options: ["mr-0", "mr-1", "mr-2", "mr-3", "mr-4", "mr-5", "mr-6", "mr-8", "mr-10", "mr-12", "mr-16"] },
  { key: "marginBottom", label: "Margin Bottom", type: "select", options: ["mb-0", "mb-1", "mb-2", "mb-3", "mb-4", "mb-5", "mb-6", "mb-8", "mb-10", "mb-12", "mb-16"] },
  { key: "marginLeft", label: "Margin Left", type: "select", options: ["ml-0", "ml-1", "ml-2", "ml-3", "ml-4", "ml-5", "ml-6", "ml-8", "ml-10", "ml-12", "ml-16"] },
  { key: "marginX", label: "Margin X-axis", type: "select", options: ["mx-0", "mx-1", "mx-2", "mx-3", "mx-4", "mx-5", "mx-6", "mx-8", "mx-10", "mx-12", "mx-16", "mx-auto"] },
  { key: "marginY", label: "Margin Y-axis", type: "select", options: ["my-0", "my-1", "my-2", "my-3", "my-4", "my-5", "my-6", "my-8", "my-10", "my-12", "my-16"] },
  { key: "bgColor", label: "Background Color", type: "select", options: ["bg-white", "bg-gray-50", "bg-gray-100", "bg-blue-100", "bg-red-100", "bg-green-100", "bg-yellow-100", "bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-500"] },
  { key: "width", label: "Width", type: "select", options: ["w-auto", "w-full", "w-1/2", "w-1/3", "w-2/3", "w-1/4", "w-3/4", "w-screen"] },
  { key: "height", label: "Height", type: "select", options: ["h-auto", "h-full", "h-1/2", "h-1/3", "h-2/3", "h-1/4", "h-3/4", "h-screen"] },
  { key: "borderRadius", label: "Border Radius", type: "select", options: ["rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full"] },
  { key: "borderWidth", label: "Border Width", type: "select", options: ["border-0", "border", "border-2", "border-4", "border-8"] },
  { key: "borderColor", label: "Border Color", type: "select", options: ["border-gray-200", "border-gray-400", "border-blue-500", "border-red-500", "border-green-500"] },
  { key: "shadow", label: "Shadow", type: "select", options: ["shadow-none", "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"] },
];

const textStylingProps: PropField[] = [
  { key: "fontSize", label: "Font Size", type: "select", options: ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl"] },
  { key: "fontWeight", label: "Font Weight", type: "select", options: ["font-thin", "font-extralight", "font-light", "font-normal", "font-medium", "font-semibold", "font-bold", "font-extrabold", "font-black"] },
  { key: "textAlign", label: "Text Align", type: "select", options: ["text-left", "text-center", "text-right", "text-justify"] },
  { key: "textColor", label: "Text Color", type: "select", options: ["text-black", "text-gray-500", "text-blue-500", "text-red-500", "text-green-500", "text-yellow-500", "text-white"] },
];

export const propSchemas: Record<string, PropField[]> = {
  Button: [
    { key: "children", label: "Text", type: "string" },
    { key: "value", label: "Value", type: "string" },
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
    ...commonStylingProps,
  ],
  Div: [
    { key: "children", label: "Content", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  FlexBox: [
    { key: "direction", label: "Direction", type: "select", options: ["row", "col"] },
    { key: "gap", label: "Gap", type: "select", options: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16"] },
    { key: "justifyContent", label: "Justify Content", type: "select", options: ["justify-start", "justify-end", "justify-center", "justify-between", "justify-around", "justify-evenly"] },
    { key: "alignItems", label: "Align Items", type: "select", options: ["items-start", "items-end", "items-center", "items-baseline", "items-stretch"] },
    { key: "flexWrap", label: "Flex Wrap", type: "select", options: ["flex-wrap", "flex-nowrap", "flex-wrap-reverse"] },
    { key: "alignContent", label: "Align Content", type: "select", options: ["content-start", "content-end", "content-center", "content-between", "content-around", "content-evenly"] },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  P: [
    { key: "children", label: "Text", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...textStylingProps,
    ...commonStylingProps,
  ],
  Card: [
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  CardHeader: [
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  CardTitle: [
    { key: "children", label: "Text", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...textStylingProps,
    ...commonStylingProps,
  ],
  CardDescription: [
    { key: "children", label: "Text", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...textStylingProps,
    ...commonStylingProps,
  ],
  CardAction: [
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  CardContent: [
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  CardFooter: [
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  Label: [
    { key: "children", label: "Text", type: "string" },
    { key: "htmlFor", label: "For Input ID", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...textStylingProps,
    ...commonStylingProps,
  ],
  Accordion: [
    { key: "type", label: "Type", type: "select", options: ["single", "multiple"] },
    { key: "collapsible", label: "Collapsible", type: "boolean" },
    { key: "defaultValue", label: "Default Open Item(s)", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  AccordionItem: [
    { key: "value", label: "Item Value", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  AccordionTrigger: [
    { key: "children", label: "Content", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...textStylingProps,
    ...commonStylingProps,
  ],
  AccordionContent: [
    { key: "children", label: "Content", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...textStylingProps,
    ...commonStylingProps,
  ],
  Tabs: [
    { key: "defaultValue", label: "Default Value", type: "string" }, // This would correspond to a tab's value
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  TabsList: [
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  TabsTrigger: [
    { key: "value", label: "Tab Value", type: "string" },
    { key: "children", label: "Text", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...textStylingProps,
    ...commonStylingProps,
  ],
  TabsContent: [
    { key: "value", label: "Tab Value", type: "string" },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  Alert: [
    { key: "title", label: "Title", type: "string" },
    { key: "description", label: "Description", type: "string" },
    { key: "variant", label: "Variant", type: "select", options: ["default", "destructive", "warning", "success"] },
    { key: "icon", label: "Icon", type: "select", options: ["none", "Info", "FileWarning", "Check"] },
    { key: "showCloseButton", label: "Show Close Button", type: "boolean" },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  Input: [
    { key: "placeholder", label: "Placeholder", type: "string" },
    { key: "type", label: "Input Type", type: "select", options: ["text", "email", "password", "number"] },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  Textarea: [
    { key: "label", label: "Label", type: "string" },
    { key: "placeholder", label: "Placeholder", type: "string" },
    { key: "helperText", label: "Helper Text", type: "string" },
    { key: "disabled", label: "Disabled", type: "boolean" },
    { key: "readOnly", label: "Read Only", type: "boolean" },
    { key: "rows", label: "Rows", type: "number" },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
  Checkbox: [
    { key: "value", label: "Value", type: "string" },
    { key: "checked", label: "Checked", type: "boolean" },
    { key: "className", label: "CSS Class", type: "className" },
    ...commonStylingProps,
  ],
};
