import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loading from "../../Components/Loading";
import { useEffect } from "react";
import { fetchAllUsers } from "../../redux/slices/admin-slices/alluserSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

function Allusers() {
  const users = useSelector((state: RootState) => state.allusers);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (users.isLoading) {
    return <Loading />;
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="table">
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.users.length > 0 &&
            users.users.map((user) => {
              return (
                <tr className="bg-base-200" key={user.u_id}>
                  <th>{user.u_id}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td></td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default Allusers;
