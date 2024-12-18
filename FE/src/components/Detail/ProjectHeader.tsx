import React from "react";
import { formatDistanceToNow, differenceInCalendarDays } from "date-fns";

interface ProjectHeaderProps {
  projectName: string;
  budget: number;
  status: string;
  createAt: string;
  deadline: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  budget,
  status,
  createAt,
  deadline,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-200 text-yellow-800";
      case "active":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  console.log(createAt, deadline);

  const createAtDate = new Date(createAt);
  const deadlineDate = new Date(deadline);

  if (isNaN(createAtDate.getTime()) || isNaN(deadlineDate.getTime())) {
    return <p className="text-red-500">Invalid date format</p>;
  }

  const timeSinceCreated = formatDistanceToNow(createAtDate, {
    addSuffix: true,
  });
  const daysUntilDeadline = differenceInCalendarDays(deadlineDate, new Date());

  return (
    <div className="flex justify-between items-start border-b pb-4 mb-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">{projectName}</h1>
        <div className="flex items-center text-sm text-gray-500">
          <span
            className={`font-semibold px-2 py-1 rounded-full mr-2 ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
          <p>
            Posted: {timeSinceCreated} • End in {daysUntilDeadline}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-semibold text-green-500 mb-1">
          {budget} USD
        </p>
        <p className="text-gray-500 text-sm">
          Payment upon completion of project
        </p>
      </div>
    </div>
  );
};

export default ProjectHeader;
