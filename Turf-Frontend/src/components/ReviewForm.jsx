import { useState } from "react"
import api from "../services/api"

export default function ReviewForm({ turfId, onSuccess }) {

    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const submitReview = async () => {

        if (!comment.trim()) return

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {

            const res = await api.post("/api/review/add", {
                turfId,
                comment
            })

            setSuccess(res.data)
            setComment("")
            onSuccess()

        } catch (err) {

            setError(
                err.response?.data ||
                "You can review only once or after playing."
            )

        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="bg-white rounded-2xl shadow p-6 mt-12">

            <h3 className="text-2xl font-bold mb-4">
                Share Your Experience ⭐
            </h3>

            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="How was the turf? Lighting? Grass? Cleanliness?"
                className="w-full border rounded-xl p-4 mb-4"
                rows={4}
            />

            {error && (
                <p className="text-red-500 mb-3">{error}</p>
            )}

            {success && (
                <p className="text-green-600 mb-3 font-semibold">
                    {success}
                </p>
            )}

            <button
                onClick={submitReview}
                disabled={loading}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition"
            >
                {loading ? "Submitting..." : "Submit Review"}
            </button>

        </div>
    )
}