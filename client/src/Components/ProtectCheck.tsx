import Loading from "./Loading";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectCheck() {
  const user = useSelector((state: RootState) => state.user);
  if (user.isLoading) {
    return <Loading />;
  }
  console.clear();
  return (
    <>{user.decodeduser.u_id ? <Outlet /> : <Navigate to="/login" />}</>
  );
}

export default ProtectCheck;
