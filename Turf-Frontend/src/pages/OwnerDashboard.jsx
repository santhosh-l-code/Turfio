import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import { Building2, CalendarCheck, Star, IndianRupee } from "lucide-react"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from "recharts"

export default function OwnerDashboard() {

    const navigate = useNavigate()
    const ownerName = localStorage.getItem("username")

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboard()
    }, [])

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/api/owner/dashboard")
            setData(res.data)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    if (loading)
        return (
            <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center">
                <div className="text-5xl animate-spin">⚽</div>
            </div>
        )

    const statCards = [
        {
            icon: <Building2 size={24} />,
            value: data.totalTurfs,
            label: "Total Turfs",
            gradient: "from-emerald-950 to-green-900/40",
            iconColor: "text-emerald-400"
        },
        {
            icon: <CalendarCheck size={24} />,
            value: data.totalBookings,
            label: "Total Bookings",
            gradient: "from-blue-950 to-blue-900/40",
            iconColor: "text-blue-400"
        },
        {
            icon: <Star size={24} />,
            value: `${data.avgRating?.toFixed(1)} ★`,
            label: "Avg Rating",
            gradient: "from-yellow-950 to-yellow-900/40",
            iconColor: "text-yellow-400"
        },
        {
            icon: <IndianRupee size={24} />,
            value: `₹${data.totalRevenue?.toLocaleString()}`,
            label: "Total Revenue",
            gradient: "from-purple-950 to-purple-900/40",
            iconColor: "text-purple-400"
        },
    ]

    return (
        <div
            className="min-h-screen text-white pt-20"
            style={{
                background: "radial-gradient(ellipse at top, #0d2818 0%, #080d0b 40%, #050807 100%)",
            }}
        >
            {/* subtle grid overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
                    backgroundSize: "60px 60px"
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">

                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                            Owner{" "}
                            <span
                                className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
                            >
                                Dashboard
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Welcome back,{" "}
                            <span className="text-gray-300 font-medium">{ownerName}</span>
                        </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => navigate("/owner/turfs")}
                            className="bg-green-500 hover:bg-green-400 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-500/25 transition-all hover:-translate-y-0.5"
                        >
                            + Add Turf
                        </button>
                        <button
                            onClick={() => navigate("/owner/products")}
                            className="px-5 py-2.5 rounded-xl font-bold text-sm border border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/15 transition-all hover:-translate-y-0.5"
                        >
                            + Add Product
                        </button>
                    </div>

                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map(card => (
                        <div
                            key={card.label}
                            className={`
                                bg-gradient-to-br ${card.gradient}
                                border border-white/[0.06]
                                rounded-3xl p-5
                                backdrop-blur-xl
                                shadow-xl shadow-black/40
                            `}
                        >
                            <div className={`${card.iconColor} mb-3`}>{card.icon}</div>
                            <div className="text-2xl font-black text-white">{card.value}</div>
                            <div className="text-gray-500 text-xs mt-1">{card.label}</div>
                        </div>
                    ))}
                </div>

                {/* MONTHLY REVENUE CHART */}
                {data.monthlyRevenue?.length > 0 && (
                    <div className="
                        bg-white/[0.03] border border-white/[0.06]
                        rounded-3xl p-6 sm:p-8
                        backdrop-blur-xl shadow-xl shadow-black/40
                        mb-8
                    ">
                        <h2 className="text-xl font-black mb-6 text-white">Monthly Revenue</h2>
                        <div className="h-48 sm:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.monthlyRevenue}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.04)"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: "#6b7280", fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: "#6b7280", fontSize: 11 }}
                                        tickFormatter={v => `₹${v}`}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: "rgba(8,13,11,0.95)",
                                            border: "1px solid rgba(34,197,94,0.2)",
                                            borderRadius: "12px",
                                            color: "#f3f4f6",
                                            fontSize: "13px"
                                        }}
                                        cursor={{ fill: "rgba(34,197,94,0.05)" }}
                                        formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#22c55e"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* ACTION CARDS */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { path: "/owner/turfs", icon: "🏟️", title: "Manage Turfs", desc: "Add, edit, delete your turfs" },
                        { path: "/owner/products", icon: "🛒", title: "Manage Products", desc: "Manage your sports equipment" },
                        { path: "/owner/bookings", icon: "📊", title: "Booking Insights", desc: "View bookings and analytics" },
                    ].map(item => (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="
                                bg-white/[0.03] border border-white/[0.06]
                                hover:border-green-500/30 hover:bg-white/[0.06]
                                hover:-translate-y-1
                                rounded-3xl p-5
                                cursor-pointer transition-all duration-200
                                backdrop-blur-xl shadow-xl shadow-black/30
                            "
                        >
                            <span className="text-3xl">{item.icon}</span>
                            <h3 className="font-bold mt-3 text-base text-white">{item.title}</h3>
                            <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* RECENT BOOKINGS */}
                {data.recentBookings?.length > 0 && (
                    <div className="
                        bg-white/[0.03] border border-white/[0.06]
                        rounded-3xl p-6 sm:p-8
                        backdrop-blur-xl shadow-xl shadow-black/40
                    ">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-white">Recent Bookings</h2>
                            <button
                                onClick={() => navigate("/owner/bookings")}
                                className="text-green-400 hover:text-green-300 hover:underline text-sm transition"
                            >
                                View all →
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[560px]">

                                <thead>
                                    <tr className="text-left text-gray-500 text-xs border-b border-white/[0.06]">
                                        <th className="pb-3 font-semibold">Turf</th>
                                        <th className="pb-3 font-semibold">Date</th>
                                        <th className="pb-3 font-semibold">Time</th>
                                        <th className="pb-3 font-semibold">Player</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.recentBookings.map((b, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-white/[0.04] hover:bg-white/[0.02] transition"
                                        >
                                            <td className="py-4 font-semibold text-white">{b.turfName}</td>
                                            <td className="py-4 text-gray-400">{b.bookingDate}</td>
                                            <td className="py-4 text-gray-400">{b.startTime} - {b.endTime}</td>
                                            <td className="py-4">
                                                <span className="text-green-400 font-semibold">{b.playerName}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                    </div>
                )}

            </div>
        </div>
    )
}