import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function Products() {

    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const [sport, setSport] = useState(
        searchParams.get("sport") || "ALL"
    )

    const sports = [
        "FOOTBALL",
        "CRICKET",
        "BADMINTON",
        "TENNIS",
        "BASKETBALL",
        "VOLLEYBALL"
    ]

    useEffect(() => {
        fetchProducts()
    }, [sport])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setProducts([])

            let res

            if (sport === "ALL") {
                res = await api.get("/api/product/all")
            } else {
                res = await api.get(`/api/product/sport/${sport}`)
            }

            setProducts(res.data)

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const changeSport = (s) => {
        setSport(s)

        if (s === "ALL") setSearchParams({})
        else setSearchParams({ sport: s })
    }

    const buyProduct = async (id) => {

        const token = localStorage.getItem("token")

        if (!token) {
            navigate("/login")
            return
        }

        try {
            await api.post("/api/product/buy", {
                productId: id,
                quantity: 1
            })

            alert("Product Purchased 🔥")

        } catch {
            alert("Purchase Failed")
        }
    }

    return (

        <div className="min-h-screen bg-gradient-to-b from-[#021a16] to-[#031a16] text-white pt-[90px]">

            {/* HEADER */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">

                    <h1 className="text-3xl md:text-4xl font-extrabold">
                        Sports <span className="text-green-400">Gear</span>
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Premium equipment for every sport
                    </p>

                    {/* FILTER */}
                    <div className="flex gap-3 overflow-x-auto mt-6 pb-2">

                        <button
                            onClick={() => changeSport("ALL")}
                            className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition
${sport === "ALL"
                                    ? "bg-green-500 text-white"
                                    : "bg-white/5 border border-white/10 text-gray-300 hover:bg-green-500 hover:text-white"}
`}
                        >
                            🏆 All Sports
                        </button>

                        {sports.map(s => (
                            <button
                                key={s}
                                onClick={() => changeSport(s)}
                                className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition
${sport === s
                                        ? "bg-green-500 text-white"
                                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-green-500 hover:text-white"}
`}
                            >
                                {s}
                            </button>
                        ))}

                    </div>

                </div>
            </div>

            {/* BODY */}
            <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">

                {loading && (
                    <div className="text-center py-24 text-gray-400 text-xl font-semibold">
                        Loading Products...
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-24 text-gray-400 text-xl font-semibold">
                        No Products Available
                    </div>
                )}

                {!loading && products.length > 0 && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {products.map(p => {

                            return (

                                <div
                                    key={p.id}
                                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:-translate-y-1 transition flex flex-col"
                                >

                                    {/* ⭐ IMAGE */}
                                    <img
                                        src={p.imageUrl || "/placeholder.png"}
                                        className="h-44 w-full object-cover"
                                    />

                                    {/* CONTENT */}
                                    <div className="p-5 flex flex-col flex-1">

                                        <p className="text-gray-400 text-sm mb-1">
                                            {p.sportType}
                                        </p>

                                        <h3 className="text-lg font-bold mb-2">
                                            {p.name}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {p.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between">

                                            <p className="text-green-400 font-bold text-xl">
                                                ₹{p.price}
                                            </p>

                                            <button
                                                onClick={() => buyProduct(p.id)}
                                                className="px-5 py-2 rounded-full border border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition font-semibold text-sm"
                                            >
                                                Buy
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            )
                        })}

                    </div>

                )}

            </div>

        </div>
    )
}