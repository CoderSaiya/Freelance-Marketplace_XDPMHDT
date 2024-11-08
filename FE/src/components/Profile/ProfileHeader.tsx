import { useUpdateUserProfileMutation } from "../../apis/graphqlApi";
import { ProfileHeaderProps } from "../../types";

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditing,
  setIsEditing,
  contactInfo,
  userId,
  username
}) => {
  const [updateUserProfile] = useUpdateUserProfileMutation();

  const handleSave = async () => {
    try {
      console.log(contactInfo.birthday);
      await updateUserProfile({
        userId: userId,
        userProfileInput: {
          rating: contactInfo.rating,
          company: contactInfo.company,
          location: contactInfo.address,
          phone: contactInfo.phone,
          birthday: new Date(contactInfo.birthday),
          gender: contactInfo.gender,
          bio: contactInfo.bio,
          skill: contactInfo.skill,
          avatar: contactInfo.avatar,
          industry: contactInfo.industry,
        },
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <img
          src="/img/BinhGa.jpg"
          alt="Avatar"
          className="w-28 h-28 rounded-full mr-6"
        />
        <div>
          <h1 className="text-3xl font-bold">@{username}</h1>
          <div className="mt-2">
            <span className="text-gray-600">Rating:</span>
            <span className="ml-2 text-xl font-bold">{contactInfo.rating}</span>
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
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
