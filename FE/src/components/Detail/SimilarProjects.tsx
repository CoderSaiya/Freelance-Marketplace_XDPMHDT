import { useGetSimilorProjectsQuery } from "@/apis/graphqlApi";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  projectId: number;
}

const SimilarProjects: React.FC<Props> = ({ projectId }) => {
  const { data } = useGetSimilorProjectsQuery(projectId);
  const projects = data?.data.getSimilarProjects;

  const navigate = useNavigate();

  const handleToggle = (id: number) => {
    navigate(`/detail/${id}`);
  };

  const formatDate = (date: string) => {
    const createAtDate = new Date(date);
    return formatDistanceToNow(createAtDate, {
      addSuffix: true,
    });
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="font-semibold text-lg mb-4">Similar projects</h3>
      <ul className="space-y-4">
        {projects?.map((project) => (
          <li>
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={() => handleToggle(Number(project.projectId))}
            >
              {project.projectName} - ${project.budget} USD
            </a>
            <p className="text-gray-500 text-sm">
              Posted {formatDate(project.createAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimilarProjects;
