import React, { useEffect, useState } from "react";
import { useGetCategoryQuery, useGetProjectQuery } from "../../apis/graphqlApi";
import ProjectCard from "./ProjectCard";
import FilterColumn from "./FilterColumn";
import { Card } from "../ui/card";

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

  const { data: categoryData } = useGetCategoryQuery();
  const categories = categoryData?.data.categories;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const budget = searchParams.get("budget");
    const deliveryTime = searchParams.get("deliveryTime");

    setFilters({
      categories: category ? [category] : [],
      priceRange: budget ? [0, parseInt(budget)] : [0, 1000],
      deliveryTime: deliveryTime || "Anytime",
    });
  }, [location.search]);

  const { data, error, isLoading } = useGetProjectQuery();

  const projects =
    data?.data.projects.map((project, index) => ({
      id: project.projectId || index,
      name: project.projectName,
      price: project.budget,
      description: project.projectDescription,
      image: project.imageUrls[0],
      owner: {
        name: project.users.username,
        avatar: project.users.userProfile.avatar,
      },
      category: project.category.categoryName,
      categoryId: project.category.categoryId,
      deadline: calculateDeadline(15), // Adjust as needed
    })) || [];

  const handleFilterChange = (
    filter: keyof Filters,
    value: string | number[]
  ): void => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }));
  };

  const handleCategoryChange = (categoryId: number): void => {
    const categoryIdStr = categoryId.toString();
    const currentCategories = filters.categories;
    
    setFilters({
      ...filters,
      categories: currentCategories.includes(categoryIdStr)
        ? currentCategories.filter((id) => id !== categoryIdStr)
        : [...currentCategories, categoryIdStr],
    });
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
        ? filters.categories.includes(String(project.categoryId))
        : true;
    return inPriceRange && matchesDeadline && matchesCategory;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching projects</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Filter Column */}
      <FilterColumn
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleCategoryChange={handleCategoryChange}
        categories={categories || []}
      />

      {/* Project Grid */}
      <div className="ml-[300px]">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
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
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No projects found matching your criteria.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
