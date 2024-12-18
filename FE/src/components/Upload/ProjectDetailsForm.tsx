import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CategoryType } from "@/types/CategoryType";

interface ProjectDetailsFormProps {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  categories: CategoryType[];
  loading: boolean;
  handleSubmit: (data: any) => Promise<void>;
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  skills,
  setSkills,
  categories,
  loading,
  handleSubmit,
}) => {
  const [inputSkill, setInputSkill] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "," && inputSkill.trim()) {
      event.preventDefault();
      if (!skills.includes(inputSkill.trim())) {
        setSkills([...skills, inputSkill.trim()]);
      }
      setInputSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Fill in the information about your project</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData);
            handleSubmit(data);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input name="projectName" placeholder="Enter project name" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea name="projectDescription" placeholder="Enter project description" className="min-h-[100px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget</label>
              <Input name="budget" type="number" placeholder="Enter budget" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <Input name="deadline" type="date" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Required Skills</label>
            <Input
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill and press ','"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="default" className="px-3 py-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select name="categoryId" className="w-full h-10 px-3 rounded-md border border-input bg-background" required>
              <option value="">Select a category</option>
              {categories.map((category: CategoryType) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <CardFooter className="flex justify-end space-x-4 px-0">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Project"
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectDetailsForm;
