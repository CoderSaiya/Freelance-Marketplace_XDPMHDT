import React from "react";
import { ProjectType } from "../../types/ProjectType";
import ProjectHeader from "./ProjectHeader";
import ProjectDescription from "./ProjectDescription";
import ProjectTags from "./ProjectTags";
import ProjectInfo from "./ProjectInfo";
import ApplyAndBenefits from "./ApplyAndBenefits";
import ApplierList from "./ApplierList";
import ClientInfo from "./ClientInfo";
import SimilarProjects from "./SimilarProjects";
import Breadcrumb from "../Public/Breadcrumb";

interface ProjectDetailPageProps extends ProjectType {
  refetch: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = (props) => {
  const tagsString = props.skillRequire;
  const tagsArray = tagsString.split(",").map((tag) => tag.trim());

  const breadcrumbItems = [
    { name: "Home", link: "/" },
    { name: "Projects", link: "/filter" },
    { name: props.projectName, link: "" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col md:flex-row gap-6">
      {/* Left Column */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:w-3/4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        <ProjectHeader
          projectName={props.projectName}
          budget={props.budget}
          status={props.status}
          createAt={props.createAt}
          deadline={props.deadline}
        />
        <ProjectDescription description={props.projectDescription} />
        <ProjectTags tags={tagsArray} />
        <ProjectInfo
          projectId={props.projectId}
          applies={props.applies}
          status={String(props.status)}
        />
        <ApplyAndBenefits
          clientId={Number(props.users?.id)}
          projectId={props.projectId}
          refechProject={props.refetch}
        />
        <ApplierList applies={props.applies} />
      </div>

      {/* Right Column */}
      <div className="md:w-1/4 space-y-6">
        <button className="bg-pink-500 text-white font-semibold w-full p-3 rounded-lg">
          Post a project like that
        </button>
        <ClientInfo
          username={String(props.users?.username)}
          createAt={String(props.users?.createAt)}
          rating={Number(props.users?.userProfile.rating)}
        />
        <SimilarProjects projectId={Number(props.projectId)} />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
