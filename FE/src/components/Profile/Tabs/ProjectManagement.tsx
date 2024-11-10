import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useAcceptApplyMutation,
  useContractByProjectIdMutation,
  useGetApplyByFreelancerQuery,
  useProjectByClientQuery,
  useUpdateURLFileContractMutation,
} from "../../../apis/graphqlApi";
import { RootState } from "../../../store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle,
  XCircle,
  Users,
  Star,
  Mail,
  Phone,
  Upload,
  Download,
  FileCheck,
  FileX,
  Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplyType } from "@/types/ApplyType";
import { notification } from "antd";
import { Label } from "@/components/ui/label";
import { useUploadImgMutation } from "@/apis/restfulApi";
import { ProjectType } from "@/types/ProjectType";

const ProjectManagementTab: React.FC<{ role: string }> = ({ role }) => {
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

  const userId = useSelector((state: RootState) => state.auth.userId);
  const { data: freelancerData, isLoading: isFreelancerLoading } =
    useGetApplyByFreelancerQuery(Number(userId));
  const {
    data: clientData,
    isLoading: isClientLoading,
    refetch,
  } = useProjectByClientQuery(Number(userId));
  const [contractByProjectId] = useContractByProjectIdMutation();

  const [acceptApply] = useAcceptApplyMutation();
  const [uploadFileZip] = useUploadImgMutation();
  const [updateURLFileContract] = useUpdateURLFileContractMutation();

  const applies = freelancerData?.data.applyByFreelancerId;
  const projects = clientData?.data.projectByClient;

  const handleProjectClick = async (project: ProjectType) => {
    if (project.status.toLowerCase() === "processing") {
      setSelectedProject(project.projectId);
      setProjectStatusDialog(true);
      await fetchFileStatus(project);
    } else {
      setSelectedProject(project.projectId);
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
            
            <Button className="gap-2 bg-green-500">
              <Check className="w-5 h-5"/>
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
      case "open":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
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
      setUploadDialogOpen(true);
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
              <Card
                key={project.projectId}
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {project.projectName}
                      </CardTitle>
                      <Badge className={getProjectStatusColor(project.status)}>
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
                    <p className="text-gray-700">
                      {project.projectDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      Posted: {formatDate(project.createAt)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      Duration:{" "}
                      {calculateDuration(
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
            <Dialog open onOpenChange={() => setSelectedProject(null)}>
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
                                  <Badge
                                    className={getStatusColor(apply.status)}
                                  >
                                    {apply.status}
                                  </Badge>
                                  {apply.status === "Pending" && (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600"
                                        onClick={() =>
                                          handleAcceptApply(apply.applyId)
                                        }
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          handleRejectApply(apply.applyId)
                                        }
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

                  {!projects?.find((p) => p.projectId === selectedProject)
                    ?.applies?.length && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No applicants yet for this project.</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
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
              <Card
                key={apply.applyId}
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCardClick(apply)}
              >
                {/* Existing card content */}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {apply.project.projectName}
                      </CardTitle>
                      <Badge className={getStatusColor(apply.status)}>
                        {apply.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center gap-2 text-green-600 font-semibold">
                        <DollarSign className="w-5 h-5" />
                        {apply.project.budget}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      Applied on: {formatDate(apply.createAt)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      Duration: {apply.duration} days
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-5 h-5" />
                      Category: {apply.project.category?.categoryName}
                    </div>
                    <div className="flex items-center gap-2">
                      {apply.status === "Accepted" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : apply.status === "Rejected" ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                      {apply.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Project Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="project-file">Project ZIP File</Label>
              <div className="flex items-center gap-2">
                <input
                  id="project-file"
                  type="file"
                  accept=".zip"
                  className="w-full"
                  onChange={handleFileChange}
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-gray-500">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUploadSubmit}
              disabled={!selectedFile || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagementTab;
