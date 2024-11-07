import React from "react";
import renderStars from "./renderStars";

interface ClientInfoProp {
  username: string;
  createAt: string;
}

const ClientInfoInfo: React.FC<ClientInfoProp> = ({ username, createAt }) => {
  const joinYear = new Date(createAt).getFullYear();
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="font-semibold text-lg mb-4">Thông tin khách hàng</h3>
      <div className="flex items-center gap-4">
        <img
          src="../../public/img/logo.png"
          alt="Client"
          className="rounded-full w-12"
        />
        <div>
          <p className="font-semibold">@{username}</p>
          <p className="text-gray-500 text-sm">Thành viên từ: {joinYear}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-700">
        Đánh giá trung bình:{" "}
        <span className="text-yellow-500">{renderStars(4.2)}</span> 4.2
      </p>
      <button className="bg-blue-500 text-white mt-4 w-full py-2 rounded-lg">
        Liên hệ với khách hàng
      </button>
    </div>
  );
};

export default ClientInfoInfo;
