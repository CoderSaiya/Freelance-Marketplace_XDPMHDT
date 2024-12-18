import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faGavel,
  faMapMarkerAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { ApplyType } from "@/types/ApplyType";

interface Props {
  projectId: number;
  applies: ApplyType[];
  status: string;
}

const ProjectInfo: React.FC<Props> = ({ projectId, applies, status }) => (
  <div className="mb-6">
    <p className="text-sm text-gray-500">ID: #{projectId}</p>
    <h3 className="font-semibold text-lg mt-4">About project</h3>
    <div className="flex items-center gap-6 mt-2 text-gray-500 text-sm">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
        <p>{applies.length} Applies</p>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faGavel} className="mr-1" />
        <p>{status.toLowerCase() === "active" ? "Open" : "Closed"} apply</p>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
        <p>Remote</p>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faClock} className="mr-1" />
        <p>Activity 1 day ago</p>
      </div>
    </div>
  </div>
);

export default ProjectInfo;
