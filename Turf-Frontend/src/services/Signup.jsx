import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"
import { FaFutbol } from "react-icons/fa"

export default function Signup() {

    const navigate = useNavigate()

    const [role, setRole] = useState("PLAYER")

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSignup = async (e) => {
        e.preventDefault()

        try {
            await api.post("/api/auth/register", {
                ...form,
                role
            })

            alert("Account Created 🔥")
            navigate("/login")

        } catch {
            alert("Signup Failed")
        }
    }

    return (

        <div className="min-h-screen relative flex items-center justify-center text-white overflow-hidden px-4">

            {/* BACKGROUND */}
            <img
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b"
                className="absolute inset-0 w-full h-full object-cover scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-emerald-900/70"></div>

            {/* GLOW */}
            <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-green-500/20 blur-3xl rounded-full -top-40 -left-40"></div>
            <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-emerald-400/20 blur-3xl rounded-full bottom-0 right-0"></div>

            {/* CARD */}
            <form
                onSubmit={handleSignup}
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
                <div className="flex flex-col items-center mb-6">

                    <div className="bg-green-500/20 p-4 rounded-2xl mb-4">
                        <FaFutbol size={28} className="text-green-300" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-green-300">
                        Join Turfio
                    </h1>

                    <p className="text-gray-300 mt-2 text-sm md:text-base">
                        Create your account today
                    </p>

                </div>

                {/* ROLE TOGGLE */}
                <div className="flex mb-6 bg-white/10 rounded-xl p-1 border border-white/20">

                    <button
                        type="button"
                        onClick={() => setRole("PLAYER")}
                        className={`
                        flex-1 py-2 rounded-lg font-semibold transition
                        ${role === "PLAYER"
                                ? "bg-green-600 text-white"
                                : "text-gray-300"}
                        `}
                    >
                        👤 Player
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole("OWNER")}
                        className={`
                        flex-1 py-2 rounded-lg font-semibold transition
                        ${role === "OWNER"
                                ? "bg-green-600 text-white"
                                : "text-gray-300"}
                        `}
                    >
                        🏟 Turf Owner
                    </button>

                </div>

                {/* NAME */}
                <div className="mb-5">
                    <label className="text-sm text-gray-300 mb-2 block">
                        Full Name
                    </label>
                    <input
                        name="name"
                        placeholder="Arjun Sharma"
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-green-400 outline-none placeholder-gray-300"
                    />
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
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-green-400 outline-none placeholder-gray-300"
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
                        placeholder="Min. 6 characters"
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-green-400 outline-none placeholder-gray-300"
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
                    {role === "PLAYER"
                        ? "Create Player Account →"
                        : "Create Owner Account →"}
                </button>

                {/* LOGIN LINK */}
                <p className="text-center mt-6 text-gray-300 text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-green-400 font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </form>

        </div>
    )
}