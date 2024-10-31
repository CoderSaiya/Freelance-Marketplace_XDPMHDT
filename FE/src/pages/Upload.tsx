import React, { useState } from "react";
import FormWithFloatingLabels from "../components/Upload/FormWithFloatingLabels";
import { useCreateProjectMutation } from "../apis/graphqlApi";
import { useUploadImgMutation } from "../apis/restfulApi";
import { notification } from "antd";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formValues, setFormValues] = useState({
    projectName: "",
    projectDescription: "",
    budget: 0.0,
    deadline: "",
    skillRequire: "",
    status: "",
    userId: 0,
    categoryId: 0,
  });

  const [createProject] = useCreateProjectMutation();
  const [uploadImg] = useUploadImgMutation();

  const token = localStorage.getItem("access_token")?.toString();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = (file: File) => {
    setIsUploading(true);
    let progressInterval: NodeJS.Timeout;

    // Simulate upload progress
    progressInterval = setInterval(() => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => {
      if (name === "budget" || name === "categoryId") {
        return {
          ...prevValues,
          [name]: parseFloat(value),
        };
      }

      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(file);
    if (
      !formValues.projectName ||
      !formValues.budget ||
      !formValues.deadline ||
      !formValues.skillRequire ||
      !formValues.status ||
      !formValues.categoryId
    ) {
      notification.error({
        message: "Please fill in all required fields.",
      });
      return;
    }

    const formDataImg = new FormData();

    try {
      if (file) {
        formDataImg.append("file", file);

        const decoded = parseJwt(token);
        const userId =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        const formattedData = {
          projectName: formValues.projectName,
          projectDescription: formValues.projectDescription || null,
          budget: formValues.budget,
          deadline: formValues.deadline,
          skillRequire: formValues.skillRequire,
          status: formValues.status,
          userId: +userId,
          categoryId: formValues.categoryId,
        };

        const createResponse = await createProject({
          project: formattedData,
        }).unwrap();

        console.log(createResponse);

        if (
          createResponse.data.createProject.projectId !== null ||
          createResponse.data.createProject.projectId !== undefined
        ) {
          formDataImg.append("userId", userId);
          formDataImg.append(
            "projectId",
            createResponse.data.createProject.projectId.toString()
          );
          await uploadImg(formDataImg).unwrap();
        } else {
          console.error("projectId is missing in the response");
        }
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  return (
    <div className="flex flex-row justify-center w-full p-20">
      {/* Image Upload Section */}
      <div className="flex flex-col items-center border-dashed border-2 border-gray-300 p-6 rounded-lg hover:border-blue-500 focus:border-blue-500 transition-all mb-auto w-full max-w-md mr-4">
        {!file && (
          <label className="flex flex-col items-center cursor-pointer">
            <svg
              className="w-12 h-12 mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V8a4 4 0 018 0v8m4 4H5a2 2 0 01-2-2V8a2 2 0 012-2h3.5m9.5 0H19a2 2 0 012 2v10a2 2 0 01-2 2h-4M12 11v6m0 0l3-3m-3 3l-3-3"
              />
            </svg>
            <span className="text-sm text-gray-400">
              Upload a file or drag and drop
            </span>
            <span className="text-xs text-gray-400">
              PNG, JPG, GIF up to 10MB
            </span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        )}

        {/* Upload Progress Section */}
        {isUploading && (
          <div className="w-full mt-4 flex flex-col items-center">
            <div className="flex justify-between text-xs mb-2 w-full">
              <span>{file?.name}</span>
              <span>{`${progress}%`}</span>
            </div>
            <div className="relative w-full h-2 bg-gray-300 rounded">
              <div
                className="absolute top-0 left-0 h-full bg-blue-600 rounded transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Complete Section */}
        {!isUploading && file && progress === 100 && (
          <div className="w-full flex justify-between items-center mt-4">
            <span>{file.name}</span>
            <div className="flex space-x-4">
              <button className="text-blue-600">Download</button>
              <button
                className="text-red-600"
                onClick={() => {
                  setFile(null);
                  setProgress(0);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md">
        <FormWithFloatingLabels
          projectName={formValues.projectName}
          projectDescription={formValues.projectDescription}
          budget={formValues.budget.toString()}
          deadline={formValues.deadline}
          skillRequire={formValues.skillRequire}
          status={formValues.status}
          categoryId={formValues.categoryId}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />{" "}
        {/* Button Group, aligned to the right */}
        <div className="flex justify-end space-x-4 mt-4">
          <button className="bg-gray-100 text-black px-4 py-2 rounded-md shadow">
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
