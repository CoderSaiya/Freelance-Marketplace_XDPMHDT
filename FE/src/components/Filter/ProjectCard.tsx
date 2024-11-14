import { RootState } from "@/store/store";
import { notification } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, DollarSign, Tag } from "lucide-react";
import { Button } from "../ui/button";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    price: number;
    description: string;
    owner: {
      name: string;
      avatar: string;
    };
    category: string;
    deadline: string;
  };
  truncateDescription: (description: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  truncateDescription,
}) => {
  const role = useSelector((state: RootState) => state.auth.role);

  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (role === "Freelancer") {
      navigate(`/detail/${project.id}`);
    } else {
      notification.warning({
        message: "You are client!! cannot enter here",
      });
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-3">
          <img
            src={project.owner.avatar}
            alt={project.owner.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{project.owner.name}</p>
          </div>
        </div>
        <img
          src={project.owner.avatar}
          alt={project.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <CardTitle className="line-clamp-2">{project.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {project.category}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {project.deadline}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {project.price}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateDescription(project.description)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleApplyClick}>
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
