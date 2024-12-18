import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProjectImageUploadProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  isUploading: boolean;
  progress: number;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectImageUpload: React.FC<ProjectImageUploadProps> = ({
  file,
  setFile,
  isUploading,
  progress,
  handleFileUpload,
}) => (
  <Card className="w-full md:w-1/2">
    <CardHeader>
      <CardTitle>Project Image</CardTitle>
      <CardDescription>Upload an image for your project</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
        {!file && (
          <label className="flex flex-col items-center space-y-2 cursor-pointer">
            <div className="p-4 rounded-full bg-primary/10">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <span className="text-sm font-medium">Drop your image here or click to upload</span>
            <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          </label>
        )}
        {isUploading && (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{file?.name}</span>
              <span className="text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        {!isUploading && file && progress === 100 && (
          <div className="w-full">
            <Alert>
              <AlertTitle>Upload Complete</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span className="text-sm truncate">{file.name}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                    Remove
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default ProjectImageUpload;
