import React from "react";

interface ProjectDescriptionProps {
  description: string;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ description }) => (
  <div className="mb-6">
    <p className="text-justify">{description}</p>
  </div>
);

export default ProjectDescription;