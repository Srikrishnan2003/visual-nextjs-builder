# Visual Next.js Builder

This repository contains a web-based visual editor for building Next.js applications. It provides a drag-and-drop interface to design component layouts, manage a virtual file system, and generate the corresponding React/JSX code in real-time. You can create pages, build reusable custom components, and export the entire project as a downloadable ZIP file.

## Features

- **Drag-and-Drop Canvas**: Visually place and move components on an interactive canvas.
- **Component Toolbar**: A selection of basic HTML and UI elements (Buttons, Divs) to add to your design.
- **Properties Panel**: Select any component on the canvas to edit its properties, such as text content and Tailwind CSS classes.
- **Virtual File System**: A file explorer to create, rename, and delete files and folders, simulating a real project structure.
- **Custom Components**: Design a layout, mark its file as a "Custom Component," and reuse it throughout your project.
- **Live Code Generation**: A read-only code editor displays the generated JSX for the currently selected file, updating instantly with every change.
- **Project Export**: Download the complete project, including all files and folders, as a ZIP archive.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Drag & Drop**: [`@dnd-kit/core`](https://dndkit.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Code Editor**: [`@monaco-editor/react`](https://github.com/suren-atoyan/monaco-react)
- **ZIP Archiving**: [JSZip](https://stuk.github.io/jszip/)

## Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/srikrishnan2003/visual-nextjs-builder.git
    cd visual-nextjs-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser to start using the builder.

## How to Use

The interface is divided into several panels:

### 1. Left Sidebar
- **Components**: Contains built-in elements like `Button` and `Div`. Click one to add it to the currently selected page on the canvas.
- **Custom Components**: Once you create a reusable component, it will appear here. Click to add an instance of it to the canvas.

### 2. Canvas (Center)
This is your main work area.
- Add components from the left sidebar.
- Drag components to position them.
- Click a component to select it and view its details in the right-side properties panel.

### 3. Properties Panel (Right)
When a component is selected on the canvas, this panel appears.
- **Text**: Modify the inner text of the component.
- **Tailwind Class**: Click "Edit Class" to open a popover where you can select and apply various Tailwind CSS utility classes for styling.

### 4. File Explorer and Code Editor (Far Right)
- **File Explorer**:
    - Manage your project's file structure.
    - Click on a `.tsx` file to open it on the canvas and view its generated code.
    - Right-click (or use the `...` menu) on a file or folder to see options like `Rename`, `Delete`, `New File`, or `New Folder`.
    - **To create a reusable component**:
        1. Create a new file (e.g., `Card.tsx`) inside the `components` folder.
        2. Design its layout on the canvas.
        3. In the File Explorer, use the menu to **"Mark as Component"**. It will now be available in the "Custom Components" panel.

- **Code Editor**:
    - Displays a live, read-only preview of the generated JSX for the file currently active on the canvas.

### 5. Top Bar
- **Export Project as ZIP**: Click this button to download a `.zip` file containing your entire project, ready to be used as a standard Next.js application.
