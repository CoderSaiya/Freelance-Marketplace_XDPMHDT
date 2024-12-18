import React from "react";
import renderStars from "./renderStars";
import { useNavigate } from "react-router-dom";

interface ClientInfoProp {
  username: string;
  createAt: string;
  rating: number;
}

const ClientInfoInfo: React.FC<ClientInfoProp> = ({
  username,
  createAt,
  rating,
}) => {
  const joinYear = new Date(createAt).getFullYear();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat?receiver=${username}`);
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="font-semibold text-lg mb-4">Client Info</h3>
      <div className="flex items-center gap-4">
        <img
          src="../../public/img/logo.png"
          alt="Client"
          className="rounded-full w-12"
        />
        <div>
          <p className="font-semibold">@{username}</p>
          <p className="text-gray-500 text-sm">Members from: {joinYear}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-700">
        Average rating:{" "}
        <span className="text-yellow-500">{renderStars(rating)}</span> {rating}
      </p>
      <button
        className="bg-blue-500 text-white mt-4 w-full py-2 rounded-lg"
        onClick={handleClick}
      >
        Contact customer
      </button>
    </div>
  );
};

export default ClientInfoInfo;
