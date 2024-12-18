import React from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbProps } from '../../types';

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-4 text-sm">
      <ol className="breadcrumb flex space-x-1 text-gray-500">
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${index === items.length - 1 ? 'text-gray-400' : ''}`}
          >
            {item.link ? (
              <Link to={item.link} className="hover:text-gray-600 transition-colors">
                {item.name}
              </Link>
            ) : (
              <span>{item.name}</span>
            )}
            {index < items.length - 1 && <span className="mx-1">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
