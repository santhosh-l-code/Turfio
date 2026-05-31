import { NavLink, useNavigate, useLocation } from "react-router-dom"
import {
    Home,
    ShoppingBag,
    CalendarCheck,
    LogOut,
    Info,
    Menu,
    X,
    LayoutDashboard
} from "lucide-react"
import { FaFutbol } from "react-icons/fa"
import { useEffect, useState } from "react"

export default function Navbar() {

    const navigate = useNavigate()
    const location = useLocation()

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        const storedUsername = localStorage.getItem("username")
        const storedRole = localStorage.getItem("role")
        setIsLoggedIn(!!token)
        setUsername(storedUsername || "")
        setRole(storedRole || "")
    }, [location])

    const handleLogout = () => {
        localStorage.clear()
        setIsLoggedIn(false)
        setMobileMenu(false)
        navigate("/")
    }

    const goHome = () => {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem("role")
        if (!token) navigate("/")
        else if (role === "OWNER") navigate("/owner-dashboard")
        else navigate("/dashboard")
    }

    const navBase =
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"

    const navActive =
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-500/20 text-green-400 transition-all duration-200"

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div onClick={goHome} className="flex items-center gap-2 cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <FaFutbol className="text-green-400" size={16} />
                        </div>
                        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                            Turfio
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">

                        {role !== "OWNER" && (
                            <NavLink to="/" className={({ isActive }) => isActive ? navActive : navBase}>
                                <Home size={15} /> Home
                            </NavLink>
                        )}

                        {isLoggedIn && role === "PLAYER" && (
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? navActive : navBase}>
                                <LayoutDashboard size={15} /> Dashboard
                            </NavLink>
                        )}

                        {isLoggedIn && role === "OWNER" && (
                            <NavLink to="/owner-dashboard" className={({ isActive }) => isActive ? navActive : navBase}>
                                <LayoutDashboard size={15} /> Owner Dashboard
                            </NavLink>
                        )}

                        {role === "PLAYER" && (
                            <button
                                onClick={() => {
                                    navigate("/turfs")
                                    setTimeout(() => {
                                        const el = document.getElementById("choose-game")
                                        if (el) el.scrollIntoView({ behavior: "smooth" })
                                    }, 200)
                                }}
                                className={navBase}
                            >
                                ⚽ Book Turf
                            </button>
                        )}

                        {role === "PLAYER" && (
                            <NavLink to="/products" className={({ isActive }) => isActive ? navActive : navBase}>
                                <ShoppingBag size={15} /> Products
                            </NavLink>
                        )}

                        {role === "OWNER" && (
                            <NavLink to="/owner/products" className={({ isActive }) => isActive ? navActive : navBase}>
                                <ShoppingBag size={15} /> My Products
                            </NavLink>
                        )}

                        {isLoggedIn && role === "PLAYER" && (
                            <NavLink to="/my-bookings" className={({ isActive }) => isActive ? navActive : navBase}>
                                <CalendarCheck size={15} /> My Bookings
                            </NavLink>
                        )}

                        <button
                            onClick={() => {
                                navigate("/")
                                setTimeout(() => {
                                    const el = document.getElementById("about")
                                    if (el) el.scrollIntoView({ behavior: "smooth" })
                                }, 200)
                            }}
                            className={navBase}
                        >
                            <Info size={15} /> About
                        </button>

                    </div>

                    {/* Auth - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                        <span className="text-xs font-bold text-green-400">
                                            {username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-400 max-w-[100px] truncate">
                                        {username.charAt(0).toUpperCase() + username.slice(1)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-white/20 text-sm text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-4 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-all duration-200"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-400 transition-all duration-200 shadow-lg shadow-green-500/20"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        {mobileMenu ? <X size={20} /> : <Menu size={20} />}
                    </button>

                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="md:hidden backdrop-blur-md bg-black/40 border-t border-white/10">
                    <div className="px-4 py-4 flex flex-col gap-1">

                        <NavLink to="/" onClick={() => setMobileMenu(false)}
                            className={({ isActive }) => isActive ? navActive : navBase}>
                            <Home size={15} /> Home
                        </NavLink>

                        {isLoggedIn && role === "PLAYER" && (
                            <NavLink to="/dashboard" onClick={() => setMobileMenu(false)}
                                className={({ isActive }) => isActive ? navActive : navBase}>
                                <LayoutDashboard size={15} /> Dashboard
                            </NavLink>
                        )}

                        {isLoggedIn && role === "OWNER" && (
                            <NavLink to="/owner-dashboard" onClick={() => setMobileMenu(false)}
                                className={({ isActive }) => isActive ? navActive : navBase}>
                                <LayoutDashboard size={15} /> Owner Dashboard
                            </NavLink>
                        )}

                        {role === "PLAYER" && (
                            <NavLink to="/products" onClick={() => setMobileMenu(false)}
                                className={({ isActive }) => isActive ? navActive : navBase}>
                                <ShoppingBag size={15} /> Products
                            </NavLink>
                        )}

                        {role === "OWNER" && (
                            <NavLink to="/owner/products" onClick={() => setMobileMenu(false)}
                                className={({ isActive }) => isActive ? navActive : navBase}>
                                <ShoppingBag size={15} /> My Products
                            </NavLink>
                        )}

                        {isLoggedIn && role === "PLAYER" && (
                            <NavLink to="/my-bookings" onClick={() => setMobileMenu(false)}
                                className={({ isActive }) => isActive ? navActive : navBase}>
                                <CalendarCheck size={15} /> My Bookings
                            </NavLink>
                        )}

                        <NavLink to="/" onClick={() => setMobileMenu(false)} className={navBase}>
                            <Info size={15} /> About
                        </NavLink>

                        <div className="mt-3 pt-3 border-t border-white/10">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => { navigate("/login"); setMobileMenu(false) }}
                                        className="px-3 py-2.5 rounded-lg text-sm text-center text-gray-400 border border-white/20"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => { navigate("/signup"); setMobileMenu(false) }}
                                        className="px-3 py-2.5 rounded-xl text-sm text-center bg-green-500 text-white font-semibold hover:bg-green-400 transition-all duration-200"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </nav>
    )
}