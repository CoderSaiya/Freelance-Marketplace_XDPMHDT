import React, { useState } from "react";
import {
  useAcceptApplyMutation,
  useCheckReviewedMutation,
  useContractByProjectIdMutation,
  useCreateReviewMutation,
  useFinishedProjectMutation,
  useGetApplyByFreelancerQuery,
  useProjectByClientQuery,
  useUpdateURLFileContractMutation,
} from "../../../apis/graphqlApi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Briefcase, Download, FileCheck, FileX, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplyType } from "@/types/ApplyType";
import { notification } from "antd";
import { useUploadImgMutation } from "@/apis/restfulApi";
import { ProjectType } from "@/types/ProjectType";
import ProjectCard from "../ProjectCard";
import ProjectApplicantsDialog from "../ProjectApplicantsDialog";
import UploadDialog from "../UploadDialog";
import ApplicantCard from "../ApplicantCard";
import RatingDialog from "../RatingDialog";
import { ReviewInput } from "@/types/ReviewType";

const ProjectManagementTab: React.FC<{ userId: number; role: string }> = ({
  userId,
  role,
}) => {
  const [currentProject, setCurrentProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedApply, setSelectedApply] = useState<ApplyType | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [projectStatusDialog, setProjectStatusDialog] = useState(false);
  const [fileStatus, setFileStatus] = useState<{
    content: React.ReactNode | null;
    loading: boolean;
  }>({
    content: null,
    loading: false,
  });
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [userToRate, setUserToRate] = useState<{
    name: string;
    role: string;
    projectTitle: string;
    userId: number;
  } | null>(null);

  const { data: freelancerData, isLoading: isFreelancerLoading } =
    useGetApplyByFreelancerQuery(userId);
  const {
    data: clientData,
    isLoading: isClientLoading,
    refetch,
  } = useProjectByClientQuery(userId);

  const [contractByProjectId] = useContractByProjectIdMutation();

  const [acceptApply] = useAcceptApplyMutation();
  const [uploadFileZip] = useUploadImgMutation();
  const [updateURLFileContract] = useUpdateURLFileContractMutation();
  const [finishProject] = useFinishedProjectMutation();
  const [createReview] = useCreateReviewMutation();
  const [checkReviewed] = useCheckReviewedMutation();

  const applies = freelancerData?.data.applyByFreelancerId;
  const projects = clientData?.data.projectByClient;

  const handleProjectClick = async (project: ProjectType) => {
    setCurrentProject(project.projectId);
    if (project.status.toLowerCase() === "finished") {
      const response = await checkReviewed({
        projectId: project.projectId,
        userId: userId,
      }).unwrap();

      if (response.data.checkReviewed) {
        notification.info({
          message: "you have rated !!",
        });
        return;
      }

      const acceptedApply = project.applies?.find(
        (apply: ApplyType) => apply.status === "Accepted"
      );

      if (acceptedApply) {
        if (role === "Client") {
          setUserToRate({
            name: acceptedApply.freelancer.username,
            role: "Freelancer",
            projectTitle: project.projectName,
            userId: acceptedApply.freelancer.id,
          });
        } else {
          setUserToRate({
            name: String(project.users?.username),
            role: "Client",
            projectTitle: project.projectName,
            userId: Number(project.users?.id),
          });
        }
        setRatingDialogOpen(true);
      }
    } else if (project.status.toLowerCase() === "processing") {
      setSelectedProject(project.projectId);
      setProjectStatusDialog(true);
      await fetchFileStatus(project);
    } else {
      setSelectedProject(project.projectId);
    }
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    if (!userToRate) return;

    try {
      //call graphql to submit
      console.log(selectedApply);
      console.log(currentProject);
      const response =
        role === "Client"
          ? await contractByProjectId(Number(currentProject)).unwrap()
          : await contractByProjectId(
              Number(selectedApply?.projectId)
            ).unwrap();

      const formData = new FormData();
      // formData.append("userId",userId.toString());
      // formData.append("contractId",response?.data.contractByProjectId.contractId.toString());
      // formData.append("rating",rating.toString());
      // formData.append("feedback",review);

      const rate = {
        userId: userId,
        contractId: response?.data.contractByProjectId.contractId,
        rating: rating,
        feedback: review,
      };
      console.log(rate);

      await createReview({ review: rate }).unwrap();

      notification.success({
        message: "Rating Submitted",
        description: "Thank you for your feedback!",
      });

      setSelectedProject(null);
      refetch();
    } catch (error) {
      notification.error({
        message: "Failed to submit rating: " + error,
        description: "Please try again later.",
      });
    }
  };

  const handleFinishProject = async (contractId: number) => {
    try {
      const { data } = await finishProject(contractId).unwrap();

      if (data.finishedProject) {
        notification.success({
          message: "Successs!!",
        });

        setSelectedProject(null);
        refetch();
      } else {
        notification.error({
          message: "Not found contract or project",
        });
      }

      // setFileStatus(false);
    } catch (error) {
      notification.error({
        message: "Failed: " + error,
      });
    }
  };

  const fetchFileStatus = async (project: ProjectType) => {
    setFileStatus({ content: null, loading: true });
    try {
      const response = await contractByProjectId(
        Number(project.projectId)
      ).unwrap();
      const acceptedApply = project.applies?.find(
        (apply: ApplyType) => apply.status === "Accepted"
      );

      let content: React.ReactNode;
      console.log(response);

      if (!acceptedApply) {
        content = (
          <div className="text-center py-8">
            <FileX className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              No accepted freelancer for this project yet.
            </p>
          </div>
        );
      } else if (!response.data.contractByProjectId.filePath) {
        content = (
          <div className="text-center py-8">
            <FileX className="w-12 h-12 mx-auto text-red-400 mb-4" />
            <p className="text-gray-600">
              The freelancer hasn't uploaded the project files yet.
            </p>
          </div>
        );
      } else {
        content = (
          <div className="text-center py-8">
            <FileCheck className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <p className="text-green-600 mb-4">
              Project files have been uploaded!
            </p>
            <Button
              onClick={() =>
                window.open(
                  response.data.contractByProjectId.filePath,
                  "_blank"
                )
              }
              className="gap-2 mr-2"
            >
              <Download className="w-4 h-4" />
              Download Project Files
            </Button>

            <Button
              className="gap-2 bg-green-500"
              onClick={() =>
                handleFinishProject(
                  response.data.contractByProjectId.contractId
                )
              }
            >
              <Check className="w-5 h-5" />
              Complete
            </Button>
          </div>
        );
      }

      setFileStatus({ content, loading: false });
    } catch (error) {
      setFileStatus({
        content: (
          <div className="text-center py-8">
            <FileX className="w-12 h-12 mx-auto text-red-400 mb-4" />
            <p className="text-red-600">Error loading file status</p>
          </div>
        ),
        loading: false,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "accepted":
        return "bg-green-200 text-green-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "finished":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAcceptApply = async (applyId: number) => {
    try {
      // accpet apply
      await acceptApply(applyId).unwrap();
      refetch();
      notification.success({
        message: "Sucess!!",
      });
    } catch (error) {
      console.error("Failed to accept application:", error);
    }
  };

  const handleRejectApply = async (applyId: number) => {
    try {
      // reject apply
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed"
      ) {
        setSelectedFile(file);
      } else {
        notification.error({
          message: "Invalid file type",
          description: "Please upload a ZIP file only",
        });
      }
    }
  };

  if (isFreelancerLoading || isClientLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  const handleUploadSubmit = async () => {
    if (!selectedFile || !selectedApply) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("projectId", selectedApply.projectId.toString());
      formData.append("userId", userId.toString());
      formData.append("mimeType", "application/zip");

      const uploadResponse = await uploadFileZip(formData).unwrap();
      console.log(uploadResponse);

      const imageUrl = uploadResponse?.imageUrl;

      console.log(imageUrl);

      if (imageUrl !== null && imageUrl !== undefined) {
        await updateURLFileContract({
          freelanceId: Number(userId),
          projectId: selectedApply.projectId,
          url: imageUrl,
        }).unwrap();

        notification.success({
          message: "Success",
          description: "Project files uploaded successfully",
        });
      }
      setUploadDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      notification.error({
        message: "Upload failed: " + error,
        description: "Failed to upload project files",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCardClick = (apply: ApplyType) => {
    if (role !== "Client" && apply.status === "Accepted") {
      setSelectedApply(apply);
      if (apply.project.status.toLowerCase() === "finished") {
        setUserToRate({
          name: String(apply.project.users?.username),
          role: "Client",
          projectTitle: apply.project.projectName,
          userId: Number(apply.project.users?.id),
        });

        setRatingDialogOpen(true);
        console.log(ratingDialogOpen);
        return;
      }
      setUploadDialogOpen(true);
    }
  };

  if (isFreelancerLoading || isClientLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        {[1, 2, 3].map((i) => 1)}
      </div>
    );
  }

  const calculateDuration = (
    deadline: string,
    createAt: string
  ): number | string => {
    const deadlineDate = new Date(deadline);
    const createAtDate = new Date(createAt);

    if (isNaN(deadlineDate.getTime()) || isNaN(createAtDate.getTime())) {
      return "Invalid date format";
    }

    return Math.round(
      (deadlineDate.getTime() - createAtDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div>
      {role === "Client" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Posted Projects</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Total Projects: {projects?.length || 0}
            </Badge>
          </div>

          <div className="grid gap-6">
            {projects?.map((project) => (
              <ProjectCard
                project={project}
                onClick={handleProjectClick}
                onStatusColor={getProjectStatusColor}
                formatDate={formatDate}
                calculateDuration={calculateDuration}
              />
            ))}

            {projects?.length === 0 && (
              <Card className="p-8 text-center">
                <div className="text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No Projects Posted Yet</p>
                  <p className="mt-2">
                    Start posting your first project and find talented
                    freelancers!
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Applicants Dialog */}

          {projectStatusDialog && selectedProject && (
            <Dialog
              open
              onOpenChange={() => {
                setProjectStatusDialog(false);
                setSelectedProject(null);
              }}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Project Files Status</DialogTitle>
                </DialogHeader>
                {fileStatus.loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  fileStatus.content
                )}
              </DialogContent>
            </Dialog>
          )}

          {selectedProject && !projectStatusDialog && (
            <ProjectApplicantsDialog
              onSelectProject={setSelectedProject}
              selectedProject={selectedProject}
              projects={projects}
              onStatusColor={getStatusColor}
              onAccept={handleAcceptApply}
              onReject={handleRejectApply}
              formatDate={formatDate}
            />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Applied Projects</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Total Applications: {applies?.length || 0}
            </Badge>
          </div>

          <div className="grid gap-6">
            {applies?.map((apply: ApplyType) => (
              <ApplicantCard
                apply={apply}
                onClick={handleCardClick}
                statusColor={getStatusColor}
                formatDate={formatDate}
              />
            ))}

            {applies?.length === 0 && (
              <Card className="p-8 text-center">
                <div className="text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    You haven't applied to any projects yet.
                  </p>
                  <p className="mt-2">
                    Start exploring projects and submit your proposals!
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <UploadDialog
        onUploadOpen={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
        onFileChange={handleFileChange}
        selectedFile={selectedFile}
        onSubmit={handleUploadSubmit}
        isUploading={isUploading}
      />

      {userToRate && (
        <RatingDialog
          isOpen={ratingDialogOpen}
          onClose={() => {
            setRatingDialogOpen(false);
            setUserToRate(null);
          }}
          onSubmit={handleRatingSubmit}
          userToRate={userToRate}
        />
      )}
    </div>
  );
};

export default ProjectManagementTab;
