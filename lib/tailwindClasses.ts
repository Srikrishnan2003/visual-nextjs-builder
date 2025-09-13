export interface ClassCategory {
  label: string;
  options: string[];
  required?: string[]; // classes that must also be added when one is selected
}

export const tailwindClassOptions: Record<string, ClassCategory> = {
  // Layout & Display
  Display: {
    label: "Display",
    options: ["block", "inline-block", "flex", "grid", "hidden"],
  },
  Flexbox: {
    label: "Flexbox",
    options: [
      "flex-row", "flex-col", "flex-wrap", "flex-nowrap", "flex-wrap-reverse",
      "justify-start", "justify-end", "justify-center", "justify-between", "justify-around", "justify-evenly",
      "items-start", "items-end", "items-center", "items-baseline", "items-stretch",
      "content-start", "content-end", "content-center", "content-between", "content-around", "content-evenly",
    ],
  },
  Grid: {
    label: "Grid",
    options: ["grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4", "grid-cols-5", "grid-cols-6", "grid-rows-1", "grid-rows-2", "grid-rows-3"],
  },
  Gap: {
    label: "Gap",
    options: ["gap-0", "gap-1", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6", "gap-8", "gap-10", "gap-12", "gap-16", "gap-x-4", "gap-y-4"],
  },
  Position: {
    label: "Position",
    options: ["relative", "absolute", "fixed", "sticky", "top-0", "bottom-0", "left-0", "right-0", "inset-0", "z-10", "z-20", "z-30", "z-40", "z-50"],
  },
  Sizing: {
    label: "Sizing",
    options: ["w-full", "h-full", "w-1/2", "h-1/2", "w-screen", "h-screen", "min-h-screen", "max-w-full", "max-w-screen-sm", "max-w-screen-md", "max-w-screen-lg", "max-w-screen-xl"],
  },
  Overflow: {
    label: "Overflow",
    options: ["overflow-auto", "overflow-hidden", "overflow-scroll", "overflow-x-auto", "overflow-y-auto"],
  },

  // Typography
  TextSize: {
    label: "Text Size",
    options: ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl"],
  },
  TextColor: {
    label: "Text Color",
    options: ["text-white", "text-black", "text-gray-500", "text-blue-500", "text-green-500", "text-red-500", "text-primary", "text-secondary"],
  },
  FontWeight: {
    label: "Font Weight",
    options: ["font-light", "font-normal", "font-medium", "font-semibold", "font-bold", "font-extrabold"],
  },
  TextAlign: {
    label: "Text Align",
    options: ["text-left", "text-center", "text-right", "text-justify"],
  },
  TextTransform: {
    label: "Text Transform",
    options: ["uppercase", "lowercase", "capitalize", "normal-case"],
  },
  LineHeight: {
    label: "Line Height",
    options: ["leading-none", "leading-tight", "leading-snug", "leading-normal", "leading-relaxed", "leading-loose"],
  },

  // Backgrounds
  BackgroundColor: {
    label: "Background Color",
    options: ["bg-white", "bg-black", "bg-gray-100", "bg-gray-200", "bg-blue-100", "bg-blue-500", "bg-green-100", "bg-green-500", "bg-red-100", "bg-red-500", "bg-yellow-100", "bg-yellow-500", "bg-primary", "bg-secondary"],
  },

  // Spacing
  Padding: {
    label: "Padding",
    options: ["p-0", "p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-8", "p-10", "p-12", "px-0", "px-1", "px-2", "px-3", "px-4", "px-5", "px-6", "px-8", "py-0", "py-1", "py-2", "py-3", "py-4", "py-5", "py-6", "py-8"],
  },
  Margin: {
    label: "Margin",
    options: ["m-0", "m-1", "m-2", "m-3", "m-4", "m-5", "m-6", "m-8", "m-10", "m-12", "mx-0", "mx-1", "mx-2", "mx-3", "mx-4", "mx-5", "mx-6", "mx-auto", "my-0", "my-1", "my-2", "my-3", "my-4", "my-5", "my-6", "my-8"],
  },

  // Borders
  BorderWidth: {
    label: "Border Width",
    options: ["border", "border-0", "border-2", "border-4", "border-8", "border-t", "border-b", "border-l", "border-r"],
    required: ["border-solid"], // Default to solid if width is set
  },
  BorderStyle: {
    label: "Border Style",
    options: ["border-solid", "border-dashed", "border-dotted", "border-double", "border-none"],
  },
  BorderColor: {
    label: "Border Color",
    options: ["border-current", "border-transparent", "border-black", "border-white", "border-gray-200", "border-gray-500", "border-blue-500", "border-red-500", "border-green-500", "border-primary"],
    required: ["border"], // Ensure a border exists if color is set
  },
  BorderRadius: {
    label: "Rounded Corners",
    options: ["rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full"],
  },

  // Effects
  Shadow: {
    label: "Shadow",
    options: ["shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl", "shadow-inner", "shadow-none"],
  },
  Opacity: {
    label: "Opacity",
    options: ["opacity-0", "opacity-25", "opacity-50", "opacity-75", "opacity-100"],
  },
  Transition: {
    label: "Transition",
    options: ["transition-all", "transition-colors", "transition-opacity", "transition-shadow", "transition-transform"],
  },
  Duration: {
    label: "Transition Duration",
    options: ["duration-75", "duration-150", "duration-200", "duration-300", "duration-500", "duration-700", "duration-1000"],
  },
  Ease: {
    label: "Transition Ease",
    options: ["ease-linear", "ease-in", "ease-out", "ease-in-out"],
  },
  Transform: {
    label: "Transform",
    options: ["scale-0", "scale-50", "scale-75", "scale-90", "scale-95", "scale-100", "scale-105", "scale-110", "scale-125", "scale-150", "rotate-0", "rotate-1", "rotate-2", "rotate-3", "rotate-6", "rotate-12", "rotate-45", "rotate-90", "rotate-180"],
  },

  // Interactivity
  Cursor: {
    label: "Cursor",
    options: ["cursor-auto", "cursor-default", "cursor-pointer", "cursor-wait", "cursor-text", "cursor-move", "cursor-help", "cursor-not-allowed", "cursor-none", "cursor-context-menu", "cursor-progress", "cursor-cell", "cursor-crosshair", "cursor-vertical-text", "cursor-alias", "cursor-copy", "cursor-no-drop", "cursor-grab", "cursor-grabbing", "cursor-all-scroll", "cursor-col-resize", "cursor-row-resize", "cursor-n-resize", "cursor-e-resize", "cursor-s-resize", "cursor-w-resize", "cursor-ne-resize", "cursor-nw-resize", "cursor-se-resize", "cursor-sw-resize", "cursor-ew-resize", "cursor-ns-resize", "cursor-nesw-resize", "cursor-nwse-resize", "cursor-zoom-in", "cursor-zoom-out"],
  },
  PointerEvents: {
    label: "Pointer Events",
    options: ["pointer-events-none", "pointer-events-auto"],
  },
  UserSelect: {
    label: "User Select",
    options: ["select-none", "select-text", "select-all", "select-auto"],
  },
};
