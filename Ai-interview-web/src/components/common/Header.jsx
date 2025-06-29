import { Button } from "@/components/ui/button";
import { logoutUser } from "@/features/auth/authSlice";
import { toggleTheme } from "@/features/theme/themeSlice";  
import { handleError, handleSuccess } from "@/utils";
import { ArrowRight, LogIn, Menu, Moon, Sun, UserPlus, X } from "lucide-react";  
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const currentTheme = useSelector((state) => state.theme.theme); // NEW: Get current theme
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

    const handleThemeToggle = () => { // NEW: Theme toggle handler
        dispatch(toggleTheme());
    };

    const navLinks = [
        { name: "Dashboard", path: "/dashboard", protected: true },
        { name: "About", path: "/about" },
        { name: "Upgrade", path: "/upgrade", protected: true },
        { name: "How it Works", path: "/howitwork" },
    ];

     
    const userInitial = user && user.name ? user.name.trim().charAt(0).toUpperCase() : 'U';
    
    const userNameDisplay = user && user.name ? `Hi ${user.name.trim().split(' ')[0]}` : 'Hi User';
    const isUserVerified = user && user.isAccountVerified;

    // Determine header background based on theme
    const headerClasses = `
        px-4 py-3 sticky top-0 z-50 transition-colors duration-300
        ${currentTheme === 'dark' ? 'dark-background shadow-lg' : 'bg-white shadow-md'}
    `;

    // Determine text color based on theme for NavLinks etc.
    const textColorClasses = currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700';
    const hoverTextColorClasses = currentTheme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600';


    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    <NavLink to="/">Prep<span className="text-blue-600 text-xl  ">Ai</span> </NavLink>
                </div>

                {/* Nav links (Desktop) */}
                <nav className="hidden md:flex gap-6">
                    {navLinks.map((link) => (
                        (link.protected && !isSignedIn) ? null : (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium ${hoverTextColorClasses} ${
                                        isActive ? "text-blue-600 dark:text-blue-400 underline underline-offset-4" : textColorClasses
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        )
                    ))}
                </nav>

                {/* Auth buttons & Theme Toggle (Desktop) */}
                <div className="hidden md:flex items-center gap-3">
                    {/* NEW: Theme Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleThemeToggle}
                        className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>

                    {isSignedIn ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar>
                                            <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                                            <AvatarFallback className="bg-blue-200 text-blue-800 font-medium">
                                                {userInitial}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-48 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600" align="end" forceMount>
                                    <DropdownMenuLabel className="text-blue-800 dark:text-blue-300">👋 {userNameDisplay}</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

                                    {!isUserVerified && (
                                        <DropdownMenuItem asChild>
                                            <NavLink to="/verify-email" onClick={() => setMenuOpen(false)} className="w-full">
                                                <Button variant="ghost" className="w-full justify-start text-blue-800 dark:text-blue-300 p-0 h-auto hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    Verify Account
                                                </Button>
                                            </NavLink>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <span className="flex items-center w-full justify-start">
                                            Sign Out <ArrowRight className="ml-auto h-4 w-4" />
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">
                                <Button variant="none" className="border-blue-600 text-md text-black hover:bg-blue-50 dark:border-blue-300 dark:text-blue-300 dark:hover:bg-gray-700 align-middle">
                                  <LogIn className="text-black "/>  Login
                                </Button>
                            </NavLink>
                            <NavLink to="/register">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                                   <UserPlus /> Sign Up
                                </Button>
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-gray-700 dark:text-gray-200"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-3 space-y-2 pb-4 border-t border-gray-100 dark:border-gray-700">
                     {/* NEW: Theme Toggle Button for mobile */}
                    <div className="flex justify-start px-4 pt-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleThemeToggle}
                            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>
                    </div>

                    <nav className="flex flex-col items-start gap-3 px-4 pt-3">
                        {navLinks.map((link) => (
                            (link.protected && !isSignedIn) ? null : (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-base font-medium ${hoverTextColorClasses} ${
                                            isActive ? "text-blue-600 dark:text-blue-400 underline" : textColorClasses
                                        }`
                                    }
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.name}
                                </NavLink>
                            )
                        ))}
                    </nav>

                    <div className="flex flex-col gap-2 px-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {isSignedIn ? (
                            <>
                                {!isUserVerified && (
                                    <NavLink to="/verify-email" onClick={() => setMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-blue-600 text-blue-600 dark:border-blue-300 dark:text-blue-300">Verify Account</Button>
                                    </NavLink>
                                )}
                                <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800" onClick={handleLogout}>Sign Out</Button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-300 dark:text-blue-300 dark:hover:bg-gray-700">
                                        Login
                                    </Button>
                                </NavLink>
                                <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Sign Up</Button>
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