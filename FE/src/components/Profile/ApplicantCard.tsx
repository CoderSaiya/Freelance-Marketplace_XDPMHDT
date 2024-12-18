import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ApplyType } from "@/types/ApplyType";

interface ApplicantCardProps {
  apply: ApplyType;
  onClick: (apply: ApplyType) => void;
  statusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  apply,
  onClick,
  statusColor,
  formatDate,
}) => {
  return (
    <Card
      key={apply.applyId}
      className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick(apply)}
    >
      {/* Existing card content */}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">
              {apply.project.projectName}
            </CardTitle>
            <Badge className={statusColor(apply.status)}>
              {apply.status}
            </Badge>
          </div>
          <div className="text-right">
            <p className="flex items-center gap-2 text-green-600 font-semibold">
              <DollarSign className="w-5 h-5" />
              {apply.project.budget}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            Applied on: {formatDate(apply.createAt)}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            Duration: {apply.duration} days
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-5 h-5" />
            Category: {apply.project.category?.categoryName}
          </div>
          <div className="flex items-center gap-2">
            {apply.status === "Accepted" ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : apply.status === "Rejected" ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : null}
            {apply.status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicantCard;
