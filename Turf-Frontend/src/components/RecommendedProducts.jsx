import { useEffect, useState } from "react"
import api from "../services/api"

export default function RecommendedProducts() {

    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await api.get("/api/product/recommendation")
            setProducts(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    if (products.length === 0) return null

    return (
        <section className="py-20 bg-gradient-to-b from-[#021a16] to-[#031a16] text-white">

            <div className="max-w-7xl mx-auto px-5 md:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold">
                            Sports <span className="text-green-400">Gear</span>
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Premium equipment for every sport
                        </p>
                    </div>

                    <button className="hidden md:block border border-green-500 text-green-400 px-6 py-2 rounded-full hover:bg-green-500 hover:text-white transition">
                        Shop All →
                    </button>
                </div>


                {/* Grid */}
                <div className="
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
gap-6 md:gap-8 lg:w-[110%]
        ">

                    {products.map(product => (

                        <div
                            key={product.id}
                            className="
                  w-full
      bg-white/5 backdrop-blur-xl
      border border-white/10
      rounded-3xl overflow-hidden
      hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10
      transition-all duration-300
      cursor-pointer group
      flex flex-col
      bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:scale-[1.03] transition duration-500"


                        >

                            {/* Top Panel */}
                            <div className="
                    h-40 sm:h-44 md:h-48
                    bg-gradient-to-br from-slate-800 to-slate-900
                    flex items-center justify-center
                    text-5xl
                    ">
                                {product.sportType === "FOOTBALL" && "⚽"}
                                {product.sportType === "CRICKET" && "🏏"}
                                {product.sportType === "BADMINTON" && "🏸"}
                                {product.sportType === "TENNIS" && "🎾"}
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-5 md:p-6 flex flex-col h-[180px]">

                                <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1">
                                    {product.name}
                                </h3>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex justify-between items-center mt-auto">

                                    <span className="text-green-400 font-bold text-lg">
                                        ₹{product.price}
                                    </span>

                                    <button className="
                            border border-green-500 
                            text-green-400 
                            px-4 py-1.5 
                            rounded-full 
                            text-sm sm:text-base
                            hover:bg-green-500 hover:text-white
                            transition
                            ">
                                        Buy Now
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    )
}