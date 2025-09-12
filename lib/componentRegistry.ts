import { Button } from "@/components/ui/button";
import Div from "@/components/ui/div";
import FlexBox from "@/components/ui/flexbox";
import { P } from "@/components/ui/p";
import { ComponentType } from "react";

export const componentRegistry: Record<string, ComponentType<object>> = {
    Button,
    Div,
    FlexBox,
    P,
};