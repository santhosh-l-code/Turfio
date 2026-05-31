import { useEffect, useState } from "react"
import api from "../services/api"
import { useLocation, useNavigate } from "react-router-dom"
import TurfCard from "../components/TurfCard"

export default function Turfs() {

    const [turfs, setTurfs] = useState([])
    const [search, setSearch] = useState("")
    const location = useLocation()
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search)
    const activeSport = params.get("sport") || "ALL"

    const sports = [
        "ALL", "FOOTBALL", "CRICKET", "BADMINTON", "TENNIS", "BASKETBALL", "VOLLEYBALL"
    ]

    useEffect(() => {
        fetchTurfs()
    }, [location.search])

    const fetchTurfs = async () => {
        const params = new URLSearchParams(location.search)
        const sport = params.get("sport")

        try {
            let res
            if (sport) res = await api.get(`/api/turf/game/${sport}`)
            else res = await api.get("/api/turf/allTurfs")

            setTurfs(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleFilter = (sport) => {
        if (sport === "ALL") navigate("/turfs")
        else navigate(`/turfs?sport=${sport}`)
    }

    return (
        <div className="pt-[90px] min-h-screen bg-[#021a16] text-white">

            {/* HEADER */}
            <div className="border-b border-white/10">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
                        Find Your <span className="text-green-400">Perfect Turf</span>
                    </h1>

                    <p className="text-gray-400 mb-6 text-sm sm:text-base">
                        Discover and book sports turfs near you
                    </p>

                    {/* SEARCH */}
                    <div className="max-w-xl mb-6">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="🔎 Search by name or location..."
                            className="
                            w-full px-4 sm:px-5 py-3 rounded-xl 
                            bg-white/5 border border-white/10 
                            focus:border-green-400 outline-none 
                            transition text-sm sm:text-base
                            "
                        />
                    </div>

                    {/* FILTERS */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

                        {sports.map(s => {

                            const isActive = activeSport === s

                            return (
                                <button
                                    key={s}
                                    onClick={() => handleFilter(s)}
                                    className={`
            whitespace-nowrap px-4 py-2 rounded-full 
            border transition text-sm font-semibold
            ${isActive
                                            ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20"
                                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-green-500 hover:text-white"
                                        }
            `}
                                >
                                    {s}
                                </button>
                            )

                        })}

                    </div>

                </div>

            </div>

            {/* LIST */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">

                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                    {turfs.length} turfs found
                </p>

                <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-6
                sm:gap-7
                md:gap-8
                ">

                    {turfs
                        .filter(t =>
                            t.name.toLowerCase().includes(search.toLowerCase()) ||
                            t.location.toLowerCase().includes(search.toLowerCase())
                        )
                        .map(turf => (
                            <TurfCard key={turf.id} turf={turf} />
                        ))
                    }

                </div>

            </div>

        </div>
    )
}