import { Link } from "react-router-dom";

function AdminLinks() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-10/12 flex flex-col items-center space-y-4 py-4">
        <div className="w-full">
          <Link
            to="/admin/allusers"
            className="block w-full text-center bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-800 shadow-md"
          >
            All Users
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLinks;
