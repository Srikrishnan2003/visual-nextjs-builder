export const importMap: Record<string, string> = {
  Button: "import { Button } from '@/components/ui/button';",
  Div: "import Div from '@/components/ui/div';",
  FlexBox: "import FlexBox from '@/components/ui/flexbox';",
  P: "import { P } from '@/components/ui/p';",
  Card: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card';",
  Accordion: "import { Accordion, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';",
  AccordionItem: "import AccordionItem from '@/components/AccordionItem';",
  Tabs: "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';",
  Alert: "import { Alert } from '@/components/ui/alert';",
  Input: "import { Input } from '@/components/ui/input';",
  Textarea: "import { Textarea } from '@/components/ui/textarea';",
  Checkbox: "import { Checkbox } from '@/components/ui/checkbox';",
  Label: "import { Label } from '@/components/ui/label';",
};

export const componentGroupMap: Record<string, string> = {
    CardHeader: 'Card',
    CardTitle: 'Card',
    CardDescription: 'Card',
    CardContent: 'Card',
    CardFooter: 'Card',
    CardAction: 'Card',
    AccordionTrigger: 'Accordion',
    AccordionContent: 'Accordion',
    TabsList: 'Tabs',
    TabsTrigger: 'Tabs',
    TabsContent: 'Tabs',
};