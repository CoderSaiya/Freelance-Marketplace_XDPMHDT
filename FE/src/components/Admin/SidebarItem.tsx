import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  badge?: number;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  isActive,
  badge,
  onClick,
}) => (
  <div onClick={onClick}>
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2 mb-1",
        isActive && "bg-primary/10"
      )}
    >
      {icon}
      <span>{title}</span>
      {badge && (
        <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
          {badge}
        </span>
      )}
    </Button>
  </div>
);

export default SidebarItem;
