import { Button } from "@/components/ui/button";
import Div from "@/components/ui/div";
import FlexBox from "@/components/ui/flexbox";
import { P } from "@/components/ui/p";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tabs } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import AccordionItem from "@/components/AccordionItem"; // New import
import { ComponentType } from "react";

export const componentRegistry: Record<string, ComponentType<object>> = {
    Button,
    Div,
    FlexBox,
    P,
    Card,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Tabs,
    Alert,
    Input,
    Textarea,
    Checkbox,
};