import React from "react";
import renderStars from "./renderStars";

const CustomerInfo: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="font-semibold text-lg mb-4">Thông tin khách hàng</h3>
    <div className="flex items-center gap-4">
      <img src="https://via.placeholder.com/50" alt="Client" className="rounded-full" />
      <div>
        <p className="font-semibold">@ClientUsername</p>
        <p className="text-gray-500 text-sm">Thành viên từ: 2022</p>
      </div>
    </div>
    <p className="mt-4 text-gray-700">
      Đánh giá trung bình: <span className="text-yellow-500">{renderStars(4.2)}</span> 4.2
    </p>
    <button className="bg-blue-500 text-white mt-4 w-full py-2 rounded-lg">
      Liên hệ với khách hàng
    </button>
  </div>
);

export default CustomerInfo;