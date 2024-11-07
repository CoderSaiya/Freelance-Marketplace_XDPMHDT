import React, { useState } from "react";
import { useCreateApplyMutation } from "../../apis/graphqlApi";
import { ApplyInput } from "../../types/ApplyType";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Props {
  projectId: number;
}

const ApplyAndBenefits: React.FC<Props> = ({ projectId }) => {
  const [duration, setDuration] = useState(0);

  const [createApply] = useCreateApplyMutation();

  const userId = useSelector((state: RootState) => state.auth.userId);

  console.log(duration);

  const handelApply = async () => {
    console.log(userId);
    const apply: ApplyInput = {
      userId: Number(userId),
      projectId: projectId,
      duration: duration,
      status: "Pending",
    };

    console.log(apply);
    try {
      const response = await createApply({ apply }).unwrap();
      console.log("Apply response:", response);
    } catch (err) {
      console.error("Error applying:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Bid Section */}
      <div className="bg-gray-50 p-4 rounded-lg md:w-1/2">
        <h2 className="font-semibold text-lg mb-4">Your Apply</h2>
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
        </button>
      </div>

      {/* Freelancer Benefits */}
      <div className="bg-gray-50 p-4 rounded-lg md:w-1/2">
        <h3 className="font-semibold text-lg mb-4">
          Lợi ích của việc đấu thầu trên Freelancer
        </h3>
        <ul className="list-none text-gray-700">
          <li className="flex items-center mb-2">
            <span className="text-green-500 mr-2">✔</span>
            Thiết lập ngân sách và khung thời gian của bạn
          </li>
          <li className="flex items-center mb-2">
            <span className="text-green-500 mr-2">✔</span>
            Được trả tiền cho công việc của bạn
          </li>
          <li className="flex items-center mb-2">
            <span className="text-green-500 mr-2">✔</span>
            Phác thảo đề xuất của bạn
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span>
            Đăng ký và đấu thầu công việc là miễn phí
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApplyAndBenefits;
