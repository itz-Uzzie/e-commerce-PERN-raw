import { Link } from "react-router-dom";
import { useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row md:flex-row min-h-screen">
      <aside className="w-full flex flex-row lg:w-1/4 lg:flex-col md:w-1/4 md:flex-col bg-base-200 p-5 shadow-lg">
        <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
        <ul className="menu p-0">
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
            <Link to="/addproduct" className="btn btn-primary">
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
              className="btn btn-outline mt-2"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"} Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
