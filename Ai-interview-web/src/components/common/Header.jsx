import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/features/auth/authSlice"; // Correct import
import { handleError, handleSuccess } from "@/utils"; // Assuming your utility functions are here
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar"
// Removed unused imports from @radix-ui/react-select

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
    const isSignedIn = isAuthenticated;

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            handleSuccess('Logged out successfully!');
            navigate('/login');
            setMenuOpen(false);
        } catch (error) {
            handleError(error || 'Logout failed. Please try again.');
            navigate('/login');
            setMenuOpen(false);
        }
    };

    const navLinks = [
        { name: "Dashboard", path: "/dashboard", protected: true },
        { name: "About", path: "/about" },
        { name: "Upgrade", path: "/upgrade", protected: true },
        { name: "How it Works", path: "/howitwork" },
    ];

    const userInitial = user && user.name ? user.name.charAt(0).toUpperCase() : 'U';
    const userNameDisplay = user && user.name ? `Hi ${user.name.split(' ')[0]}` : 'Hi User';
    const isUserVerified = user && user.isAccountVerified;

    return (
        <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-bold text-blue-600">
                    <NavLink to="/">PrepMind</NavLink>
                </div>

                {/* Nav links (Desktop) */}
                <nav className="hidden md:flex gap-6">
                    {navLinks.map((link) => (
                        (link.protected && !isSignedIn) ? null : (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium hover:text-blue-600 ${isActive ? "text-blue-600 underline underline-offset-4" : "text-gray-700"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        )
                    ))}
                </nav>

                {/* Auth buttons (Desktop) */}
                <div className="hidden md:flex items-center gap-3">
                    {isSignedIn ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar>
                                            <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                                            <AvatarFallback className="bg-blue-200 text-blue-800 font-medium">{userInitial}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-48" align="end" forceMount>
                                    <DropdownMenuLabel>👋  {userNameDisplay}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {!isUserVerified && (
                                        <DropdownMenuItem asChild>
                                            {/* Fix: NavLink is the direct child of DropdownMenuItem with asChild */}
                                            <NavLink to="/verify-email" onClick={() => setMenuOpen(false)} className="w-full">
                                                <Button variant="ghost" className="w-full justify-start text-blue-800 p-0 h-auto">Verify Account</Button>
                                            </NavLink>
                                        </DropdownMenuItem>
                                    )}

                                    {/* Fix: Attach onClick directly to DropdownMenuItem for "Sign Out" */}
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                        {/* Content directly inside DropdownMenuItem */}
                                        <span className="flex items-center w-full justify-start text-red-600">
                                            Sign Out <ArrowRight className="ml-auto h-4 w-4" />
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">
                                <Button variant="outline">Login</Button>
                            </NavLink>
                            <NavLink to="/register">
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
                <div className="md:hidden mt-3 space-y-2 pb-4 border-t border-gray-100">
                    <nav className="flex flex-col items-start gap-3 px-4 pt-3">
                        {navLinks.map((link) => (
                            (link.protected && !isSignedIn) ? null : (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-base font-medium hover:text-blue-600 ${isActive ? "text-blue-600 underline" : "text-gray-700"
                                        }`
                                    }
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.name}
                                </NavLink>
                            )
                        ))}
                    </nav>

                    <div className="flex flex-col gap-2 px-4 pt-4 border-t border-gray-100">
                        {isSignedIn ? (
                            <>
                                {!isUserVerified && (
                                    <NavLink to="/verify-email" onClick={() => setMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-blue-600 text-blue-600">Verify Account</Button>
                                    </NavLink>
                                )}
                                <Button variant="destructive" className="w-full" onClick={handleLogout}>Sign Out</Button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">
                                        Login
                                    </Button>
                                </NavLink>
                                <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                                    <Button className="w-full">Sign Up</Button>
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