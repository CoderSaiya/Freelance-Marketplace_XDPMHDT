export interface RouteType {
  path: string;
  component: React.FC;
  layout?: React.FC<{ children: React.ReactNode }>;
  role?: string;
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
  activeTab: string;
  refetch: () => void;
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
  status?: number;
  message?: string;
}

export interface ResponseRestful<T> {
  success: boolean;
  message: string;
  Data: T;
}

export interface RegisterReq {
  username: string;
  password: string;
  email: string;
  role: string;
}

export interface Project {
  title: string;
  budget: string;
  progress: number;
  status: "active" | "completed";
  dueDate: string;
}

export interface Revenue {
  month: string;
  revenue: number;
}

export interface GlobalDashboard {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
}

export interface StatisticsType {
  revenueStatistics: GlobalDashboard
  projectStatistics: GlobalDashboard
  freelancerStatistics: GlobalDashboard
  contractStatistics: GlobalDashboard
}

export interface CateogoryPercent {
  categoryName: string;
  projectCount: number;
  percentage: number;
}

export interface ProjectStatusCount {
  status: string;
  projectCount: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  Redirect?: string;
}
