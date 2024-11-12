import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Star,
    Mail,
    Phone,
  } from "lucide-react";
import { ProjectType } from "@/types/ProjectType";
import React from "react";

interface ProjectApplicantsDialogProps {
  onSelectProject: (project: number | null) => void;
  selectedProject: number | null;
  projects: ProjectType[] | undefined;
  onStatusColor: (status: string) => string;
  onAccept: (applyId: number) => void;
  onReject: (applyId: number) => void;
  formatDate: (dateString: string) => string;
}

const ProjectApplicantsDialog: React.FC<ProjectApplicantsDialogProps> = ({
  onSelectProject,
  selectedProject,
  projects,
  onStatusColor,
  onAccept,
  onReject,
  formatDate,
}) => {
  return (
    <Dialog open onOpenChange={() => onSelectProject(null)}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Applicants</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {projects
            ?.find((p) => p.projectId === selectedProject)
            ?.applies?.map((apply) => (
              <Card
                key={apply.applyId}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                      {apply.freelancer.username?.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {apply.freelancer.username}
                          </h3>
                          <p className="text-gray-600">abc</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={onStatusColor(apply.status)}>
                            {apply.status}
                          </Badge>
                          {apply.status === "Pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => onAccept(apply.applyId)}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onReject(apply.applyId)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Applied: {formatDate(apply.createAt)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Star className="w-4 h-4" />
                          Rating: {apply.freelancer.userProfile.rating}
                          /5
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {apply.freelancer.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {apply.freelancer.userProfile.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {!projects?.find((p) => p.projectId === selectedProject)?.applies
            ?.length && (
            <div className="text-center py-8 text-gray-500">
              <p>No applicants yet for this project.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectApplicantsDialog;
