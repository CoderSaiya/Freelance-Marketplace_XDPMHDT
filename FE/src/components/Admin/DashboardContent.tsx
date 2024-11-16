import { AlertCircle, Briefcase, DollarSign, UserCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import StatCard from "./StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProjectCard from "./ProjectCard";
import { GlobalDashboard, Project, Revenue, StatisticsType } from "@/types";
import { useEffect, useState } from "react";
import { useGetStatisticsQuery } from "@/apis/graphqlApi";

interface Props {
  projectData: Project[];
  revenueData: Revenue[];
}

type PeriodType = "today" | "this-week" | "this-month" | "this-year";

const periodMap: Record<PeriodType, keyof GlobalDashboard> = {
  today: "today",
  "this-week": "thisWeek",
  "this-month": "thisMonth",
  "this-year": "thisYear",
};

const DashboardContent: React.FC<Props> = ({ projectData, revenueData }) => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodType>("this-month");

  const { data: statisticsData } = useGetStatisticsQuery();

  const [statistics, setStatistics] = useState(
    statisticsData?.data?.statistics
  );

  useEffect(() => {
    if (statisticsData?.data?.statistics) {
      setStatistics(statisticsData.data.statistics);
    }
  }, [statisticsData]);

  const getStatValue = (
    category: keyof StatisticsType,
    period: keyof GlobalDashboard
  ) => {
    return statistics?.[category]?.[period];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Select
          value={selectedPeriod}
          onValueChange={(value: PeriodType) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${getStatValue(
            "revenueStatistics",
            periodMap[selectedPeriod]
          )}`}
          description="Revenue based on selected period"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Projects"
          value={`${getStatValue(
            "projectStatistics",
            periodMap[selectedPeriod]
          )}`}
          description="Projects in selected period"
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Freelancers"
          value={`${getStatValue(
            "freelancerStatistics",
            periodMap[selectedPeriod]
          )}`}
          description="Freelancers in selected period"
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard
          title="Pending Contracts"
          value={`${getStatValue(
            "contractStatistics",
            periodMap[selectedPeriod]
          )}`}
          description="Contracts in selected period"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest project updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectData.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
