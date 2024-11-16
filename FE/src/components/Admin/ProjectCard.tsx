import { Card, CardContent } from "../ui/card";

interface ProjectCardProps {
  title: string;
  budget: string;
  progress: number;
  status: "Active" | "Completed" | "Processing";
  dueDate: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  budget,
  progress,
  status,
  dueDate,
}) => {
  const statusColors = {
    Active: "bg-blue-500",
    Completed: "bg-green-500",
    Processing: "bg-yellow-500",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">Due: {dueDate}</p>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs text-white ${statusColors[status]}`}
          >
            {status}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Budget</span>
            <span className="font-medium">{budget}</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {progress}% complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
