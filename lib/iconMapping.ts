import { 
    ArrowRight, ArrowLeft, Download, Upload, Plus, Minus, Check, X, Info, FileWarning, Settings, User 
} from "lucide-react";

export const iconMap = {
    ArrowRight,
    ArrowLeft,
    Download,
    Upload,
    Plus,
    Minus,
    Check,
    X,
    Info,
    FileWarning,
    Settings,
    User,
};

export type IconName = keyof typeof iconMap;
