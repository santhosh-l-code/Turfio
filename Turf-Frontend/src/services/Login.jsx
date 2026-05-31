import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import api from "../services/api"
import { FaFutbol } from "react-icons/fa"

export default function Login() {

    const location = useLocation()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleLogin = async e => {
        e.preventDefault()

        try {
            const res = await api.post("/api/auth/login", form)

            localStorage.setItem("token", res.data.token)
            localStorage.setItem("username", res.data.user.username)
            localStorage.setItem("role", res.data.user.role)
            localStorage.setItem("userId", res.data.user.id)

            if (res.data.user.role == "PLAYER") {
                const redirectPath = location.state?.from || "/dashboard"
                navigate(redirectPath)
            } else {
                const redirectPath = location.state?.from || "/owner-dashboard"
                navigate(redirectPath)
            }


        } catch {
            alert("Invalid Credentials")
        }
    }

    return (

        <div className="min-h-screen relative flex items-center justify-center text-white overflow-hidden px-4">

            {/* BACKGROUND IMAGE */}
            <img
                src="https://images.unsplash.com/photo-1517649763962-0c623066013a"
                className="absolute inset-0 w-full h-full object-cover scale-110"
            />

            {/* DARK GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-emerald-900/70"></div>

            {/* GLOW BLOBS */}
            <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-green-500/20 blur-3xl rounded-full -top-40 -left-40"></div>
            <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-emerald-400/20 blur-3xl rounded-full bottom-0 right-0"></div>

            {/* CARD */}
            <form
                onSubmit={handleLogin}
                className="
                relative z-10
                backdrop-blur-2xl
                bg-white/10
                border border-white/20
                shadow-2xl
                rounded-3xl
                w-full
                max-w-md
                p-8
                sm:p-10
                md:p-12
                "
            >

                {/* LOGO */}
                <div
                    className="flex flex-col items-center mb-6">

                    <div className="bg-green-500/20 p-4 rounded-2xl mb-4">
                        <FaFutbol size={28} className="text-green-300" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-green-300">
                        Turfio
                    </h1>

                    <p className="text-gray-300 mt-2 text-sm md:text-base">
                        Welcome back, player!
                    </p>

                </div>

                {/* EMAIL */}
                <div className="mb-5">
                    <label className="text-sm text-gray-300 mb-2 block">
                        Email
                    </label>
                    <input
                        name="email"
                        placeholder="your@email.com"
                        onChange={handleChange}
                        className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        bg-white/10
                        border border-white/20
                        focus:border-green-400
                        outline-none
                        placeholder-gray-300
                        "
                    />
                </div>

                {/* PASSWORD */}
                <div className="mb-7">
                    <label className="text-sm text-gray-300 mb-2 block">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        bg-white/10
                        border border-white/20
                        focus:border-green-400
                        outline-none
                        placeholder-gray-300
                        "
                    />
                </div>

                {/* BUTTON */}
                <button
                    className="
                    w-full
                    bg-green-600
                    hover:bg-green-500
                    transition
                    py-3.5
                    rounded-xl
                    font-bold
                    text-lg
                    shadow-lg
                    "
                >
                    Login →
                </button>

                {/* SIGNUP */}
                <p className="text-center mt-6 text-gray-300 text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-green-400 font-semibold hover:underline"
                    >
                        Sign up free
                    </Link>
                </p>

            </form>

        </div>
    )
}