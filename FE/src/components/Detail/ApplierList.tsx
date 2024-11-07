import React from "react";
import renderStars from "./renderStars";

const ApplierList: React.FC = () => (
  <div className="mt-6">
    <h3 className="font-semibold text-lg mb-4">
      9 người làm việc tự do đang trả giá trung bình 288 đô la Mỹ cho công việc này
    </h3>
    <div className="flex flex-col gap-4">
      {/* Example Bidder */}
      <div className="flex items-center gap-4 border-t pt-4 mt-4">
        <img src="https://via.placeholder.com/50" alt="Bidder" className="rounded-full" />
        <div>
          <h4 className="font-semibold">@Khanuitech</h4>
          <p className="text-gray-500">300 đô la Mỹ trong 1 ngày</p>
          <p className="text-yellow-500">{renderStars(4.2)} 4.2 (9 đánh giá)</p>
        </div>
      </div>
      {/* Another Example Bidder */}
      <div className="flex items-center gap-4 border-t pt-4 mt-4">
        <img src="https://via.placeholder.com/50" alt="Bidder" className="rounded-full" />
        <div>
          <h4 className="font-semibold">@softsolution2000</h4>
          <p className="text-gray-500">488 đô la Mỹ trong 7 ngày</p>
          <p className="text-yellow-500">{renderStars(5.0)} 5.0 (1 đánh giá)</p>
        </div>
      </div>
    </div>
  </div>

);

export default ApplierList;
