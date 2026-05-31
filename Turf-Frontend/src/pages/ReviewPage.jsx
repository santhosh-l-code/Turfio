import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "../services/api"

export default function ReviewPage() {

    const { id } = useParams()
    const navigate = useNavigate()

    console.log(id)

    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState("")

    const submitReview = async () => {

        if (!comment) {
            alert("Write review")
            return
        }

        try {

            setLoading(true)

            const res = await api.post("/api/review/add", {
                turfId: Number(id),
                comment
            })

            setMsg(res.data)

            setTimeout(() => {
                navigate("/my-bookings")
            }, 2000)

        } catch (err) {

            const message =
                err?.response?.data ||
                "Review failed"

            setMsg(message)

        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="min-h-screen bg-gray-50 flex justify-center items-center">

            <div className="bg-white p-10 rounded-3xl shadow-xl w-[500px]">

                <h1 className="text-3xl font-bold mb-6">
                    Write Turf Review ⭐
                </h1>

                <textarea
                    className="border p-4 rounded-2xl w-full h-40 mb-6"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    onClick={submitReview}
                    disabled={loading}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold w-full"
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </button>

                {msg && (
                    <p className="mt-4 text-center font-semibold text-green-600">
                        {msg}
                    </p>
                )}

            </div>

        </div>
    )
}