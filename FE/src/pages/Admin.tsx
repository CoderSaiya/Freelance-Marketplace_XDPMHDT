import { useGetProjectQuery, useGetRevenueQuery } from "@/apis/graphqlApi";
import AnalyticsContent from "@/components/Admin/AnalytsContent";
import ContractContent from "@/components/Admin/ContractContent";
import DashboardContent from "@/components/Admin/DashboardContent";
import ProjectsContent from "@/components/Admin/ProjectsContent";
import SettingsContent from "@/components/Admin/SettingContent";
import SidebarItem from "@/components/Admin/SidebarItem";
import UsersContent from "@/components/Admin/UsersContent";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Project } from "@/types";
import {
  BarChart2,
  Bell,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("dashboard");

  const navigate = useNavigate();

  const { data } = useGetProjectQuery();
  const { data: revenueData } = useGetRevenueQuery();

  const revenues = revenueData?.data.monthlyRevenue || [];
  const projects = data?.data.projects || [];

  const handleLogout = () => {
    localStorage.setItem("access_token", "");
    localStorage.setItem("refresh", "");
    navigate("/login");
  };

  const getProgress = (status: string) => {
    let progress = 0;
    switch (status.toLowerCase()) {
      case "active":
        progress = 0;
        break;
      case "processing":
        progress = 50;
        break;
      case "finished":
        progress = 100;
        break;
    }
    return progress;
  };

  const projectData: Project[] = projects.map((project) => ({
    title: project.projectName || "N/A",
    budget: project.budget ? `$${project.budget}` : "N/A",
    progress: getProgress(project.status) || 0,
    status: project.status || "unknown",
    dueDate: format(new Date(project.deadline), "dd/MM/yyyy"),
  }));

  const menuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Dashboard",
      id: "dashboard",
    },
    {
      icon: <FolderKanban className="h-5 w-5" />,
      title: "Projects",
      id: "projects",
      badge: 8,
    },
    { icon: <Users className="h-5 w-5" />, title: "Users", id: "users" },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      title: "Analytics",
      id: "analytics",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Contracts",
      id: "contracts",
      badge: 3,
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Settings",
      id: "settings",
    },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <DashboardContent projectData={projectData} revenueData={revenues} />
        );
      case "projects":
        return <ProjectsContent projectData={projectData} />;
      case "users":
        return <UsersContent />;
      case "analytics":
        return <AnalyticsContent revenueData={revenues} />;
      case "contracts":
        return <ContractContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return (
          <DashboardContent projectData={projectData} revenueData={revenues} />
        );
    }
  };

  console.log(currentTab);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="h-14 border-b bg-white px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <FileText className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="px-2">
                {menuItems.map((item) => (
                  <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    isActive={currentTab === item.id}
                    badge={item.badge}
                    onClick={() => setCurrentTab(item.id)}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold md:hidden">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 rounded-full border border-gray-200 pl-8 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <img
                  src="/api/placeholder/32/32"
                  alt="Avatar"
                  className="rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">
                    admin@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Setting
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden md:block w-64 border-r bg-white">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <h1 className="text-xl font-bold">Freelance Admin</h1>
            </div>
          </div>
          <div className="p-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                isActive={currentTab === item.id}
                badge={item.badge}
                onClick={() => setCurrentTab(item.id)}
              />
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
