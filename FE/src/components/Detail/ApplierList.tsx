import React from "react";
import renderStars from "./renderStars";
import { ApplyType } from "@/types/ApplyType";
import {
  add,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

interface Props {
  applies: ApplyType[];
}

const ApplierList: React.FC<Props> = ({ applies }) => {
  function formatDuration(duration: number): string {
    const now = new Date();
    const targetDate = add(now, { days: duration });

    const years = differenceInYears(targetDate, now);
    if (years >= 1) return `${years} year${years > 1 ? "s" : ""}`;

    const months = differenceInMonths(targetDate, now);
    if (months >= 1) return `${months} month${months > 1 ? "s" : ""}`;

    const days = differenceInDays(targetDate, now);
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-4">
        {applies.length} freelancers are applying for this job
      </h3>
      <div className="flex flex-col gap-4">
        {applies.map((apply) => (
          <div
            key={apply.applyId}
            className="flex items-center gap-4 border-t pt-4 mt-4"
          >
            <img
              src="/img/logo.png"
              alt="Freelancer"
              className="rounded-full w-10"
            />
            <div>
              <h4 className="font-semibold">@{apply.freelancer.username}</h4>
              <p className="text-gray-500">in {formatDuration(apply.duration)}</p>
              <p className="text-yellow-500">
                {renderStars(apply.freelancer.userProfile.rating)}{" "}
                {apply.freelancer?.userProfile?.rating} ({apply?.freelancer?.reviews?.length ?? 0} Review(s))
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplierList;
