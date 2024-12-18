import React from "react";
import ProjectCard from "../Filter/ProjectCard";
import { useGetProjectQuery } from "../../apis/graphqlApi";

const Propose: React.FC = () => {
  const { data, error, isLoading } = useGetProjectQuery();

  const calculateDeadline = (days: number): string => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD
  };

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching projects</div>;

  const projects =
    data?.data?.projects?.map((project, index) => ({
      id: project.projectId || index,
      name: project.projectName || "No Title",
      price: project.budget || 0,
      description: project.projectDescription || "No Description",
      image: project.imageUrls?.[0] || "default-image-url.jpg",
      owner: {
        name: project.users?.username || "Unknown Owner",
        avatar: project.users?.userProfile?.avatar || "default-avatar.jpg",
      },
      category: project.category?.categoryName || "Uncategorized",
      categoryId: project.category?.categoryId || 0,
      deadline: calculateDeadline(15), // Adjust as needed
    })) || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Apply to the project you want
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            truncateDescription={(description: string) => {
              const maxLength = 60;
              return description.length > maxLength
                ? `${description.substring(0, maxLength)}...`
                : description;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Propose;
