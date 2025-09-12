import { Button } from "@/components/ui/button";
import Div from "@/components/ui/div";
import FlexBox from "@/components/ui/flexbox";
import { ComponentType } from "react";

export const componentRegistry: Record<string, ComponentType<any>> = {
    Button,
    Div,
    FlexBox,
};