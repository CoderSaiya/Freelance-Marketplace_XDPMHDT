import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Revenue } from "@/types";

interface Props {
  revenueData: Revenue[];
}

const AnalyticsContent: React.FC<Props> = ({ revenueData }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <Select defaultValue="this-month">
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="this-quarter">This Quarter</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Monthly revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New user registration trend</CardDescription>
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
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Statistics</CardTitle>
          <CardDescription>Project completion and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Completed Projects</span>
              <span className="font-bold">75%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "75%" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="border rounded p-4 text-center">
                <div className="text-2xl font-bold text-green-500">45</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="border rounded p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">15</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Freelancer Categories</CardTitle>
          <CardDescription>Distribution by skill category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Web Development</span>
              <span>40%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "40%" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Design</span>
              <span>25%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "25%" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Marketing</span>
              <span>20%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "20%" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Writing</span>
              <span>15%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "15%" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AnalyticsContent;
