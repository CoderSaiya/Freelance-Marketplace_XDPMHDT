import React from "react";
import FloatingLabelInput from "./FloatingLabelInput";
import { CategoryType } from "../../types/CategoryType";

interface FormProps {
  projectName: string;
  projectDescription: string;
  budget: string;
  deadline: string;
  skillRequire: string;
  categoryId: number;
  categories: CategoryType[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FormWithFloatingLabels: React.FC<FormProps> = ({
  projectName,
  projectDescription,
  budget,
  deadline,
  skillRequire,
  categoryId,
  categories,
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
        value={skillRequire}
        onChange={onChange}
        name="skillRequire"
      />
      <div className="flex flex-col">
        <select
          name="categoryId"
          value={categoryId}
          onChange={onChange}
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default FormWithFloatingLabels;
