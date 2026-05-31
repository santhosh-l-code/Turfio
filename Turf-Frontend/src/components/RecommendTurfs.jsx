import { useEffect, useState } from "react"
import api from "../services/api"
import { MapPin, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function RecommendedTurfs() {

    const [turfs, setTurfs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchRecommended()
    }, [])

    const fetchRecommended = async () => {
        try {
            const res = await api.get("/api/player/recommend/turfs")
            setTurfs(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    if (turfs.length === 0) return null

    return (
        <section className="py-20 bg-gradient-to-b from-[#021a16] to-[#031a16] text-white">

            <div className="max-w-7xl mx-auto px-5 md:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold">
                            Featured <span className="text-green-400">Turfs</span>
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Top-rated turfs recommended for you
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/turfs")}
                        className="hidden md:block border border-green-500 text-green-400 px-6 py-2 rounded-full hover:bg-green-500 hover:text-white transition"
                    >
                        View All →
                    </button>
                </div>


                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
gap-6 md:gap-8 lg:w-[110%]
">     {turfs.map(turf => (

                    <div
                        key={turf.id}
                        className="   w-full
      bg-white/5 backdrop-blur-xl
      border border-white/10
      rounded-3xl overflow-hidden
      hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10
      transition-all duration-300
      cursor-pointer group
      flex flex-col
      bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:scale-[1.03] transition duration-500"
                    >

                        {/* Image */}
                        <div className="relative h-44">
                            <img
                                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018"
                                className="w-full h-full object-cover"
                            />

                            {/* Sport Badge */}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {turf.sportType}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">

                            <h3 className="text-lg font-bold mb-1">
                                {turf.name}
                            </h3>

                            <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
                                <MapPin size={14} /> {turf.location}
                            </p>

                            <div className="flex justify-between items-center mb-5">

                                <div className="text-yellow-400 text-sm font-semibold">
                                    ⭐ {turf.rating.toFixed(1)}
                                </div>

                                <div className="text-green-400 font-bold text-lg">
                                    ₹{turf.pricePerHour}
                                    <span className="text-gray-400 text-sm font-normal">
                                        /hr
                                    </span>
                                </div>

                            </div>

                            <button
                                onClick={() => navigate(`/turf/${turf.id}`)}
                                className="w-full border border-green-500 text-green-400 py-2 rounded-full hover:bg-green-500 hover:text-white transition font-semibold"
                            >
                                View Details →
                            </button>

                        </div>

                    </div>

                ))}

                </div>

            </div>

        </section>
    )
}