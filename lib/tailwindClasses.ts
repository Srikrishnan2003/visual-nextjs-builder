export interface ClassCategory {
  label: string;
  options: string[];
  required?: string[]; // classes that must also be added when one is selected
}

export const tailwindClassOptions: Record<string, ClassCategory> = {
  Text: {
    label: "Text",
    options: ["text-sm", "text-base", "text-lg", "text-xl", "text-white", "text-black", "text-primary"],
  },
  Background: {
    label: "Background",
    options: ["bg-white", "bg-black", "bg-gray-100", "bg-red-500", "bg-primary"],
  },
  Padding: {
    label: "Padding",
    options: ["p-1", "p-2", "p-4", "px-4", "py-2", "px-8", "py-4"],
  },
  Margin: {
    label: "Margin",
    options: ["m-1", "m-2", "m-4", "mx-4", "my-2"],
  },
  BorderColor: {
    label: "Border Color",
    options: ["border-red-500", "border-gray-200", "border-blue-500"],
    required: ["border"], // add 'border' if any option is selected
  },
  BorderRadius: {
    label: "Rounded",
    options: ["rounded", "rounded-md", "rounded-lg", "rounded-full"],
  },
  Font: {
    label: "Font",
    options: ["font-sans", "font-serif", "font-mono", "font-bold", "font-semibold"],
  },
};
