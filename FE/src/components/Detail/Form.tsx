import React from "react";
import { ProjectType } from "../../types/ProjectType";
import ProjectHeader from "./ProjectHeader";
import ProjectDescription from "./ProjectDescription";
import ProjectTags from "./ProjectTags";
import ProjectInfo from "./ProjectInfo";
import BidAndBenefits from "./BidAndBenefits";
import ApplierList from "./ApplierList";
import ClientInfo from "./ClientInfo";
import SimilarProjects from "./SimilarProjects";

const ProjectDetailPage: React.FC<ProjectType> = (props) => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col md:flex-row gap-6">
      {/* Left Column */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:w-3/4">
        <ProjectHeader projectName={props.projectName} budget={props.budget} />
        <ProjectDescription description={props.projectDescription} />
        <ProjectTags tags={["Tài năng giọng nói", "Dịch vụ âm thanh", "Quảng cáo", "Sản xuất âm thanh", "Tiếp tục truyền thông xã hội"]} />
        <ProjectInfo />
        <BidAndBenefits />
        <ApplierList />
      </div>

      {/* Right Column */}
      <div className="md:w-1/4 space-y-6">
        <button className="bg-pink-500 text-white font-semibold w-full p-3 rounded-lg">
          Đăng một dự án như thế này
        </button>
        <ClientInfo />
        <SimilarProjects />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
