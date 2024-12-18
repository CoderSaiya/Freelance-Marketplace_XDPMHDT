import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AboutTabProps } from "../../../types";

const AboutTab: React.FC<AboutTabProps> = ({ isEditing, contactInfo, setContactInfo }) => {
  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
  ];

  const renderField = (label: string, value: string, onChange: (value: string) => void, type: string = "text") => {
    return (
      <div className="space-y-2">
        <Label className="text-gray-600">{label}</Label>
        {isEditing ? (
          type === "textarea" ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="resize-none"
            />
          ) : (
            <Input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )
        ) : (
          <p className="font-medium text-gray-900">{value}</p>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Section - Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">Certified Web Developer</p>
              <p className="text-sm text-gray-500">Issued by Google</p>
              <p className="text-sm text-gray-400">Received: May 2022</p>
              <div className="flex items-center mt-2 text-green-500 text-sm">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Middle Section - Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderField("Phone", contactInfo.phone, (value) => 
            setContactInfo({ ...contactInfo, phone: value })
          )}
          {renderField("Address", contactInfo.address, (value) =>
            setContactInfo({ ...contactInfo, address: value })
          )}
          {renderField("Email", contactInfo.email, (value) =>
            setContactInfo({ ...contactInfo, email: value }), "email"
          )}
        </CardContent>
      </Card>

      {/* Right Section - Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderField("Birthday", contactInfo.birthday, (value) =>
            setContactInfo({ ...contactInfo, birthday: value }), "date"
          )}
          {renderField("Gender", contactInfo.gender, (value) =>
            setContactInfo({ ...contactInfo, gender: value })
          )}
          {renderField("Bio", contactInfo.bio, (value) =>
            setContactInfo({ ...contactInfo, bio: value }), "textarea"
          )}
          {renderField("Skill", contactInfo.skill, (value) =>
            setContactInfo({ ...contactInfo, skill: value })
          )}
          
          <div className="space-y-2">
            <Label className="text-gray-600">Avatar</Label>
            {isEditing ? (
              <div className="space-y-4">
                <RadioGroup
                  value={contactInfo.avatar}
                  onValueChange={(value) => setContactInfo({ ...contactInfo, avatar: value })}
                  className="grid grid-cols-5 gap-4"
                >
                  {avatarOptions.map((url, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={url} alt={`Avatar option ${index + 1}`} />
                          <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                        <RadioGroupItem
                          value={url}
                          id={`avatar-${index}`}
                          className="absolute bottom-0 right-0"
                        />
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={contactInfo.avatar} alt="Selected avatar" />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutTab;