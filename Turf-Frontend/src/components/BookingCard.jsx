import { MapPin, Calendar, Clock } from "lucide-react"

export default function BookingCard({
    b,
    isPast,
    openReviewId,
    setOpenReviewId,
    reviewText,
    setReviewText,
    submitReview,
    cancelBooking,
    currentUserId,
    reviewToast
}) {

    const alreadyReviewed =
        b.reviews?.some(r => r.playerId === currentUserId)



    return (

        <div className="
        rounded-3xl overflow-hidden
        border border-white/10
        bg-gradient-to-br from-white/5 to-white/10
        backdrop-blur-xl
        transition hover:scale-[1.01]
        ">

            <div className="flex flex-col md:flex-row">

                {/* LEFT */}
                <div className="md:w-40 w-full h-32 md:h-auto bg-green-700 flex items-center justify-center">
                    <span className="text-5xl">⚽</span>
                </div>

                {/* RIGHT */}
                <div className="flex-1 p-5 text-white">

                    <div className="flex justify-between">

                        <div>
                            <h3 className="font-bold text-lg">{b.turfName}</h3>

                            <p className="text-gray-400 text-sm flex gap-1 items-center">
                                <MapPin size={14} /> {b.location}
                            </p>
                        </div>

                        <div className="">
                            {
                                isPast && (
                                    <span className="bg-blue-800 text-white p-2  text-xs {}">
                                        {isPast ? "Past" : "Up Coming"}
                                    </span>
                                )

                            }
                            {
                                !isPast && (
                                    <span className="bg-blue-800 text-white p-2  text-xs {}">
                                        {isPast ? "Past" : "Up Coming"}
                                    </span>
                                )

                            }

                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">

                        <span className="flex gap-1 items-center">
                            <Calendar size={14} /> {b.bookingDate}
                        </span>

                        <span className="flex gap-1 items-center">
                            <Clock size={14} /> {b.startTime} - {b.endTime}
                        </span>

                        <span className="text-green-400 font-semibold">
                            ₹{b.price}
                        </span>

                    </div>

                    {/* UPCOMING ACTION */}
                    {!isPast && (
                        <button
                            onClick={() => cancelBooking(b.bookingId)}
                            className="text-red-400 mt-4 text-sm hover:underline"
                        >
                            Cancel Booking
                        </button>
                    )}

                    {/* REVIEW ACTION */}
                    {isPast && !alreadyReviewed && (
                        <button
                            onClick={() => setOpenReviewId(b.bookingId)}
                            className="mt-4 px-4 py-2 rounded-full bg-green-600/20 text-green-400 text-sm"
                        >
                            ✍ Write Review
                        </button>
                    )}

                    {isPast && alreadyReviewed && (
                        <p className="mt-4 text-green-400 text-sm font-semibold">
                            Reviewed ✅
                        </p>
                    )}

                    {/* REVIEW BOX */}
                    {openReviewId === b.bookingId && !alreadyReviewed && (

                        <div className="mt-5 border border-white/10 bg-black/20 rounded-2xl p-4">

                            <textarea
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                placeholder="Share your experience at this turf..."
                                className="w-full h-24 resize-none bg-black/30 border border-white/10 rounded-xl p-3 outline-none focus:border-green-400"
                            />

                            <div className="flex gap-3 mt-4">

                                <button
                                    onClick={() => setOpenReviewId(null)}
                                    className="flex-1 py-2.5 rounded-full bg-white/10"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => submitReview(b.turfId)}
                                    className="flex-1 py-2.5 rounded-full bg-green-600"
                                >
                                    Submit Review
                                </button>

                            </div>

                            {reviewToast?.[b.turfId] && (

                                <div className="
        mt-3
        text-sm
        text-yellow-400
        bg-yellow-500/10
        border border-yellow-500/20
        rounded-xl
        px-4 py-2
    ">
                                    {reviewToast[b.turfId]}
                                </div>

                            )}
                        </div>
                    )}

                </div>

            </div>

        </div >
    )
}