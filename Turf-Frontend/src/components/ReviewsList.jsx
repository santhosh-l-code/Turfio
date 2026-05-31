import { useEffect, useState } from "react"
import api from "../services/api"

export default function ReviewsList({ turfId }) {

    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReviews()
    }, [turfId])

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/api/owner/turf/${turfId}/reviews`)
            setReviews(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p className="mt-10">Loading reviews...</p>

    if (reviews.length === 0)
        return <p className="mt-10 text-gray-500">No reviews yet</p>

    return (

        <div className="mt-12">

            <h3 className="text-2xl font-bold mb-6">
                Player Reviews ⭐
            </h3>

            <div className="space-y-4">

                {reviews.map(r => (

                    <div
                        key={r.id}
                        className="bg-white p-5 rounded-2xl shadow"
                    >

                        <div className="flex justify-between mb-2">

                            <span className="font-semibold">
                                {r.playerName}
                            </span>

                            <span className="bg-yellow-400 px-3 py-1 rounded-full font-bold text-sm">
                                ⭐ {r.generatedRating.toFixed(1)}
                            </span>

                        </div>

                        <p className="text-gray-600">
                            {r.comment}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    )
}