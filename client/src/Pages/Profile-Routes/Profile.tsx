import { Link } from "react-router-dom";
import { useState } from "react";
import { RootState } from "../../redux/store";
import { updatePassword } from "../../redux/slices/userSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const [showPass, setShowPass] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordUpdate = () => {
    if (!newPassword.trim()) {
      alert("Please enter a valid password.");
      return;
    }

    dispatch(
      updatePassword({ u_id: user.decodeduser.u_id, newpass: newPassword })
    )
      .unwrap()
      .then(() => {
        alert("Password updated successfully!");
        setNewPassword("");
        setShowPasswordBox(false);
      })
      .catch((error) => {
        console.error("Error updating password:", error);
        alert("Failed to update password.");
      });
  };

  return (
    <div className="flex flex-col lg:flex-row md:flex-row min-h-screen">
      <aside className="w-full lg:w-1/4 md:w-1/4 bg-base-200 p-5 shadow-lg">
        <h1 className="text-2xl text-center font-bold mb-5">Dashboard</h1>
        <ul className="menu p-0 flex flex-row justify-center lg:flex-col md:flex-col">
          <li>
            <Link
              to={`/myproducts/${user.decodeduser.u_id}`}
              className="btn btn-ghost"
            >
              My Products
            </Link>
          </li>
          <li>
            <Link
              to={`/mysales/${user.decodeduser.u_id}`}
              className="btn btn-ghost"
            >
              My Sales
            </Link>
          </li>
          <li>
            <Link
              to={`/mycart/${user.decodeduser.u_id}`}
              className="btn btn-ghost"
            >
              My Cart
            </Link>
          </li>
          <li>
            <Link
              to={`/myorders/${user.decodeduser.u_id}`}
              className="btn btn-ghost"
            >
              My Orders
            </Link>
          </li>
          <li>
            <Link to="/addproduct" className="btn btn-ghost">
              Add Product
            </Link>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-8">
        <div className="card w-full bg-base-100 shadow-xl p-5">
          <h2 className="text-3xl font-bold mb-5">Profile Details</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Name:</h3>
            <p className="text-lg">{user.user.name}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Email:</h3>
            <p className="text-lg">{user.user.email}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Password:</h3>
            <p className="text-lg">
              {showPass ? user.user.password : "******"}
            </p>
            <button
              className="btn btn-outline hover:bg-green-500 mt-2"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"} Password
            </button>
            <button
              className="btn btn-outline hover:bg-green-500 ml-8"
              onClick={() => setShowPasswordBox(true)}
            >
              Update Password
            </button>
          </div>

          {showPasswordBox && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
              <div className="p-6 w-full max-w-md bg-zinc-700 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Update Password</h3>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="input input-bordered w-full mb-4"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    className="btn btn-outline mr-4"
                    onClick={() => setShowPasswordBox(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handlePasswordUpdate}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
