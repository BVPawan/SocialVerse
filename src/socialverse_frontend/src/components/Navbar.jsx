import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { AuthClient } from "@dfinity/auth-client";

const navItems = [
  { name: "Home", path: "/home" },
  { name: "Explore", path: "/explore" },
  { name: "Profile", path: "/profile" },
  { name: "Create Post", path: "/create" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();

  // Hide Navbar on login page
  if (location.pathname === "/" || location.pathname === "/login") return null;

  const handleLogout = async () => {
    // Logout from Internet Identity if used
    try {
      const authClient = await AuthClient.create();
      await authClient.logout();
    } catch (e) {
      // Ignore if not logged in with II
    }
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12">
        <div className="flex items-center space-x-4">
          {/* Logo Icon */}
          <span className="inline-flex items-center">
            <svg className="h-5 w-5 text-blue-600 mr-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="6" width="12" height="12" rx="3" />
            </svg>
            <span className="font-bold text-lg text-blue-600">SocialVerse</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-2 px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
