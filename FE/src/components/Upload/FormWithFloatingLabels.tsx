import React, { useState } from "react";
import FloatingLabelInput from "./FloatingLabelInput";

const FormWithFloatingLabels: React.FC = () => {
  const [formValues, setFormValues] = useState({
    projectName: "",
    projectDescription: "",
    budget: "",
    deadline: "",
    skillRequired: "",
    status: "",
    categoryId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <form className="p-6 space-y-4">
      <FloatingLabelInput
        label="Project Name"
        value={formValues.projectName}
        onChange={handleInputChange}
        name="projectName"
      />
      <div className="flex gap-10">
        <FloatingLabelInput
          label="Budget"
          type="number"
          value={formValues.budget}
          onChange={handleInputChange}
          name="budget"
        />
        <FloatingLabelInput
          label="Deadline"
          type="date"
          value={formValues.deadline}
          onChange={handleInputChange}
          name="deadline"
        />
      </div>
      <FloatingLabelInput
        label="Project Description"
        value={formValues.projectDescription}
        onChange={handleInputChange}
        name="projectDescription"
      />

      <FloatingLabelInput
        label="Skills Required"
        value={formValues.skillRequired}
        onChange={handleInputChange}
        name="skillRequired"
      />
      <FloatingLabelInput
        label="Status"
        value={formValues.status}
        onChange={handleInputChange}
        name="status"
      />
      <FloatingLabelInput
        label="Category ID"
        value={formValues.categoryId}
        onChange={handleInputChange}
        name="categoryId"
      />
    </form>
  );
};

export default FormWithFloatingLabels;
