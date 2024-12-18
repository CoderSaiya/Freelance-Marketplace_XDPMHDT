import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectType } from "@/types/ProjectType";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Briefcase, Users } from "lucide-react";

interface ProjectCardProps {
  project: ProjectType;
  onClick: (project: ProjectType) => void;
  onStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  calculateDuration: (deadline: string, createAt: string) => number | string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  onStatusColor,
  formatDate,
  calculateDuration,
}) => {
  return (
    <Card
      key={project.projectId}
      className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick(project)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">
              {project.projectName}
            </CardTitle>
            <Badge className={onStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
          <div className="flex gap-4">
            <p className="flex items-center gap-2 text-blue-600">
              <Users className="w-5 h-5" />
              {project.applies?.length || 0} Applicants
            </p>
            <p className="flex items-center gap-2 text-green-600 font-semibold">
              <DollarSign className="w-5 h-5" />
              {project.budget}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <p className="text-gray-700">{project.projectDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            Posted: {formatDate(project.createAt)}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            Duration: {calculateDuration(
              project.deadline,
              project.createAt
            )}{" "}
            days
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-5 h-5" />
            {project.category?.categoryName}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {project.skillRequire?.split(",").map((skill, index) => (
            <Badge key={index} variant="outline">
              {skill.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
