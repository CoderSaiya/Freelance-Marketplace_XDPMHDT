export interface RouteType {
  path: string;
  component: React.FC;
  layout?: React.FC;
}

export interface BreadcrumbItem {
  name: string;
  link?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}