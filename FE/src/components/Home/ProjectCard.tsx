import React from "react";

interface ProjectCardProps {
  image: string;
  location: string;
  homesCount: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  location,
  homesCount,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={image} alt={location} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{location}</h3>
        <p className="text-gray-500">+{homesCount} homes</p>
      </div>
    </div>
  );
};

export default ProjectCard;
