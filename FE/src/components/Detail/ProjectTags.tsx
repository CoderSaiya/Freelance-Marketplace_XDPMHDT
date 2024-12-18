import React from "react";

interface ProjectTagsProps {
  tags: string[];
}

const ProjectTags: React.FC<ProjectTagsProps> = ({ tags }) => (
  <div className="flex gap-2 mb-4">
    {tags.map((tag, index) => (
      <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">{tag}</span>
    ))}
  </div>
);

export default ProjectTags;
