import { useEffect, useState } from "react"
import api from "../services/api"
import { MapPin, Calendar, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function UpcomingBookings() {

    const [bookings, setBookings] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const res = await api.get("/api/turfSlot/my-bookings")


            const sorted = res.data.sort((a, b) => {
                return new Date(a.bookingDate + " " + a.startTime)
                    - new Date(b.bookingDate + " " + b.startTime)
            })


            setBookings(sorted.slice(0, 2))

        } catch (err) {
            console.log(err)
        }
    }

    if (bookings.length === 0) return null

    return (
        <section className=" max-w-7xl mx-auto px-12 py-12">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    Upcoming Bookings
                </h2>

                <button
                    onClick={() => navigate("/my-bookings")}
                    className="text-green-600 font-semibold hover:underline"
                >
                    View All →
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {bookings.map(b => (

                    <div
                        key={b.bookingId}
                        className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
                    >

                        <div className="flex justify-between items-start mb-3">

                            <h3 className="text-lg font-bold">
                                {b.turfName}
                            </h3>

                            <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-semibold">
                                {b.sportType}
                            </span>

                        </div>

                        <div className="text-gray-500 flex items-center gap-2 mb-2">
                            <MapPin size={16} />
                            {b.location}
                        </div>

                        <div className="flex gap-6 text-gray-500 text-sm">

                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {b.bookingDate}
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                {b.startTime} - {b.endTime}
                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    )
}