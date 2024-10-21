import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import Tabs from "../components/Profile/Tabs";
import TimelineTab from "../components/Profile/Tabs/TimeLineTab";
import AboutTab from "../components/Profile/Tabs/AboutTab";
import ProjectManagementTab from "../components/Profile/Tabs/ProjectManagement";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState({
    phone: "+84 123 456 789",
    address: "TP.HCM",
    email: "BinhGa@gmail.com",
    birthday: "June 30, 2004",
    gender: "Male",
  });

  const getRoleFromToken = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        return decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] || null;
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
    return null;
  };

  useEffect(() => {
    const roleFromToken = getRoleFromToken();
    setRole(roleFromToken);
  }, []);

  const renderContent = () => {
    if (activeTab === "Timeline") {
      return <TimelineTab />;
    } else if (activeTab === "About") {
      return (
        <AboutTab
          isEditing={isEditing}
          contactInfo={contactInfo}
          setContactInfo={setContactInfo}
        />
      );
    } else if (activeTab === "Projects") {
      return <ProjectManagementTab role={role} />;
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default Profile;
