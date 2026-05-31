import { useEffect, useState } from "react"
import api from "../services/api"
import { MapPin, Calendar, Clock, XCircle, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import BookingCard from "../components/BookingCard"

export default function MyBookings() {

    const [reviewToast, setReviewToast] = useState({})
    const [todayBookings, setTodayBookings] = useState([])
    const [upcomingBookings, setUpcomingBookings] = useState([])
    const [pastBookings, setPastBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")
    const [openReview, setOpenReview] = useState(null)
    const [reviewedTurfs, setReviewedTurfs] = useState([])

    const [openReviewId, setOpenReviewId] = useState(null)
    const [reviewText, setReviewText] = useState("")
    const currentUserId = Number(localStorage.getItem("userId"))

    const navigate = useNavigate()

    useEffect(() => {
        fetchBookings()
    }, [])

    const submitReview = async (turfId) => {

        try {

            await api.post("/api/review/add", {
                turfId,
                comment: reviewText
            })

            alert("Review Added 🔥")

            // ⭐ LOCK REVIEW FRONTEND
            setReviewedTurfs(prev => [...prev, turfId])

            setOpenReviewId(null)
            setReviewText("")

        } catch (err) {

            const errorMessage = err?.response?.data

            if (errorMessage?.includes("already reviewed")) {

                // show toast only for this turf
                setReviewToast(prev => ({
                    ...prev,
                    [turfId]: "You already reviewed this turf ⭐"
                }))

                // lock review
                setReviewedTurfs(prev => [...prev, turfId])

                // auto remove toast after 3 sec
                setTimeout(() => {

                    setReviewToast(prev => ({
                        ...prev,
                        [turfId]: null
                    }))

                }, 3000)

            } else {

                setReviewToast(prev => ({
                    ...prev,
                    [turfId]: "You Already Submitted Your Review"
                }))

            }
        }
    }

    const fetchBookings = async () => {
        try {
            const res = await api.get("/api/turfSlot/my-bookings")

            const today = new Date().toDateString()

            const todayList = []
            const upcomingList = []
            const pastList = []

            const now = new Date()

            res.data.forEach(b => {

                const bookingDateTime = new Date(
                    `${b.bookingDate}T${b.startTime}`
                )

                if (bookingDateTime > now) {
                    upcomingList.push(b)
                } else {
                    pastList.push(b)
                }

            })

            setTodayBookings(todayList)
            setUpcomingBookings(upcomingList)
            setPastBookings(pastList)

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const cancelBooking = async (id) => {
        try {
            await api.delete(`/api/turfSlot/cancel/${id}`)
            alert("Booking Cancelled")
            fetchBookings()
        } catch (err) {
            const msg = err?.response?.data || "Cancellation not allowed"
            setErrorMsg(msg)
        }
    }

    // const BookingCard = ({ b, isPast }) => (

    //     <div className="
    //     rounded-3xl overflow-hidden
    //     border border-white/10
    //     bg-gradient-to-br from-white/5 to-white/10
    //     backdrop-blur-xl
    //     hover:scale-[1.01]
    //     transition
    //     ">

    //         <div className="flex flex-col md:flex-row">

    //             {/* LEFT SPORT ICON */}
    //             <div className="
    //             md:w-40 w-full h-32 md:h-auto
    //             bg-green-700 flex items-center justify-center
    //             ">
    //                 <span className="text-5xl">⚽</span>
    //             </div>

    //             {/* RIGHT CONTENT */}
    //             <div className="flex-1 p-5 sm:p-6 text-white">

    //                 <div className="flex justify-between items-start">

    //                     <div>
    //                         <h3 className="text-lg sm:text-xl font-bold">
    //                             {b.turfName}
    //                         </h3>

    //                         <p className="flex items-center gap-1 text-gray-400 text-sm mt-1">
    //                             <MapPin size={14} /> {b.location}
    //                         </p>
    //                     </div>

    //                     <span className="
    //                     px-3 py-1 rounded-full text-xs font-semibold
    //                     bg-green-600/20 text-green-400
    //                     ">
    //                         {isPast ? "past" : "upcoming"}
    //                     </span>

    //                 </div>

    //                 {/* SLOT INFO */}
    //                 <div className="
    //                 flex flex-wrap gap-x-5 gap-y-2
    //                 text-gray-300 text-sm mt-4
    //                 ">

    //                     <span className="flex items-center gap-1">
    //                         <Calendar size={14} /> {b.bookingDate}
    //                     </span>

    //                     <span className="flex items-center gap-1">
    //                         <Clock size={14} /> {b.startTime} - {b.endTime}
    //                     </span>

    //                     <span className="font-semibold text-green-400">
    //                         ₹{b.price}
    //                     </span>

    //                 </div>

    //                 {/* ACTION BUTTONS */}
    //                 {!isPast && (
    //                     <button
    //                         onClick={() => cancelBooking(b.bookingId)}
    //                         className="
    //                         mt-4
    //                         text-red-400
    //                         text-sm
    //                         font-semibold
    //                         hover:underline
    //                         "
    //                     >
    //                         Cancel Booking
    //                     </button>
    //                 )}

    //                 {isPast && (
    //                     <button
    //                         onClick={() => setOpenReview(b.bookingId)}
    //                         className="
    //                         mt-4
    //                         px-4 py-2
    //                         rounded-full
    //                         bg-green-600/20
    //                         text-green-400
    //                         text-sm
    //                         font-semibold
    //                         hover:bg-green-600/30
    //                         transition
    //                         "
    //                     >
    //                         ✍ Write Review
    //                     </button>
    //                 )}

    //                 {/* INLINE REVIEW BOX */}
    //                 {openReview === b.bookingId && (

    //                     <div className="
    //                     mt-5
    //                     rounded-2xl
    //                     border border-white/10
    //                     bg-black/20
    //                     p-4
    //                     ">

    //                         <textarea
    //                             value={reviewText}
    //                             onChange={e => setReviewText(e.target.value)}
    //                             placeholder="Share your experience at this turf..."
    //                             className="
    //                             w-full
    //                             h-24
    //                             resize-none
    //                             rounded-xl
    //                             bg-black/30
    //                             border border-white/10
    //                             focus:border-green-400
    //                             outline-none
    //                             px-4 py-3
    //                             text-sm
    //                             "
    //                         />

    //                         <div className="
    //                         flex flex-col sm:flex-row gap-3 mt-4
    //                         ">

    //                             <button
    //                                 onClick={() => setOpenReview(null)}
    //                                 className="
    //                                 flex-1
    //                                 py-2.5
    //                                 rounded-full
    //                                 bg-white/10
    //                                 hover:bg-white/20
    //                                 text-gray-300
    //                                 font-semibold
    //                                 text-sm
    //                                 "
    //                             >
    //                                 Cancel
    //                             </button>

    //                             <button
    //                                 className="
    //                                 flex-1
    //                                 py-2.5
    //                                 rounded-full
    //                                 bg-green-600
    //                                 hover:bg-green-500
    //                                 text-white
    //                                 font-semibold
    //                                 text-sm
    //                                 "
    //                             >
    //                                 Submit Review
    //                             </button>

    //                         </div>

    //                     </div>
    //                 )}

    //             </div>

    //         </div>

    //     </div>
    // )

    if (loading)
        return (
            <div className="min-h-screen bg-[#021a16] flex items-center justify-center text-gray-400">
                Loading Bookings...
            </div>
        )

    return (

        <div className="min-h-screen bg-[#021a16] text-white pt-[90px]">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10">

                <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                    My <span className="text-green-400">Bookings</span>
                </h1>

                <p className="text-gray-400 mb-10">
                    Track all your turf bookings
                </p>

                {/* UPCOMING */}
                {upcomingBookings.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-xl font-semibold mb-5">📅 Upcoming</h2>

                        <div className="space-y-6">
                            {upcomingBookings.map(b => {
                                return <BookingCard
                                    key={b.bookingId}
                                    b={b}
                                    openReviewId={openReviewId}
                                    setOpenReviewId={setOpenReviewId}
                                    reviewText={reviewText}
                                    setReviewText={setReviewText}
                                    submitReview={submitReview}
                                    cancelBooking={cancelBooking}
                                    currentUserId={currentUserId}
                                    reviewedTurfs={reviewedTurfs}
                                />

                            }
                            )}
                        </div>
                    </section>
                )}

                {/* PAST */}
                {pastBookings.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-5">🏁 Past</h2>

                        <div className="space-y-6">
                            {pastBookings.map(b => (
                                <BookingCard

                                    key={b.bookingId}
                                    b={b}
                                    isPast
                                    openReviewId={openReviewId}
                                    setOpenReviewId={setOpenReviewId}
                                    reviewText={reviewText}
                                    setReviewText={setReviewText}
                                    submitReview={submitReview}
                                    cancelBooking={cancelBooking}
                                    currentUserId={currentUserId}
                                    reviewToast={reviewToast}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {todayBookings.length === 0 &&
                    upcomingBookings.length === 0 &&
                    pastBookings.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            No Bookings Yet ⚽
                        </div>
                    )}

            </div>

        </div>
    )
}