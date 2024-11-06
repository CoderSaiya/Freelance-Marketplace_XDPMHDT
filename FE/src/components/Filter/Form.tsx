import React, { useState } from "react";
import { useGetProjectQuery } from "../../apis/graphqlApi";
import ProjectCard from "./ProjectCard";
import FilterColumn from "./FilterColumn"; // Import the new component

const calculateDeadline = (days: number): string => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD
};

interface Filters {
  categories: string[];
  priceRange: number[];
  deliveryTime: string;
}

const FilterPage = () => {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 1000],
    deliveryTime: "Anytime",
  });

  const { data, error, isLoading } = useGetProjectQuery();

  const projects =
    data?.data.projects.map((project, index) => ({
      id: project.projectId || index,
      name: project.projectName,
      price: project.budget,
      description: project.projectDescription,
      owner: {
        name: project.projectName,
        avatar: project.imageUrls[0], // Use the first image as avatar
      },
      category: project.category.categoryName,
      deadline: calculateDeadline(15), // Adjust as needed
    })) || [];

  const handleFilterChange = (filter: keyof Filters, value: string | number[]): void => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }));
  };

  const handleCategoryChange = (category: string): void => {
    const currentCategories = filters.categories;
    if (currentCategories.includes(category)) {
      setFilters({
        ...filters,
        categories: currentCategories.filter((cat) => cat !== category),
      });
    } else {
      setFilters({
        ...filters,
        categories: [...currentCategories, category],
      });
    }
  };

  const getDaysFromDeliveryTime = (): number => {
    switch (filters.deliveryTime) {
      case "Up to 7 days":
        return 7;
      case "Up to 14 days":
        return 14;
      case "Up to 1 month":
        return 30;
      default:
        return 1000;
    }
  };

  const filterByDeadline = (projectDeadline: string): boolean => {
    const daysFilter = getDaysFromDeliveryTime();
    const currentDate = new Date();
    const deadlineDate = new Date(projectDeadline);

    const diffTime = Math.abs(deadlineDate.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= daysFilter;
  };

  const filteredProjects = projects.filter((project) => {
    const inPriceRange =
      project.price >= filters.priceRange[0] &&
      project.price <= filters.priceRange[1];
    const matchesDeadline = filterByDeadline(project.deadline);
    const matchesCategory =
      filters.categories.length > 0
        ? filters.categories.includes(project.category)
        : true;
    return inPriceRange && matchesDeadline && matchesCategory;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching projects</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex">
      {/* Filter Column */}
      <FilterColumn
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleCategoryChange={handleCategoryChange}
      />

      {/* Project List */}
      <div className="ml-[270px] w-full grid grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
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
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
