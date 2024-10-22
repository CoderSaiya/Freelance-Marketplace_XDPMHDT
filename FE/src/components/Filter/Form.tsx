import React, { useState } from 'react';

// Hàm tính toán ngày deadline dựa trên số ngày
const calculateDeadline = (days: number): string => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
};

interface Project {
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
}

interface Filters {
  categories: string[];
  priceRange: number[];
  deliveryTime: string;
}

const FilterPage = () => {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [100, 1000],
    deliveryTime: 'Anytime',
  });

  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: 'Project 1',
      price: 245,
      description: 'This is a sample project description that is a bit too long and will be truncated...',
      owner: {
        name: 'User One',
        avatar: 'https://via.placeholder.com/50',
      },
      category: 'Web Development',
      deadline: calculateDeadline(15),
    },
    {
      id: 2,
      name: 'Project 2',
      price: 975,
      description: 'Short description.',
      owner: {
        name: 'User Two',
        avatar: 'https://via.placeholder.com/50',
      },
      category: 'Graphic Design',
      deadline: calculateDeadline(30),
    },
    {
      id: 3,
      name: 'Project 3',
      price: 150,
      description: 'Another sample description that is long enough to be truncated in the display...',
      owner: {
        name: 'User Three',
        avatar: 'https://via.placeholder.com/50',
      },
      category: 'Mobile Development',
      deadline: calculateDeadline(7),
    },
    {
      id: 4,
      name: 'Project 4',
      price: 350,
      description: 'Simple and concise description.',
      owner: {
        name: 'User Four',
        avatar: 'https://via.placeholder.com/50',
      },
      category: 'Content Writing',
      deadline: calculateDeadline(14),
    },
  ]);

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

  const truncateDescription = (description: string): string => {
    const maxLength = 60;
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description;
  };

  const filterByDeadline = (projectDeadline: string): boolean => {
    const daysFilter = getDaysFromDeliveryTime();
    const currentDate = new Date();
    const deadlineDate = new Date(projectDeadline);

    const diffTime = Math.abs(deadlineDate.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= daysFilter;
  };

  const getDaysFromDeliveryTime = (): number => {
    switch (filters.deliveryTime) {
      case 'Up to 7 days':
        return 7;
      case 'Up to 14 days':
        return 14;
      case 'Up to 1 month':
        return 30;
      default:
        return 1000; 
    }
  };

  const filteredProjects = projects.filter((project) => {
    const inPriceRange = project.price >= filters.priceRange[0] && project.price <= filters.priceRange[1];
    const matchesDeadline = filterByDeadline(project.deadline);
    const matchesCategory = filters.categories.length > 0 ? filters.categories.includes(project.category) : true;
    return inPriceRange && matchesDeadline && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex">
      {/* Filter Column */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg"
        style={{
          position: 'fixed',
          width: '250px',
          height: 'calc(100vh - 80px)',
          overflowY: 'auto',
          top: '80px',
          left: 0,
        }}
      >
        <h2 className="font-bold text-lg mb-6">Filters</h2>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700">Category</h3>
          <label className="block mt-2">
            <input
              type="checkbox"
              value="Web Development"
              checked={filters.categories.includes('Web Development')}
              onChange={() => handleCategoryChange('Web Development')}
            />{' '}
            Web Development
          </label>
          <label className="block mt-2">
            <input
              type="checkbox"
              value="Graphic Design"
              checked={filters.categories.includes('Graphic Design')}
              onChange={() => handleCategoryChange('Graphic Design')}
            />{' '}
            Graphic Design
          </label>
          <label className="block mt-2">
            <input
              type="checkbox"
              value="Mobile Development"
              checked={filters.categories.includes('Mobile Development')}
              onChange={() => handleCategoryChange('Mobile Development')}
            />{' '}
            Mobile Development
          </label>
          <label className="block mt-2">
            <input
              type="checkbox"
              value="Content Writing"
              checked={filters.categories.includes('Content Writing')}
              onChange={() => handleCategoryChange('Content Writing')}
            />{' '}
            Content Writing
          </label>
        </div>

        {/* Delivery Time Filter */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700">Delivery Time (Deadline)</h3>
          <label className="block mt-2">
            <input
              type="radio"
              name="deliveryTime"
              value="Up to 7 days"
              checked={filters.deliveryTime === 'Up to 7 days'}
              onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
            />{' '}
            Up to 7 days
          </label>
          <label className="block mt-2">
            <input
              type="radio"
              name="deliveryTime"
              value="Up to 14 days"
              checked={filters.deliveryTime === 'Up to 14 days'}
              onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
            />{' '}
            Up to 14 days
          </label>
          <label className="block mt-2">
            <input
              type="radio"
              name="deliveryTime"
              value="Up to 1 month"
              checked={filters.deliveryTime === 'Up to 1 month'}
              onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
            />{' '}
            Up to 1 month
          </label>
          <label className="block mt-2">
            <input
              type="radio"
              name="deliveryTime"
              value="Anytime"
              checked={filters.deliveryTime === 'Anytime'}
              onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
            />{' '}
            Anytime
          </label>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700">Price Range</h3>
          <input
            type="range"
            min="100"
            max="1000"
            value={filters.priceRange[0]}
            onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
            className="w-full"
          />{' '}
          From {filters.priceRange[0]}
          <input
            type="range"
            min="100"
            max="1000"
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
            className="w-full mt-2"
          />{' '}
          To {filters.priceRange[1]}
        </div>
      </div>

      {/* Project List */}
      <div className="ml-[270px] w-full grid grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
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
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
