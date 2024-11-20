import { Link } from "react-router-dom";

import { useAuth } from "../AuthContext";

const Header = () => {
  const {
    state: { isAuth },
    logout,
  } = useAuth();

  return (
    <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <Link to="/" className="text-lg font-medium hover:text-gray-200">
          Home
        </Link>
        <Link to="/history" className="text-lg font-medium hover:text-gray-200">
          History
        </Link>
        {isAuth ? (
          <>
            <Link
              to="/policy/add"
              className="text-lg font-medium hover:text-gray-200"
            >
              Add Policy
            </Link>
            <button
              onClick={logout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Signin
            </Link>
            <Link
              to="/signup"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
