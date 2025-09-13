import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface DynamicLucideIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const DynamicLucideIcon = ({ name, ...props }: DynamicLucideIconProps) => {
  const LucideIcon = dynamic(
    () => import("lucide-react").then((mod) => mod[name as keyof typeof mod] || (() => null)),
    {
      ssr: false,
      loading: () => <Loader2 className="h-4 w-4 animate-spin" />,
    }
  );

  if (!LucideIcon) {
    return null; // Or a fallback icon
  }

  return <LucideIcon {...props} />;
};

export default DynamicLucideIcon;
