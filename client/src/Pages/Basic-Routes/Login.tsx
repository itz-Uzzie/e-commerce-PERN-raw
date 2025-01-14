import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchuser, setFromLocal } from "../../redux/slices/userSlice";

function Login() {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const navigate = useNavigate();
  const [userdata, setuserdata] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setuserdata({
      ...userdata,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetch("http://localhost:4000/api/v1/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userdata),
    });
    if (result.ok) {
      const response = await result.json();
      localStorage.setItem("token", response.token);
      dispatch(setFromLocal());
      dispatch(fetchuser());
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form onSubmit={handleSubmit} className="card-body space-y-4">
          <h1 className="text-3xl font-bold text-center">Login</h1>
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              name="email"
              type="email"
              className="input input-bordered"
              value={userdata.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              name="password"
              type="password"
              className="input input-bordered"
              value={userdata.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={userdata.email === "" || userdata.password === ""}
            >
              Login
            </button>
          </div>
          <div className="text-center mt-4">
            <Link to="/signup" className="text-sm link link-hover">
              New here? <span className="text-primary">Create an account</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
