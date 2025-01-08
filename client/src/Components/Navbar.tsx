import { Link } from "react-router-dom";
import { useState } from "react";
import { RootState } from "../redux/store";
import { removeUser } from "../redux/slices/userSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const user = useSelector((state: RootState) => state.user);
  const isadmin = user.decodeduser.isadmin;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const removeuser = () => {
    dispatch(removeUser());
  };

  return (
    <nav className="bg-transparent shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold">
            <Link to="/">Me Commerce</Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            {user.decodeduser.u_id && (
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => {
                  removeuser();
                }}
              >
                Logout
              </Link>
            )}
            {!user.decodeduser.u_id && (
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => {
                  removeuser();
                }}
              >
                Login
              </Link>
            )}
            {isadmin && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            )}
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
              to="/about"
              className="block text-center py-2 px-4 text-sm text-gray-600 hover:bg-gray-100"
            >
              About
            </Link>
            {user.decodeduser.u_id && (
              <Link
                to="/login"
                className="block text-center py-2 px-4 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  removeuser();
                }}
              >
                Logout
              </Link>
            )}
            {!user.decodeduser.u_id && (
              <Link
                to="/login"
                className="block text-center py-2 px-4 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  removeuser();
                }}
              >
                Login
              </Link>
            )}
            {isadmin && (
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
