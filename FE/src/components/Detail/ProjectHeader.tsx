import React from "react";

interface ProjectHeaderProps {
  projectName: string;
  budget: number;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectName, budget }) => (
  <div className="flex justify-between items-start border-b pb-4 mb-4">
    <div>
      <h1 className="text-2xl font-bold mb-1">{projectName}</h1>
      <div className="flex items-center text-sm text-gray-500">
        <span className="bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full mr-2">Mở</span>
        <p>Đã đăng: 1 ngày trước • Kết thúc sau 6 ngày</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xl font-semibold text-green-500 mb-1">{budget} USD</p>
      <p className="text-gray-500 text-sm">Thanh toán khi giao hàng</p>
    </div>
  </div>
);

export default ProjectHeader;