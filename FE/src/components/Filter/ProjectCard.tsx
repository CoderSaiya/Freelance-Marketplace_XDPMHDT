import React from 'react';

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    price: number;
    description: string;
    owner: {
      name: string;
      avatar: string;
    };
    category: string;
    deadline: string;
  };
  truncateDescription: (description: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, truncateDescription }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between"
      style={{ minHeight: '500px', maxHeight: '500px' }}
    >
      <div className="flex items-center mb-4">
        <img src={project.owner.avatar} alt={project.owner.name} className="w-10 h-10 rounded-full mr-2" />
        <p>{project.owner.name}</p>
      </div>
      <img src="https://via.placeholder.com/150" alt={project.name} className="mb-4 rounded-lg object-cover h-40 w-full" />
      <h3 className="font-semibold text-lg">{project.name}</h3>
      <p className="text-gray-500">Category: {project.category}</p>
      <p className="text-gray-500">Deadline: {project.deadline}</p>
      <p className="text-gray-700 truncate" style={{ maxHeight: '40px', overflow: 'hidden' }}>
        {truncateDescription(project.description)}
      </p>
      <p className="text-blue-700 font-semibold">${project.price}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 mt-4">Apply</button>
    </div>
  );
};

export default ProjectCard;
