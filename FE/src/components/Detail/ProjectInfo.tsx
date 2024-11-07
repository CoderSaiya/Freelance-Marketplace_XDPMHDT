import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faGavel, faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";

const ProjectInfo: React.FC = () => (
  <div className="mb-6">
    <p className="text-sm text-gray-500">Mã dự án: 38751624</p>
    <h3 className="font-semibold text-lg mt-4">Về dự án</h3>
    <div className="flex items-center gap-6 mt-2 text-gray-500 text-sm">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
        <p>9 đề xuất</p>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faGavel} className="mr-1" />
        <p>Mở đấu giá</p>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
        <p>Dự án từ xa</p>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faClock} className="mr-1" />
        <p>Hoạt động 1 ngày trước</p>
      </div>
    </div>
  </div>
);

export default ProjectInfo;
