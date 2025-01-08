import Loading from "./Loading";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const user = useSelector((state: RootState) => state.user);
  if (user.isLoading) {
    return <Loading />;
  }
  console.log(user.decodeduser.isadmin);
  return (
    <>{user.decodeduser.isadmin == false ? <Navigate to="/" /> : <Outlet />}</>
  );
}

export default PrivateRoute;
