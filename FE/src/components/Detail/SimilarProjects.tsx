import React from "react";

const SimilarProjects: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="font-semibold text-lg mb-4">Các dự án tương tự</h3>
    <ul className="space-y-4">
      <li>
        <a href="#" className="text-blue-600 hover:underline">
          Dự án A - $200 USD
        </a>
        <p className="text-gray-500 text-sm">Đã đăng 2 ngày trước</p>
      </li>
      <li>
        <a href="#" className="text-blue-600 hover:underline">
          Dự án B - $300 USD
        </a>
        <p className="text-gray-500 text-sm">Đã đăng 5 ngày trước</p>
      </li>
      <li>
        <a href="#" className="text-blue-600 hover:underline">
          Dự án C - $250 USD
        </a>
        <p className="text-gray-500 text-sm">Đã đăng 1 tuần trước</p>
      </li>
    </ul>
  </div>
);

export default SimilarProjects;
