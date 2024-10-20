import React, { useState } from 'react';

const Profile = () => {
  // Quản lý trạng thái cho các tab và chế độ chỉnh sửa
  const [activeTab, setActiveTab] = useState('About');
  const [isEditing, setIsEditing] = useState(false);

  // Giá trị cho các ô input trong chế độ chỉnh sửa
  const [contactInfo, setContactInfo] = useState({
    phone: '+84 123 456 789',
    address: 'TP.HCM',
    email: 'BinhGa@gmail.com',
    birthday: 'June 30, 2004',
    gender: 'Male',
  });

  // Nội dung của từng tab
  const renderContent = () => {
    if (activeTab === 'Timeline') {
      return (
        <div>
          <h2 className="text-xl font-bold mb-4">Portfolio</h2>
          <div className="mb-6">
            <h3 className="font-semibold">Webchat</h3>
            <p className="text-sm text-gray-400">Completed: June 2024</p>
          </div>
        </div>
      );
    } else if (activeTab === 'About') {
      return isEditing ? (
        <div className="grid grid-cols-3 gap-6">
          {/* Left Section - Certifications */} 
          <div>
            <h2 className="text-xl font-bold mb-4">Certifications</h2>
            <div className="mb-6">
              <p className="font-semibold">Certified Web Developer</p>
              <p className="text-sm text-gray-500">Issued by Google</p>
              <p className="text-sm text-gray-400">Received: May 2022</p>
              <p className="text-sm text-green-500">Verified</p>
            </div>
          </div>

          {/* Middle Section - Contact Information (Editable) */}
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="mb-6">
              <p className="text-gray-600">Phone</p>
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <p className="text-gray-600">Address</p>
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <p className="text-gray-600">Email</p>
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              />
            </div>
          </div>

          {/* Right Section - Basic Information (Editable) */}
          <div>
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="mb-6">
              <p className="text-gray-600">Birthday</p>
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.birthday}
                onChange={(e) => setContactInfo({ ...contactInfo, birthday: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <p className="text-gray-600">Gender</p>
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.gender}
                onChange={(e) => setContactInfo({ ...contactInfo, gender: e.target.value })}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Left Section - Certifications */} 
          <div>
            <h2 className="text-xl font-bold mb-4">Certifications</h2>
            <div className="mb-6">
              <p className="font-semibold">Certified Web Developer</p>
              <p className="text-sm text-gray-500">Issued by Google</p>
              <p className="text-sm text-gray-400">Received: May 2022</p>
              <p className="text-sm text-green-500">Verified</p>
            </div>
          </div>

          {/* Middle Section - Contact Information */} 
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="mb-6">
              <p className="text-gray-600">Phone</p>
              <p className="font-semibold">{contactInfo.phone}</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">Address</p>
              <p className="font-semibold">{contactInfo.address}</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">Email</p>
              <p className="font-semibold">{contactInfo.email}</p>
            </div>
          </div>

          {/* Right Section - Basic Information */} 
          <div>
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="mb-6">
              <p className="text-gray-600">Birthday</p>
              <p className="font-semibold">{contactInfo.birthday}</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">Gender</p>
              <p className="font-semibold">{contactInfo.gender}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header */} 
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src="../../../public/img/BinhGa.jpg"
              alt="Avatar"
              className="w-28 h-28 rounded-full mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold">Bình Gà</h1>
              <div className="mt-2">
                <span className="text-gray-600">Ranking:</span>
                <span className="ml-2 text-xl font-bold">8.6</span>
                <span className="ml-2 text-yellow-500">★★★★☆</span>
              </div>
            </div>
          </div>
          <div className="space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow">
              Contacts
            </button>
            <button className="bg-gray-100 text-black px-4 py-2 rounded-md shadow">
              Report user
            </button>
            {/* Nút Edit */}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Tabs for Timeline & About */} 
        <div className="flex justify-start items-center border-b border-gray-300 mb-6 pb-2">
          <button
            className={`mr-6 ${activeTab === 'Timeline' ? 'text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('Timeline')}
          >
            Timeline
          </button>
          <button
            className={`${activeTab === 'About' ? 'text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('About')}
          >
            About
          </button>
        </div>

        {/* Nội dung của các tab */} 
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
