import { AboutTabProps } from "../../../types";

const AboutTab: React.FC<AboutTabProps> = ({ isEditing, contactInfo, setContactInfo }) => {
    return (
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
            {isEditing ? (
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              />
            ) : (
              <p className="font-semibold">{contactInfo.phone}</p>
            )}
          </div>
          <div className="mb-6">
            <p className="text-gray-600">Address</p>
            {isEditing ? (
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              />
            ) : (
              <p className="font-semibold">{contactInfo.address}</p>
            )}
          </div>
          <div className="mb-6">
            <p className="text-gray-600">Email</p>
            {isEditing ? (
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              />
            ) : (
              <p className="font-semibold">{contactInfo.email}</p>
            )}
          </div>
        </div>
  
        {/* Right Section - Basic Information */} 
        <div>
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="mb-6">
            <p className="text-gray-600">Birthday</p>
            {isEditing ? (
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.birthday}
                onChange={(e) => setContactInfo({ ...contactInfo, birthday: e.target.value })}
              />
            ) : (
              <p className="font-semibold">{contactInfo.birthday}</p>
            )}
          </div>
          <div className="mb-6">
            <p className="text-gray-600">Gender</p>
            {isEditing ? (
              <input
                className="border px-4 py-2 w-full"
                value={contactInfo.gender}
                onChange={(e) => setContactInfo({ ...contactInfo, gender: e.target.value })}
              />
            ) : (
              <p className="font-semibold">{contactInfo.gender}</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutTab;