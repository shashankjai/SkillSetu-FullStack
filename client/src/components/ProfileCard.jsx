import { FaLinkedin, FaTwitter, FaInstagram, FaGlobe } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

export default function ProfileCard({ user }) {
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

  return (
    <div className="w-80 rounded-xl border border-white/10 bg-slate-900 p-6 text-center text-white">
      {/* Profile Image */}
      <div className="relative inline-block">
        <img
          className="mx-auto h-28 w-28 rounded-full border-2 border-blue-400/50 object-cover"
          src={
            user?.profilePicture
              ? `${API_URL}/uploads/profile-pictures/${user.profilePicture}`
              : "/default-avatar.png"
          }
          alt={user?.name || "User"}
        />
        {user?.status && (
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-green-500"></span>
        )}
      </div>

      {/* User Info */}
      <h3 className="mt-4 text-xl font-semibold text-white">
        {user?.name || "User"}
      </h3>
      
      {user?.title && (
        <p className="mt-1 text-sm text-blue-400">{user.title}</p>
      )}
      
      {user?.location && (
        <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-400">
          <FiMapPin size={12} />
          {user.location}
        </p>
      )}

      {/* Bio */}
      {user?.bio && (
        <p className="mt-3 border-t border-white/10 pt-3 text-sm text-slate-300">
          {user.bio}
        </p>
      )}

      {/* Skills */}
      {user?.skills && user.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5 border-t border-white/10 pt-3">
          {user.skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="rounded-full bg-blue-600/20 px-2.5 py-0.5 text-xs text-blue-300"
            >
              {skill}
            </span>
          ))}
          {user.skills.length > 5 && (
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
              +{user.skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Social Icons */}
      {(user?.socials?.linkedin || 
        user?.socials?.twitter || 
        user?.socials?.instagram ||
        user?.website) && (
        <div className="mt-4 flex justify-center gap-4 border-t border-white/10 pt-4">
          {user.socials?.linkedin && (
            <a
              href={user.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 transition hover:text-blue-400"
            >
              <FaLinkedin size={18} />
            </a>
          )}
          {user.socials?.twitter && (
            <a
              href={user.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 transition hover:text-blue-400"
            >
              <FaTwitter size={18} />
            </a>
          )}
          {user.socials?.instagram && (
            <a
              href={user.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 transition hover:text-pink-400"
            >
              <FaInstagram size={18} />
            </a>
          )}
          {user?.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 transition hover:text-white"
            >
              <FaGlobe size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}