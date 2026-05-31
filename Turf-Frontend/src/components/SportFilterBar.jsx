import { useNavigate, useLocation } from "react-router-dom"

export default function SportFilterBar() {

    const navigate = useNavigate()
    const location = useLocation()

    const sports = [
        "FOOTBALL",
        "CRICKET",
        "BADMINTON",
        "TENNIS",
        "BASKETBALL",
        "VOLLEYBALL"
    ]

    const params = new URLSearchParams(location.search)
    const activeSport = params.get("sport")

    return (
        <div className="sticky top-[72px] z-40 bg-white border-b">

            <div className="max-w-7xl mx-auto px-8 py-3">

                <div className="flex gap-4 overflow-x-auto">

                    {sports.map(sport => (

                        <button
                            key={sport}
                            onClick={() => navigate(`/turfs?sport=${sport}`)}
                            className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition
                            
                            ${activeSport === sport
                                    ? "bg-green-600 text-white shadow"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }
                            
                            `}
                        >
                            {sport}
                        </button>

                    ))}

                </div>

            </div>

        </div>
    )
}