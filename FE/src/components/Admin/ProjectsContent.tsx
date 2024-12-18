import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types";

interface Props {
  projectData: Project[];
}

const ProjectsContent: React.FC<Props> = ({ projectData, }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Project Management</h2>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>All Projects</CardTitle>
        <CardDescription>Manage and track all projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ProjectsContent;
