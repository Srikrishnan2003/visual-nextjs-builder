import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

/**
 * Parses a JSX code string and extracts the props of the root element.
 *
 * @param code The source code string (e.g., `<Button variant="destructive" disabled={true}>Click me</Button>`)
 * @returns An object containing the extracted props (e.g., { variant: "destructive", disabled: true, children: "Click me" })
 */
export function parseCodeToState(code: string): Record<string, any> {
  const props: Record<string, any> = {};

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    traverse(ast, {
      // We are looking for the first (and only) JSXOpeningElement
      JSXOpeningElement(path) {
        path.node.attributes.forEach(attribute => {
          if (t.isJSXAttribute(attribute)) {
            const propName = attribute.name.name as string;

            if (t.isStringLiteral(attribute.value)) {
              // Handle string props: variant="destructive"
              props[propName] = attribute.value.value;
            } else if (t.isJSXExpressionContainer(attribute.value)) {
              const expression = attribute.value.expression;
              // Handle boolean props: disabled={true}
              if (t.isBooleanLiteral(expression)) {
                props[propName] = expression.value;
              }
              // Handle number props: count={10}
              else if (t.isNumericLiteral(expression)) {
                props[propName] = expression.value;
              }
              // Handle object/array props (as string): style={{ color: 'red' }}
              else {
                // For simplicity, we can stringify complex props.
                // A more advanced implementation would parse the expression.
                props[propName] = '...'; // Placeholder for complex expressions
              }
            }
          }
        });

        // Extract children
        const childrenNode = path.parentPath.node as t.JSXElement;
        const children = childrenNode.children.map(child => {
          if (t.isJSXText(child)) {
            return child.value.trim();
          }
          // Note: This doesn't handle nested components as children yet
          return '';
        }).filter(Boolean);

        if (children.length > 0) {
          props['children'] = children.join('\n');
        }

        // Stop traversal after the first element is processed.
        path.stop();
      }
    });
  } catch (error) {
    console.error("Failed to parse code:", error);
    return {}; // Return empty object on parsing error
  }

  return props;
}