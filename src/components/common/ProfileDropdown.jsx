import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { logoutAuthSession } from '../../utils/auth.js';

const ProfileDropdown = ({ user, isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await logoutAuthSession();
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute  right-0 top-0 mt-12 w-60 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
    >
      {/* User Info */}
      {user?.name && (
        <>
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            {user?.email && (
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            )}
          </div>
          <hr className="border-gray-100" />
        </>
      )}

      {/* Menu Items */}
      <div className="py-1">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 text-sm whitespace-nowrap text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FiUser className="w-4 h-4 text-gray-400" />
          Your Profile
        </Link>
        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FiSettings className="w-4 h-4 text-gray-400" />
          Settings
        </Link>
      </div>

      <hr className="border-gray-100" />

      {/* Logout */}
      <div className="py-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span className='text-sm '>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
