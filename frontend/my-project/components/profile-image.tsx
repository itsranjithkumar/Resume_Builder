import React from "react";

interface ProfileImageProps {
  fullName?: string;
  image?: string;
  getInitials: (name: string) => string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ fullName, image, getInitials }) => {
  const [imgError, setImgError] = React.useState(false);
  const profileImg = image || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Resume User')}&background=random`;

  if (!imgError) {
    return (
      <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden">
        <img
          src={profileImg}
          alt={fullName || "Profile"}
          className="w-full h-full object-cover rounded-full border border-gray-300 shadow"
          onError={() => setImgError(true)}
        />
      </div>
    );
  } else {
    return (
      <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden">
        {fullName ? getInitials(fullName) : "YN"}
      </div>
    );
  }
};

export default ProfileImage;
