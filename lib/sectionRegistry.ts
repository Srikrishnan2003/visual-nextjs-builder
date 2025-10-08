// lib/sectionRegistry.ts
import { ComponentNode } from "@/types/component-nodes";

export interface SectionDefinition {
  id: string;
  name: string;
  category: 'hero' | 'features' | 'content' | 'pricing' | 'testimonials' | 'cta' | 'footer' | 'navigation';
  thumbnail: string;
  description: string;
  tags: string[];
  components: ComponentNode[]; // The actual component tree
  config?: {
    editable: string[]; // Which props can be edited
    removable: string[]; // Which components can be removed
  };
}

export const sectionRegistry: Record<string, SectionDefinition> = {
  'hero-centered': {
    id: 'hero-centered',
    name: 'Centered Hero',
    category: 'hero',
    thumbnail: '/sections/hero-centered.png',
    description: 'Centered hero section with headline, subheadline, and CTA buttons',
    tags: ['landing', 'modern', 'centered'],
    components: [
      {
        id: 'hero-container',
        type: 'FlexBox',
        props: {
          className: 'min-h-screen flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white',
        },
        x: 0, y: 0,
        children: [
          {
            id: 'hero-heading',
            type: 'P',
            props: {
              children: 'Build Beautiful Websites',
              className: 'text-6xl font-bold text-gray-900 text-center mb-4',
            },
            x: 0, y: 0,
          },
          {
            id: 'hero-subheading',
            type: 'P',
            props: {
              children: 'Create stunning websites without writing code',
              className: 'text-xl text-gray-600 text-center mb-8 max-w-2xl',
            },
            x: 0, y: 0,
          },
          {
            id: 'hero-cta-container',
            type: 'FlexBox',
            props: {
              className: 'flex-row gap-4',
            },
            x: 0, y: 0,
            children: [
              {
                id: 'hero-cta-primary',
                type: 'Button',
                props: {
                  children: 'Get Started',
                  variant: 'default',
                  size: 'lg',
                  className: 'px-8 py-6 text-lg',
                },
                x: 0, y: 0,
              },
              {
                id: 'hero-cta-secondary',
                type: 'Button',
                props: {
                  children: 'Learn More',
                  variant: 'outline',
                  size: 'lg',
                  className: 'px-8 py-6 text-lg',
                },
                x: 0, y: 0,
              },
            ],
          },
        ],
      },
    ],
    config: {
      editable: ['hero-heading.children', 'hero-subheading.children', 'hero-cta-primary.children', 'hero-cta-secondary.children'],
      removable: ['hero-cta-secondary'],
    },
  },

  'navbar-simple': {
    id: 'navbar-simple',
    name: 'Simple Navigation',
    category: 'navigation',
    thumbnail: '/sections/navbar-simple.png',
    description: 'Clean navigation bar with logo and menu items',
    tags: ['header', 'menu', 'navigation'],
    components: [
      {
        id: 'navbar-container',
        type: 'FlexBox',
        props: {
          className: 'flex-row items-center justify-between px-8 py-4 bg-white border-b border-gray-200',
        },
        x: 0, y: 0,
        children: [
          {
            id: 'navbar-logo',
            type: 'P',
            props: {
              children: 'YourBrand',
              className: 'text-2xl font-bold text-gray-900',
            },
            x: 0, y: 0,
          },
          {
            id: 'navbar-menu',
            type: 'FlexBox',
            props: {
              className: 'flex-row gap-8',
            },
            x: 0, y: 0,
            children: [
              {
                id: 'nav-item-1',
                type: 'Button',
                props: {
                  children: 'Home',
                  variant: 'ghost',
                },
                x: 0, y: 0,
              },
              {
                id: 'nav-item-2',
                type: 'Button',
                props: {
                  children: 'Features',
                  variant: 'ghost',
                },
                x: 0, y: 0,
              },
              {
                id: 'nav-item-3',
                type: 'Button',
                props: {
                  children: 'Pricing',
                  variant: 'ghost',
                },
                x: 0, y: 0,
              },
              {
                id: 'nav-item-cta',
                type: 'Button',
                props: {
                  children: 'Sign Up',
                  variant: 'default',
                },
                x: 0, y: 0,
              },
            ],
          },
        ],
      },
    ],
  },

  'features-3col': {
    id: 'features-3col',
    name: '3-Column Features',
    category: 'features',
    thumbnail: '/sections/features-3col.png',
    description: 'Three column feature grid with icons',
    tags: ['features', 'grid', 'services'],
    components: [
      {
        id: 'features-container',
        type: 'FlexBox',
        props: {
          className: 'flex-col items-center py-24 px-8 bg-white',
        },
        x: 0, y: 0,
        children: [
          {
            id: 'features-heading',
            type: 'P',
            props: {
              children: 'Our Features',
              className: 'text-4xl font-bold text-gray-900 mb-4',
            },
            x: 0, y: 0,
          },
          {
            id: 'features-subheading',
            type: 'P',
            props: {
              children: 'Everything you need to build amazing websites',
              className: 'text-xl text-gray-600 mb-16 max-w-2xl text-center',
            },
            x: 0, y: 0,
          },
          {
            id: 'features-grid',
            type: 'FlexBox',
            props: {
              className: 'flex-row gap-8 max-w-7xl flex-wrap justify-center',
            },
            x: 0, y: 0,
            children: [
              // Feature 1
              {
                id: 'feature-card-1',
                type: 'Card',
                props: {
                  className: 'w-80 p-8',
                },
                x: 0, y: 0,
                children: [
                  {
                    id: 'feature-1-icon',
                    type: 'P',
                    props: {
                      children: '⚡',
                      className: 'text-5xl mb-4',
                    },
                    x: 0, y: 0,
                  },
                  {
                    id: 'feature-1-title',
                    type: 'P',
                    props: {
                      children: 'Lightning Fast',
                      className: 'text-2xl font-bold mb-2',
                    },
                    x: 0, y: 0,
                  },
                  {
                    id: 'feature-1-desc',
                    type: 'P',
                    props: {
                      children: 'Build websites in minutes, not hours',
                      className: 'text-gray-600',
                    },
                    x: 0, y: 0,
                  },
                ],
              },
              // Feature 2
              {
                id: 'feature-card-2',
                type: 'Card',
                props: {
                  className: 'w-80 p-8',
                },
                x: 0, y: 0,
                children: [
                  {
                    id: 'feature-2-icon',
                    type: 'P',
                    props: {
                      children: '🎨',
                      className: 'text-5xl mb-4',
                    },
                    x: 0, y: 0,
                  },
                  {
                    id: 'feature-2-title',
                    type: 'P',
                    props: {
                      children: 'Beautiful Design',
                      className: 'text-2xl font-bold mb-2',
                    },
                    x: 0, y: 0,
                  },
                  {
                    id: 'feature-2-desc',
                    type: 'P',
                    props: {
                      children: 'Pre-designed sections that look amazing',
                      className: 'text-gray-600',
                    },
                    x: 0, y: 0,
                  },
                ],
              },
              // Feature 3
              {
                id: 'feature-card-3',
                type: 'Card',
                props: {
                  className: 'w-80 p-8',
                },
                x: 0, y: 0,
                children: [
                  {
                    id: 'feature-3-icon',
                    type: 'P',
                    props: {
                      children: '📱',
                      className: 'text-5xl mb-4',
                    },
                    x: 0, y: 0,
                  },
                  {
                    id: 'feature-3-title',
                    type: 'P',
                    props: {
                      children: 'Fully Responsive',
                      className: 'text-2xl font-bold mb-2',
                    },
                    x: 0, y: 0,
                  },
                  {
                    id: 'feature-3-desc',
                    type: 'P',
                    props: {
                      children: 'Works perfectly on all devices',
                      className: 'text-gray-600',
                    },
                    x: 0, y: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  'footer-simple': {
    id: 'footer-simple',
    name: 'Simple Footer',
    category: 'footer',
    thumbnail: '/sections/footer-simple.png',
    description: 'Clean footer with links and copyright',
    tags: ['footer', 'links', 'copyright'],
    components: [
      {
        id: 'footer-container',
        type: 'FlexBox',
        props: {
          className: 'flex-col items-center py-12 px-8 bg-gray-900 text-white',
        },
        x: 0, y: 0,
        children: [
          {
            id: 'footer-links',
            type: 'FlexBox',
            props: {
              className: 'flex-row gap-8 mb-8',
            },
            x: 0, y: 0,
            children: [
              {
                id: 'footer-link-1',
                type: 'Button',
                props: {
                  children: 'About',
                  variant: 'ghost',
                  className: 'text-gray-300 hover:text-white',
                },
                x: 0, y: 0,
              },
              {
                id: 'footer-link-2',
                type: 'Button',
                props: {
                  children: 'Contact',
                  variant: 'ghost',
                  className: 'text-gray-300 hover:text-white',
                },
                x: 0, y: 0,
              },
              {
                id: 'footer-link-3',
                type: 'Button',
                props: {
                  children: 'Privacy',
                  variant: 'ghost',
                  className: 'text-gray-300 hover:text-white',
                },
                x: 0, y: 0,
              },
            ],
          },
          {
            id: 'footer-copyright',
            type: 'P',
            props: {
              children: '© 2024 YourBrand. All rights reserved.',
              className: 'text-gray-400 text-sm',
            },
            x: 0, y: 0,
          },
        ],
      },
    ],
  },
};

// Helper to get sections by category
export function getSectionsByCategory(category: SectionDefinition['category']) {
  return Object.values(sectionRegistry).filter(s => s.category === category);
}

// Helper to add section to canvas
export function insertSection(sectionId: string): ComponentNode[] {
  const section = sectionRegistry[sectionId];
  if (!section) return [];
  
  // Deep clone the components with new IDs
  return cloneComponentsWithNewIds(section.components);
}

function cloneComponentsWithNewIds(components: ComponentNode[]): ComponentNode[] {
  return components.map(component => ({
    ...component,
    id: crypto.randomUUID(),
    children: component.children ? cloneComponentsWithNewIds(component.children) : undefined,
  }));
}