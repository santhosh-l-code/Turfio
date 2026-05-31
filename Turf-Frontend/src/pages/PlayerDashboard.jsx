import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import TurfCard from "../components/TurfCard"

export default function PlayerDashboard() {

    const [upcoming, setUpcoming] = useState([])
    const [turfs, setTurfs] = useState([])
    const [products, setProducts] = useState([])

    const navigate = useNavigate()
    const username = localStorage.getItem("username") || "Player"

    useEffect(() => {
        fetchDashboard()
    }, [])

    const fetchDashboard = async () => {
        try {
            const bookings = await api.get("/api/turfSlot/my-bookings")

            const today = new Date()

            const upcomingList = bookings.data
                .filter(b => new Date(b.bookingDate) >= today)
                .sort((a, b) =>
                    new Date(a.bookingDate) - new Date(b.bookingDate)
                )
                .slice(0, 2)

            setUpcoming(upcomingList)


            const turfRes = await api.get("/api/player/recommend/turfs")
            setTurfs(turfRes.data)

            const gearRes = await api.get("/api/product/recommendation")
            setProducts(gearRes.data)

        } catch (e) {
            console.log(e)
        }
    }

    const sports = [
        "FOOTBALL",
        "CRICKET",
        "BADMINTON",
        "TENNIS",
        "BASKETBALL",
        "VOLLEYBALL"
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#021a16] via-[#031f18] to-[#021a16] text-white pt-[90px]">

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 pb-20">

                {/* Greeting */}
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold">
                        Hey, <span className="text-green-400">{username}</span> 👋
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Ready to play today?
                    </p>
                </div>

                {/* Upcoming */}
                {upcoming.length > 0 && (

                    <section className="space-y-6">

                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl md:text-3xl font-bold">
                                Upcoming <span className="text-green-400">Bookings</span>
                            </h2>

                            <button
                                onClick={() => navigate("/my-bookings")}
                                className="text-green-400 hover:underline"
                            >
                                View all →
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">

                            {upcoming.map(b => (

                                <div
                                    key={b.bookingId}
                                    onClick={() => navigate(`/turf/${b.turfId}`)}
                                    className="
                cursor-pointer
                bg-gradient-to-r from-green-900/40 to-black/40
                border border-white/10
                rounded-3xl
                overflow-hidden
                hover:scale-[1.02]
                transition
                backdrop-blur-xl
                "
                                >

                                    <div className="flex">

                                        <div className="w-28 bg-green-800/70 flex items-center justify-center text-4xl">
                                            ⚽
                                        </div>

                                        <div className="flex-1 p-5 space-y-2">

                                            <h3 className="font-bold text-lg">
                                                {b.turfName}
                                            </h3>

                                            <p className="text-gray-400 text-sm">
                                                📍 {b.location}
                                            </p>

                                            <div className="flex gap-4 text-sm text-gray-300">
                                                <span>📅 {b.bookingDate}</span>
                                                <span>⏰ {b.startTime}-{b.endTime}</span>
                                                <span className="text-green-400 font-bold">
                                                    ₹800
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>

                )}

                {/* Quick Navigation */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Quick <span className="text-green-400">Navigation</span>
                    </h2>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {sports.map(s => (
                            <button
                                key={s}
                                onClick={() => navigate(`/turfs?sport=${s}`)}
                                className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 whitespace-nowrap hover:bg-green-500 hover:text-white transition font-semibold"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Recommended Turfs */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">
                                AI Recommended <span className="text-green-400">Turfs</span>
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Based on your sport preferences
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/turfs")}
                            className="text-green-400 hover:underline"
                        >
                            View all →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {turfs.map(t => (
                            <TurfCard key={t.id} turf={t} />
                        ))}
                    </div>
                </section>

                {/* Recommended Gear */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">
                                AI Recommended <span className="text-green-400">Gear</span>
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Equipment for your game
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/products")}
                            className="text-green-400 hover:underline"
                        >
                            Shop all →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(p => (
                            <div
                                key={p.id}
                                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.03] transition"
                            >
                                <div className="h-36 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-4xl">
                                    ⚽
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold mb-1 line-clamp-1">
                                        {p.name}
                                    </h3>

                                    <p className="text-green-400 font-bold">
                                        ₹{p.price}
                                    </p>

                                    <button
                                        className="mt-3 w-full border border-green-500 text-green-400 py-2 rounded-xl hover:bg-green-500 hover:text-white transition"
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    )
}