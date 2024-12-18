import React, { useState } from "react";
import {
  useCreateApplyMutation,
  useHasAppliedForProjectQuery,
} from "../../apis/graphqlApi";
import { ApplyInput } from "../../types/ApplyType";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { notification } from "antd";

interface Props {
  clientId: number;
  projectId: number;
  refechProject: () => void;
}

const ApplyAndBenefits: React.FC<Props> = ({ clientId, projectId, refechProject }) => {
  const [duration, setDuration] = useState(0);

  const [createApply] = useCreateApplyMutation();

  const userId = useSelector((state: RootState) => state.auth.userId);

  const { data, refetch } = useHasAppliedForProjectQuery({
    projectId: projectId,
    freelancerId: Number(userId),
  });

  const isApplied = data?.data.hasAppliedForProject;

  const handelApply = async () => {
    console.log(userId);
    const apply: ApplyInput = {
      freelancerId: Number(userId),
      clientId: clientId,
      projectId: projectId,
      duration: duration,
      status: "Pending",
    };

    console.log(apply);
    try {
      await createApply({ apply }).unwrap();
      refetch();
      refechProject();
      notification.success({
        message: "Sucessfully apply!!!",
      });
    } catch (err) {
      console.error("Error applying:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Bid Section */}
      <div className="bg-gray-50 p-4 rounded-lg md:w-1/2">
        <h2 className="font-semibold text-lg mb-4">Your Apply</h2>
        {!isApplied ? (
          <>
            <input
              type="number"
              placeholder="Your deadline (date)"
              className="border rounded-md w-full p-2 mb-4"
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={handelApply}
            >
              Apply Project
            </button>{" "}
          </>
        ) : (
          <div className="flex">
            <span className="text-green-500 mr-2">✔</span>
            <h2 className="font-semibold">You are already applied</h2>
          </div>
        )}
      </div>

      {/* Freelancer Benefits */}
      <div className="bg-gray-50 p-4 rounded-lg md:w-1/2">
        <h3 className="font-semibold text-lg mb-4">
          Benefits of Bidding on Freelancer
        </h3>
        <ul className="list-none text-gray-700">
          <li className="flex items-center mb-2">
            <span className="text-green-500 mr-2">✔</span>
            Set your time frame
          </li>
          <li className="flex items-center mb-2">
            <span className="text-green-500 mr-2">✔</span>
            Get paid for your work
          </li>
          <li className="flex items-center mb-2">
            <span className="text-green-500 mr-2">✔</span>
            Outline your proposal
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span>
            Registration and job bidding is free.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApplyAndBenefits;
