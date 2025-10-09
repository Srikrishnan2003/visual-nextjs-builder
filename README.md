# Visual Next.js Builder

Visual Next.js Builder is a web-based visual editor for creating Next.js applications. It features a drag-and-drop interface to design component layouts, manage a virtual file system, and generate React/JSX code in real-time. Users can build pages, create reusable custom components, and export the entire project as a downloadable ZIP file.

## Features

- **Drag-and-Drop Canvas**: Visually construct your user interface by dragging and dropping components onto an interactive canvas.
- **Component Toolbar**: A library of pre-built UI elements such as Buttons, Divs, Cards, and Accordions that can be added to your project.
- **Properties Panel**: Select any component on the canvas to inspect and modify its properties, including text content, styling, and Tailwind CSS classes.
- **Virtual File System**: A file explorer that mimics a real project structure, allowing you to create, rename, and delete files and folders.
- **Custom Components**: Create reusable components by designing a layout, marking the file as a "Custom Component," and then adding instances of it throughout your project.
- **Live Code Generation**: A read-only code editor displays the generated JSX for the currently selected file, updating instantly with every change made on the canvas.
- **Project Export**: Download your complete Next.js project, including all files, folders, and configuration, as a ZIP archive ready for local development or deployment.
- **History Management**: Undo and redo actions with keyboard shortcuts.
- **Local Project Storage**: Save and load your projects using the browser's local storage.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
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
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser. You will be directed to the landing page. Click "Get Started" to navigate to the builder interface at `/main`.

## How It Works

The builder's user interface is organized into several key panels:

### Left Sidebar
- **Components**: Contains built-in elements like `Button`, `Div`, `Card`, and `Accordion`. Click one to add it to the active canvas page.
- **Custom Components**: Once you create a reusable component, it appears here. You can click to add instances of it to other pages.

### Center Canvas
This is your primary design workspace.
- Add components from the sidebar.
- Drag top-level components to reposition them on the canvas.
- Click any component to select it and view its details in the right-side properties panel.
- Right-click a component to access a context menu for actions like copy, cut, paste, duplicate, and delete.

### Right-Side Panels
This area contains three collapsible panels for managing properties, files, and code.

- **Properties Panel**: Appears when a component is selected.
    - Modify properties like text content, variant, size, or icon.
    - Use the "Edit Class" button to open a popover and apply various Tailwind CSS utility classes for detailed styling.
    - For container components (like `Div` or `FlexBox`), you can add, select, or delete child components.

- **File Explorer**:
    - Manage your project's file structure.
    - Click any `.tsx` file to open it on the canvas for editing.
    - Right-click a file or folder to access options like `Rename`, `Delete`, `New File`, or `New Folder`.
    - **To create a reusable custom component**:
        1. Create a new file (e.g., `MyCard.tsx`) inside the `components` folder.
        2. Design its layout on the canvas as you would with any other page.
        3. In the File Explorer, right-click the file and select **"Mark as Component"**. It will now appear in the "Custom Components" panel on the left.

- **Code Editor**:
    - Displays a live, read-only preview of the generated JSX code for the file currently active on the canvas. The code updates in real-time as you make changes to the design.

### Topbar
- **Project Management**: Save the current state of your project to local storage or load a previously saved project.
- **Viewport Controls**: Switch the canvas preview between Desktop, Tablet, and Mobile views.
- **History Controls**: Undo and redo your actions.
- **Export Project**: Click "Export Project" to download a `.zip` file containing your entire project, ready to be used as a standard Next.js application.
