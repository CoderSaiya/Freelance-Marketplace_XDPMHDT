import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const SettingsContent: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Settings</h2>

    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage your platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue="Freelance Platform"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              defaultValue="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform Fee (%)</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              defaultValue="10"
            />
          </div>
          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email Notifications</span>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SMS Notifications</span>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">System Alerts</span>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Two-Factor Authentication
            </span>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Password Policy</span>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Session Management</span>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>Manage API access and keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value="••••••••••••••••"
                readOnly
              />
              <Button variant="outline">Copy</Button>
            </div>
          </div>
          <Button className="w-full">Generate New Key</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default SettingsContent;
