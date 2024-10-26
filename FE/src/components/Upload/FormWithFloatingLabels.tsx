import React from "react";
import FloatingLabelInput from "./FloatingLabelInput";

interface FormProps {
  projectName: string;
  projectDescription: string;
  budget: string;
  deadline: string;
  skillRequired: string;
  status: string;
  categoryId: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FormWithFloatingLabels: React.FC<FormProps> = ({
  projectName,
  projectDescription,
  budget,
  deadline,
  skillRequired,
  status,
  categoryId,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      <FloatingLabelInput
        label="Project Name"
        value={projectName}
        onChange={onChange}
        name="projectName"
      />
      <div className="flex gap-10">
        <FloatingLabelInput
          label="Budget"
          type="number"
          value={budget}
          onChange={onChange}
          name="budget"
        />
        <FloatingLabelInput
          label="Deadline"
          type="date"
          value={deadline}
          onChange={onChange}
          name="deadline"
        />
      </div>
      <FloatingLabelInput
        label="Project Description"
        value={projectDescription}
        onChange={onChange}
        name="projectDescription"
      />
      <FloatingLabelInput
        label="Skills Required"
        value={skillRequired}
        onChange={onChange}
        name="skillRequired"
      />
      <FloatingLabelInput
        label="Status"
        value={status}
        onChange={onChange}
        name="status"
      />
      <FloatingLabelInput
        label="Category ID"
        type="number"
        value={categoryId.toString()}
        onChange={onChange}
        name="categoryId"
      />
    </form>
  );
};

export default FormWithFloatingLabels;
