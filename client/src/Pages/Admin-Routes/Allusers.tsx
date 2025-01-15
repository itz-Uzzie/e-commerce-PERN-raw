import Loading from "../../Components/Loading";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import {
  fetchAllUsers,
  removeruser,
} from "../../redux/slices/admin-slices/alluserSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

function Allusers() {
  const users = useSelector((state: RootState) => state.allusers);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  const handleRemove = (u_id: number) => {
    dispatch(removeruser(u_id));
  };

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
                  <td>
                    <div
                      className="btn bg-red-600"
                      onClick={() => handleRemove(user.u_id)}
                    >
                      remove user
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default Allusers;
