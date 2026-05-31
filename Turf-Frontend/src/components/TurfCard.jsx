import { useNavigate } from "react-router-dom"

const sportColors = {
    FOOTBALL: "from-green-900 to-green-700",
    CRICKET: "from-amber-900 to-amber-700",
    BADMINTON: "from-blue-900 to-blue-700",
    TENNIS: "from-yellow-900 to-yellow-700",
    BASKETBALL: "from-orange-900 to-orange-700",
    VOLLEYBALL: "from-purple-900 to-purple-700",
}

const sportEmojis = {
    FOOTBALL: "⚽",
    CRICKET: "🏏",
    BADMINTON: "🏸",
    TENNIS: "🎾",
    BASKETBALL: "🏀",
    VOLLEYBALL: "🏐",
}

export default function TurfCard({ turf }) {

    const navigate = useNavigate()

    const color =
        sportColors[turf.sportType] || "from-green-900 to-green-700"

    const emoji =
        sportEmojis[turf.sportType] || "🏟️"

    return (

        <div
            onClick={() => navigate(`/turf/${turf.id}`)}
            className="
      w-full
      bg-white/5 backdrop-blur-xl
      border border-white/10
      rounded-3xl overflow-hidden
      hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10
      transition-all duration-300
      cursor-pointer group
      flex flex-col
      "
        >

            {/* IMAGE / GRADIENT HEADER */}
            <div
                className={`
        relative h-44
        bg-gradient-to-br ${color}
        flex items-center justify-center
        overflow-hidden
        `}
            >

                {turf.imageUrl ? (
                    <img
                        src={turf.imageUrl}
                        alt={turf.name}
                        className="
            w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500
            "
                    />
                ) : (
                    <span className="text-6xl opacity-30">{emoji}</span>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* SPORT BADGE */}
                <div className="absolute bottom-3 left-3">
                    <span className="
          px-2.5 py-1 rounded-lg
          bg-black/40 backdrop-blur
          text-xs font-semibold text-white
          flex items-center gap-1
          ">
                        {emoji} {turf.sportType}
                    </span>
                </div>

            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-3 flex flex-col flex-1">

                <div>
                    <h3 className="font-bold text-lg leading-tight">
                        {turf.name}
                    </h3>

                    <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                        📍 {turf.location}
                    </p>
                </div>

                {/* RATING + PRICE */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                        ⭐ {turf.rating?.toFixed(1)}
                        <span className="text-gray-400 text-xs">
                            ({turf.reviewCount || 0})
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="text-lg font-bold text-green-400">
                            ₹{turf.pricePerHour}
                        </span>
                        <span className="text-xs text-gray-400"> /hr</span>
                    </div>

                </div>

                {/* BUTTON ALWAYS BOTTOM */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/turf/${turf.id}`)
                    }}
                    className="
          mt-auto
          w-full py-2.5 rounded-xl
          bg-green-500/10 border border-green-500/20
          text-green-400 text-sm font-semibold
          hover:bg-green-500 hover:text-white
          transition-all duration-200
          "
                >
                    View Details →
                </button>

            </div>

        </div>
    )
}