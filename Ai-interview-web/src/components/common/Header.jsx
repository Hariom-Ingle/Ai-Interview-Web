import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
 import { logout } from "@/features/auth/authSlice";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useSelector((state) => state.auth.token); // Your token from Redux
  const isSignedIn = Boolean(token);

  const dispatch= useDispatch();

  const handleLogout = () => {
  dispatch(logout());
  localStorage.removeItem('token'); // if using localStorage
  // Optionally navigate or refresh
  window.location.href = '/sign-in';
};

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Question", path: "/question" },
    { name: "About", path: "/about" },
    { name: "Upgrade", path: "/upgrade" },
    { name: "How it Work", path: "/howitwork" },
  ];

  return (
    <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">
          <NavLink to="/">PrepMind</NavLink>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium hover:text-blue-600 ${
                  isActive ? "text-blue-600 underline underline-offset-4" : "text-gray-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              {/* Show user controls here */}
           <Button variant="ghost" onClick={handleLogout}>Sign Out</Button>

            </>
          ) : (
            <>
              <NavLink to="/sign-in">
                <Button variant="outline">Login</Button>
              </NavLink>
              <NavLink to="/sign-up">
                <Button>Sign Up</Button>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2">
          <nav className="flex flex-col items-start gap-3 px-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium hover:text-blue-600 ${
                    isActive ? "text-blue-600 underline" : "text-gray-700"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-col gap-2 px-4 pt-2">
            {isSignedIn ? (
              <>
                {/* User controls for mobile */}
          <Button variant="ghost" onClick={handleLogout}>Sign Out</Button>

              </>
            ) : (
              <>
                <NavLink to="/sign-in" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/sign-up" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full text-blue-600">Sign Up</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
