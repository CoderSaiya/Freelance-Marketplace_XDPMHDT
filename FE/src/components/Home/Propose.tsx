import React from "react";
import ProjectCard from "./ProjectCard";
import { useGetProjectQuery } from "../../apis/graphqlApi";

const Propose: React.FC = () => {
  const { data, error, isLoading } = useGetProjectQuery();

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching projects</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Inspiration for your next trip
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {data?.data.projects?.map((project, index) => (
          <ProjectCard
            key={index}
            image={project.imageUrls[0]}
            location={project.projectDescription}
            homesCount={project.budget}
          />
        ))}
      </div>
    </div>
  );
};

export default Propose;
