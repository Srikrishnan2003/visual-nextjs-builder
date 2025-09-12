import * as parser from "@babel/parser";
import { ComponentNode } from "@/types/component-nodes";
import { v4 as uuid } from "uuid";
import { JSXElement, JSXIdentifier, JSXAttribute, JSXExpressionContainer, JSXText, Node } from "@babel/types";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

// Helper function to safely evaluate literal expressions
function evaluateLiteralExpression(expression: Node): string | number | boolean | null | undefined {
    if (expression.type === 'NumericLiteral') {
        return expression.value;
    } else if (expression.type === 'BooleanLiteral') {
        return expression.value;
    } else if (expression.type === 'StringLiteral') {
        return expression.value;
    } else if (expression.type === 'NullLiteral') {
        return null;
    } else if (expression.type === 'Identifier' && expression.name === 'undefined') {
        return undefined;
    }
    // For any other complex expressions, return undefined
    return undefined;
}

function transformNode(node: Node, importedComponents: Record<string, string>): ComponentNode | null {
    if (node.type === 'JSXElement') {
        const jsxElement = node as JSXElement;
        const openingElement = jsxElement.openingElement;
        const componentType = (openingElement.name as JSXIdentifier).name;

        const props: Record<string, string | number | boolean | null | undefined> = {};
        openingElement.attributes.forEach(attr => {
            if (attr.type === 'JSXAttribute') {
                const attribute = attr as JSXAttribute;
                const propName = attribute.name.name as string;
                let propValue: string | number | boolean | null | undefined;

                if (attribute.value?.type === 'StringLiteral') {
                    propValue = attribute.value.value;
                } else if (attribute.value?.type === 'JSXExpressionContainer') {
                    const expression = (attribute.value as JSXExpressionContainer).expression;
                    propValue = evaluateLiteralExpression(expression);
                    if (propValue === undefined) {
                        console.warn("Unsupported expression type for prop:", generate(expression).code);
                    }
                }
                props[propName] = propValue;
            }
        });

        const children: ComponentNode[] = jsxElement.children
            .map((child: Node) => transformNode(child, importedComponents))
            .filter((child): child is ComponentNode => child !== null);
        
        if (jsxElement.children.length === 1 && jsxElement.children[0].type === 'JSXText') {
            const textChild = jsxElement.children[0] as JSXText;
            if (textChild.value.trim()) {
                props['children'] = textChild.value.trim();
            }
        }

        return {
            id: uuid(),
            type: importedComponents[componentType] || componentType,
            props: props,
            children: children,
            x: 0,
            y: 0,
        };
    }
    return null;
}


export function parseCodeToTree(code: string): ComponentNode[] {
    try {
        const ast = parser.parse(code, {
            sourceType: "module",
            plugins: ["jsx"],
        });

        const importedComponents: Record<string, string> = {};
        traverse(ast, {
            ImportDeclaration(path) {
                const source = path.node.source.value;
                path.node.specifiers.forEach(specifier => {
                    if (specifier.type === 'ImportSpecifier') {
                        importedComponents[specifier.local.name] = specifier.imported.name;
                    } else if (specifier.type === 'ImportDefaultSpecifier') {
                        importedComponents[specifier.local.name] = 'default';
                    }
                });
            }
        });

        const tree: ComponentNode[] = ast.program.body
            .map(node => {
                if (node.type === 'ExpressionStatement' && node.expression.type === 'JSXElement') {
                    return transformNode(node.expression, importedComponents);
                }
                return null;
            })
            .filter((node): node is ComponentNode => node !== null);

        return tree;
    } catch (error) {
        console.error("Error parsing code:", error);
        return [];
    }
}
