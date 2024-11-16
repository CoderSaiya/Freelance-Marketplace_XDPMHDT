import React, { useState, useMemo } from "react";
import { Plus, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUsersQuery } from "@/apis/graphqlApi";
import { User } from "@/types/UserType";

const UsersContent = () => {
  const { data } = useGetUsersQuery();
  const userData: User[] | undefined = data?.data?.users;

  const [expandedFreelancers, setExpandedFreelancers] = useState<number[]>([]);
  const [expandedClients, setExpandedClients] = useState<number[]>([]);
  const [sortField, setSortField] = useState<keyof User | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [freelancerPage, setFreelancerPage] = useState(1);
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 2;

  const freelancers = useMemo(
    () => userData?.filter((user) => user.role === "Freelancer") || [],
    [userData]
  );
  const clients = useMemo(
    () => userData?.filter((user) => user.role === "Client") || [],
    [userData]
  );

  const sortedData = (data: User[]) => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (!aValue || !bValue) return 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  const paginatedData = (data: User[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const sortedFreelancers = useMemo(
    () => paginatedData(sortedData(freelancers), freelancerPage),
    [freelancers, sortField, sortDirection, freelancerPage]
  );
  const sortedClients = useMemo(
    () => paginatedData(sortedData(clients), clientPage),
    [clients, sortField, sortDirection, clientPage]
  );

  const toggleExpansion = (
    index: number,
    expandedList: number[],
    setExpandedList: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setExpandedList((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: keyof User | "earning";
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => {
        if (sortField === field) {
          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
          setSortField(field);
          setSortDirection("asc");
        }
      }}
    >
      <div className="flex items-center">
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    </TableHead>
  );

  const renderTable = (
    title: string,
    description: string,
    data: User[],
    sortedData: User[],
    expandedList: number[],
    setExpandedList: React.Dispatch<React.SetStateAction<number[]>>,
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number,
    isClientTable: boolean
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <SortableHeader field="username">Name</SortableHeader>
              <SortableHeader field="role">Role</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="projects">Projects</SortableHeader>
              <SortableHeader field="earning">
                {isClientTable ? "Expenses" : "Earnings"}{" "}
              </SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((user, index) => (
              <React.Fragment key={user.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() =>
                    toggleExpansion(index, expandedList, setExpandedList)
                  }
                >
                  <TableCell>
                    {expandedList.includes(index) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.projects?.length || 0}</TableCell>
                  <TableCell>{user.earning || 0}</TableCell>
                </TableRow>
                {expandedList.includes(index) && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-gray-50">
                      <div className="p-4">
                        <h4 className="font-medium mb-2">Additional Details</h4>
                        <p>Email: {user.email || "N/A"}</p>
                        <p>Phone: {user.userProfile?.phone || "N/A"}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      {renderTable(
        "Freelancers",
        "Manage your freelancer team",
        freelancers,
        sortedFreelancers,
        expandedFreelancers,
        setExpandedFreelancers,
        freelancerPage,
        setFreelancerPage,
        Math.ceil(freelancers.length / itemsPerPage) || 1,
        false
      )}
      {renderTable(
        "Clients",
        "Manage your client relationships",
        clients,
        sortedClients,
        expandedClients,
        setExpandedClients,
        clientPage,
        setClientPage,
        Math.ceil(clients.length / itemsPerPage) || 1,
        true
      )}
    </div>
  );
};

export default UsersContent;
