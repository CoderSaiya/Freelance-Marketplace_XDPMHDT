import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  useCreateProjectMutation,
  useGetCategoryQuery,
} from "../apis/graphqlApi";
import { useUploadImgMutation } from "../apis/restfulApi";
import ProjectImageUpload from "@/components/Upload/ProjectImageUpload";
import ProjectDetailsForm from "@/components/Upload/ProjectDetailsForm";
import { notification } from "antd";

const Upload = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  const { data } = useGetCategoryQuery();
  const categories = data?.data.categories || [];
  const [createProject] = useCreateProjectMutation();
  const [uploadImg] = useUploadImgMutation();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = (file: File) => {
    setIsUploading(true);
    let progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          return 100;
        }
        return oldProgress + 20;
      });
    }, 300);
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    const formDataImg = new FormData();
    const skillsString = skills.join(", ");

    try {
      if (file) {
        formDataImg.append("file", file);

        const formattedData = {
          ...formData,
          budget: parseFloat(formData.budget),
          categoryId: parseInt(formData.categoryId),
          skillRequire: skillsString,
          userId: +userId,
          status: "Active",
        };

        const createResponse = await createProject({
          project: formattedData,
        }).unwrap();

        if (createResponse.data.createProject.projectId) {
          formDataImg.append("userId", userId.toString());
          formDataImg.append(
            "projectId",
            createResponse.data.createProject.projectId.toString()
          );
          formDataImg.append("mimeType", "image/jpeg");
          await uploadImg(formDataImg).unwrap();
          setLoading(false);
          notification.success({
            message: "Successfully create project!!!",
          });
        }
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <ProjectImageUpload
            file={file}
            setFile={setFile}
            isUploading={isUploading}
            progress={progress}
            handleFileUpload={handleFileUpload}
          />
          <ProjectDetailsForm
            skills={skills}
            setSkills={setSkills}
            categories={categories}
            loading={loading}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;
