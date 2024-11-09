import React from 'react';
import { CategoryType } from '../../types/CategoryType';

interface Filters {
  categories: string[];
  priceRange: number[];
  deliveryTime: string;
}

interface FilterColumnProps {
  filters: Filters;
  handleFilterChange: (filter: keyof Filters, value: string | number[]) => void;
  handleCategoryChange: (categoryId: number) => void;
  categories: CategoryType[];
}

const FilterColumn: React.FC<FilterColumnProps> = ({
  filters,
  handleFilterChange,
  handleCategoryChange,
  categories,
}) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg"
      style={{
        position: 'fixed',
        width: '250px',
        height: 'calc(100vh - 80px)',
        overflowY: 'auto',
        top: '150px',
        left: 0,
      }}
    >
      <h2 className="font-bold text-lg mb-6">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700">Category</h3>
        {categories.map((category) => (
          <label className="block mt-2" key={category.categoryId}>
            <input
              type="checkbox"
              value={category.categoryId}
              checked={filters.categories.includes(category.categoryId.toString())}
              onChange={() => handleCategoryChange(category.categoryId)}
            />{' '}
            {category.categoryName}
          </label>
        ))}
      </div>

      {/* Delivery Time Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700">Delivery Time (Deadline)</h3>
        {['Up to 7 days', 'Up to 14 days', 'Up to 1 month', 'Anytime'].map((time) => (
          <label className="block mt-2" key={time}>
            <input
              type="radio"
              name="deliveryTime"
              value={time}
              checked={filters.deliveryTime === time}
              onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
            />{' '}
            {time}
          </label>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700">Price Range</h3>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[0]}
          onChange={(e) =>
            handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])
          }
          className="w-full"
        />{' '}
        From {filters.priceRange[0]}
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={(e) =>
            handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])
          }
          className="w-full mt-2"
        />{' '}
        To {filters.priceRange[1]}
      </div>
    </div>
  );
};

export default FilterColumn;
