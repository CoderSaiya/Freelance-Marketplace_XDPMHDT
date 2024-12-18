import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useGetContractsQuery } from "@/apis/graphqlApi";

const ContractContent: React.FC = () => {
  const { data } = useGetContractsQuery();

  const contracts = data?.data?.contracts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contract Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Contract
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Contracts</CardTitle>
          <CardDescription>Manage ongoing contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts?.length ? (
                contracts.map((contract) => (
                  <TableRow key={contract.contractId}>
                    <TableCell className="font-medium">
                      {contract.contractId}
                    </TableCell>
                    <TableCell>{contract.project.projectName}</TableCell>
                    <TableCell>{contract.freelancer.username}</TableCell>
                    <TableCell>{contract.client.username}</TableCell>
                    <TableCell>{contract.paymentAmount}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          contract.status === "Pending"
                            ? "bg-green-100 text-green-800"
                            : contract.status === "Completed"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-gray-800"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No contracts available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Templates</CardTitle>
          <CardDescription>Manage contract templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Standard Contract",
                description: "Basic contract template for general projects",
                lastUpdated: "2024-03-15",
              },
              {
                title: "Fixed Price Contract",
                description: "Template for fixed-price projects",
                lastUpdated: "2024-03-10",
              },
              {
                title: "Hourly Contract",
                description: "Template for time-based projects",
                lastUpdated: "2024-03-05",
              },
            ].map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {template.lastUpdated}
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    Edit Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractContent;
