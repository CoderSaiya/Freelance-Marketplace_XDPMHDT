import React, { useState } from "react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import Tabs from "../components/Profile/Tabs";
import TimelineTab from "../components/Profile/Tabs/TimelineTab";
import AboutTab from "../components/Profile/Tabs/AboutTab";
import ProjectManagementTab from "../components/Profile/Tabs/ProjectManagement";
import { useUserByUsernameQuery } from "../apis/graphqlApi";
import Breadcrumb from "../components/Public/Breadcrumb";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const usernameParam = urlParams.get("username");
  const navigate = useNavigate();

  if (usernameParam === null) {
    navigate("/");
  }

  const [activeTab, setActiveTab] = useState("About");
  const [isEditing, setIsEditing] = useState(false);

  const { data, refetch } = useUserByUsernameQuery(String(usernameParam));

  const userId = data?.data.userByUsername.id;
  const email = data?.data.userByUsername.email;
  const profile = data?.data.userByUsername.userProfile;
  const username = data?.data.userByUsername.username || "";
  const role = data?.data.userByUsername.role;

  console.log(role);

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

  const breadcrumbItems = [
    { name: "Home", link: "/" },
    { name: "Profile", link: "" },
  ];

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
      return <ProjectManagementTab userId={Number(userId)} role={String(role)} />;
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8 px-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} contactInfo={contactInfo} userId={Number(userId)} username={username} activeTab={activeTab}/>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default Profile;
