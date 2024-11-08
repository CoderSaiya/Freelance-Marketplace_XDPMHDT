import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import Tabs from "../components/Profile/Tabs";
import TimelineTab from "../components/Profile/Tabs/TimelineTab";
import AboutTab from "../components/Profile/Tabs/AboutTab";
import ProjectManagementTab from "../components/Profile/Tabs/ProjectManagement";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useUserByIdQuery } from "../apis/graphqlApi";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.auth.userId);

  const { data, refetch } = useUserByIdQuery(Number(userId));

  const email = data?.data.userById.email;
  const profile = data?.data.userById.userProfile;
  const username = data?.data.userById.username || "";

  const [contactInfo, setContactInfo] = useState({
    phone: profile?.phone || "Not add",
    address: profile?.location || "Not add",
    email: email || "",
    birthday: profile?.birthday,
    gender: profile?.gender || "Not add",
    rating: profile?.rating || 0.0,
    company: profile?.company || "Not add",
    location: profile?.location || "Not add",
    bio: profile?.bio || "Not add",
    skill: profile?.skill || "Not add",
    avatar: profile?.avatar || "Not add",
    industry: profile?.Industry || "Not add"
  });

  const getRoleFromToken = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        return (
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ||
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"
          ] ||
          null
        );
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
      <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} contactInfo={contactInfo} userId={Number(userId)} username={username}/>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default Profile;
