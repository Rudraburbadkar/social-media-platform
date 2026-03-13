import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserPlus, Check } from 'lucide-react';

const SuggestedUserCard = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="w-full p-3 mt-3 bg-zinc-700 rounded-xl flex items-center gap-4 hover:bg-zinc-500 transition-colors duration-300 group cursor-pointer">
      
      {/* Avatar */}
      <div className="relative">
        <img
          className="w-12 h-12 rounded-full object-cover border-2 border-white group-hover:scale-105 transition-transform"
          src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
          alt="user"
          title="rudra2142"
        />
      </div>

      {/* Username and Follow Button */}
      <div className="flex justify-between items-center w-full">
        <NavLink
          to={`/profile/rudra2142`}
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 text-base font-semibold"
              : "text-white text-base font-semibold hover:underline"
          }
        >
          @rudra2142
        </NavLink>

        <button
          onClick={handleFollow}
          className={`flex items-center gap-1 ${
            isFollowing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white text-xs font-medium py-1.5 px-3 rounded-xl shadow-sm transition-all duration-200`}
        >
          {isFollowing ? (
            <>
              <Check size={14} />
              Following
            </>
          ) : (
            <>
              <UserPlus size={14} />
              Follow
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SuggestedUserCard;
