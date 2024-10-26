import React from "react";
import { useQuery } from "@apollo/client";
import ProjectCard from "./ProjectCard";
import { GET_PROJECTS } from "../../apis/graphqlQueries";

const Propose: React.FC = () => {
  const projects = [
    {
      image: "https://example.com/florence.jpg",
      location: "Florence",
      homesCount: 200,
    },
    {
      image: "https://example.com/malta.jpg",
      location: "Malta",
      homesCount: 200,
    },
    {
      image: "https://example.com/stockholm.jpg",
      location: "Stockholm",
      homesCount: 200,
    },
    {
      image: "https://example.com/amsterdam.jpg",
      location: "Amsterdam",
      homesCount: 200,
    },
  ];
  const { loading, error, data } = useQuery(GET_PROJECTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Inspiration for your next trip
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {projects.map((location, index) => (
          <ProjectCard
            key={index}
            image={location.image}
            location={location.location}
            homesCount={location.homesCount}
          />
        ))}
      </div>
    </div>
  );
};

export default Propose;
