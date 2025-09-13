import { iconMap, IconName } from "@/lib/iconMapping";

interface DynamicLucideIconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

const DynamicLucideIcon = ({ name, ...props }: DynamicLucideIconProps) => {
  const LucideIcon = iconMap[name];

  if (!LucideIcon) {
    return null; // Or a fallback icon if the name is not in the map
  }

  return <LucideIcon {...props} />;
};

export default DynamicLucideIcon;
