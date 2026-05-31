import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import UpcomingBookings from "../components/UpcomingBookings"
import RecommendedTurfs from "../components/RecommendTurfs"
import RecommendedProducts from "../components/RecommendedProducts"

export default function Home() {

    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [selectedSport, setSelectedSport] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        setIsLoggedIn(!!token)
    }, [])

    const sports = [
        { name: "FOOTBALL", img: "https://images.unsplash.com/photo-1551958219-acbc608c6377", icon: "⚽" },
        { name: "CRICKET", img: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d", icon: "🏏" },
        { name: "BADMINTON", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea", icon: "🏸" },
        { name: "TENNIS", img: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3", icon: "🎾" },
        { name: "BASKETBALL", img: "https://images.unsplash.com/photo-1519861531473-9200262188bf", icon: "🏀" },
        { name: "VOLLEYBALL", img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d", icon: "🏐" }
    ]

    return (
        <div className="min-h-screen bg-[#021a16] text-white">

            {/* HERO */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

                < img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018"
                    className="absolute inset-0 w-full h-full object-cover object-[center_1%] brightness-50 saturate-75"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-emerald-900/70" />

                <div className="relative z-10 text-center max-w-5xl mx-auto px-5 pt-24">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-green-400/20 text-green-400 text-sm font-medium mb-8">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        India's Premier Sports Booking Platform
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
                        <span>Book Your </span>
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Favourite
                        </span>
                        <br />
                        <span>Turf </span>
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Instantly
                        </span>
                    </h1>

                    <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
                        Connect with premium sports turfs near you. Book in seconds, play without limits.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/turfs")}
                            className="px-8 py-4 rounded-2xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition shadow-xl shadow-green-500/30 hover:-translate-y-0.5"
                        >
                            ⚽ Explore Turfs
                        </button>

                        <button
                            onClick={() => navigate("/signup")}
                            className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition"
                        >
                            🏟️ Bring Your Turf Online
                        </button>
                    </div>

                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                        {["500+", "50K+", "4.8★"].map((val, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                    {val}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                    {i === 0 ? "Turfs" : i === 1 ? "Players" : "Rating"}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </section>

            {/* CHOOSE GAME */}
            <section className="py-20 max-w-7xl mx-auto px-5">

                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black mb-3">
                        Choose Your <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Game</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Pick your sport and find the perfect turf
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

                    {sports.map((sport) => (
                        <div
                            key={sport.name}
                            onClick={() => {
                                setSelectedSport(sport.name)
                                navigate(`/turfs?sport=${sport.name}`)
                            }}
                            className="relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer group hover:-translate-y-1 transition duration-300"
                        >

                            <img src={sport.img} className="w-full h-full object-cover group-hover:scale-110 transition" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xl font-black">
                                <span className="text-2xl">{sport.icon}</span>
                                {sport.name.charAt(0) + sport.name.slice(1).toLowerCase()}
                            </div>

                        </div>
                    ))}

                </div>

            </section>

            {/* PERSONALIZED */}
            {isLoggedIn && <RecommendedTurfs />}
            {isLoggedIn && <RecommendedProducts />}

            {/* CTA */}
            {!isLoggedIn && (
                <section className="py-24">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <div className="bg-white/5 backdrop-blur border border-green-400/20 rounded-3xl p-10">
                            <h2 className="text-4xl font-black mb-4">
                                Ready to <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Play?</span>
                            </h2>
                            <p className="text-gray-400 mb-8">
                                Join thousands of players booking their favourite sports turfs on TurfHub
                            </p>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-10 py-4 rounded-2xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition shadow-xl shadow-green-500/30"
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER */}
            <footer className="border-t border-white/10 py-8 mt-10">
                <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-black text-xl">
                        ⚽ <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">TurfHub</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        © 2025 TurfHub. All rights reserved.
                    </p>
                </div>
            </footer>

        </div>
    )
}