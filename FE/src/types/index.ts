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

export interface ProfileHeaderProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  contactInfo: {
    phone: string;
    address: string;
    email: string;
    birthday: Date;
    gender: string;
    rating: number;
    company: string;
    location: string;
    bio: string;
    skill: string;
    avatar: string;
    industry: string;
  };
  userId: number;
  username: string;
}

export interface TabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export interface AboutTabProps {
  isEditing: boolean;
  contactInfo: {
    phone: string;
    address: string;
    email: string;
    birthday: string;
    gender: string;
    rating: number;
    company: string;
    location: string;
    bio: string;
    skill: string;
    avatar: string;
    industry: string;
  };
  setContactInfo: React.Dispatch<React.SetStateAction<{
    phone: string;
    address: string;
    email: string;
    birthday: string;
    gender: string;
    rating: number;
    company: string;
    location: string;
    bio: string;
    skill: string;
    avatar: string;
    industry: string;
  }>>;
}

export interface DecodedToken {
  role: string;
}

export interface ResponseType<T> {
  data: T;
}