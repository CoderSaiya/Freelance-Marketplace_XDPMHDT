import React from 'react';
import { motion } from 'framer-motion';

interface DetailsPanelProps {
  show: boolean;
  onClose: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ show, onClose }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: show ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 z-10"
    >
      <button onClick={onClose} className="text-blue-500">
        Hide Details
      </button>
      <div className="mt-4">
        <h3>Trip details</h3>
        <img
          src="https://via.placeholder.com/150"
          alt="Apartment"
          className="w-full h-48 object-cover rounded-lg"
        />
        <h4>Apartment in Siena</h4>
        <p>4-6 guests · Entire Home · 5 beds · 3 bath</p>
        <p>Apr 12-16, 2023 night - $600 total</p>
      </div>
    </motion.div>
  );
};

export default DetailsPanel;
