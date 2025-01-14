import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FaBell } from "react-icons/fa";
import { RootState } from "../redux/store";
import { removeUser } from "../redux/slices/userSlice";
import { useState, useEffect } from "react";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchnotifications,
  mark_as_read,
} from "../redux/slices/notificationSlice";

const Navbar = () => {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const user = useSelector((state: RootState) => state.user);
  const mynotifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const isAdmin = user?.decodeduser?.isadmin;
  const userId = user?.decodeduser?.u_id;
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  const handleLogout = () => {
    dispatch(removeUser());
  };
  const handleMarkAsRead = (n_id: number) => {
    dispatch(mark_as_read(n_id));
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchnotifications(userId));
    }
  }, [userId, dispatch]);

  return (
    <nav className="bg-transparent shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold">
            <Link to="/">Me Commerce</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            {userId ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            )}

            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <FaBell className="w-5 h-5" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 h-60 bg-gray-800 shadow-lg rounded-lg overflow-y-scroll z-10">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-400">
                      Notifications
                    </h3>
                    <ul>
                      {mynotifications.length > 0 ? (
                        mynotifications.map((not) => (
                          <li
                            key={not.n_id}
                            className={`py-2 mb-1 text-sm border-b rounded-xl p-2 ${
                              not.isread ? "bg-white" : "bg-green-400"
                            }`}
                          >
                            <p className="text-gray-900">{not.content}</p>
                            {!not.isread && (
                              <button
                                onClick={() => handleMarkAsRead(not.n_id)}
                                className="mt-1 text-xs text-green-900 hover:underline"
                              >
                                Mark as Read
                              </button>
                            )}
                            <p className="text-xs text-right text-gray-600">
                              {format(new Date(not.created_at), "PPpp")}
                            </p>
                          </li>
                        ))
                      ) : (
                        <li className="py-2 text-sm text-gray-600">
                          No new notifications
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <Link
              to="/"
              className="block text-center py-2 px-4 text-sm text-gray-600 hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="block text-center py-2 px-4 text-sm text-gray-600 hover:bg-gray-100"
            >
              Profile
            </Link>
            {userId ? (
              <p
                onClick={handleLogout}
                className="block text-center py-2 px-4 text-sm text-gray-600 hover:bg-gray-100"
              >
                Logout
              </p>
            ) : (
              <Link
                to="/login"
                className="block text-center py-2 px-4 text-sm text-gray-600 hover:bg-gray-100"
              >
                Login
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="block text-center py-2 px-4 text-sm text-gray-600 hover:bg-gray-100"
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
