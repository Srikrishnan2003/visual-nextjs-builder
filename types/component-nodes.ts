export type ComponentNode = {
    id: string;
    type: string;
    props: {
        children?: React.ReactNode;
        className?: string;
        [key: string]: any; // Allow additional props
    };
    x: number;
    y: number;
    parentId?: string | null;
    children?: ComponentNode[];
}