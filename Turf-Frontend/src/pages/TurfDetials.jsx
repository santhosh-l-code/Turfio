import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../services/api"

import dayjs from "dayjs"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers"

import { Star } from "lucide-react"

export default function TurfDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const SPORT_EMOJI = {
        FOOTBALL: "⚽",
        CRICKET: "🏏",
        BADMINTON: "🏸",
        TENNIS: "🎾",
        BASKETBALL: "🏀",
        VOLLEYBALL: "🏐"
    }

    const [turf, setTurf] = useState(null)
    const [date, setDate] = useState(null)
    const [slots, setSlots] = useState([])
    const [selectedSlots, setSelectedSlots] = useState([])

    const totalSlots = selectedSlots.length
    const totalPrice = totalSlots * (turf?.pricePerHour || 0)


    useEffect(() => {
        fetchTurf()
    }, [id])


    const fetchTurf = async () => {
        try {
            const res = await api.get(`/api/turf/${id}`)
            setTurf(res.data)
            console.log(res.data)
        } catch (err) {
            console.log(err)
        }
    }



    const fetchSlots = async (selectedDate) => {

        try {

            const formatted = dayjs(selectedDate).format("YYYY-MM-DD")
            const res = await api.get(`/api/turf/${id}/slots?date=${formatted}`)

            const apiSlots = res.data
            setSlots(apiSlots)

            const draft = JSON.parse(localStorage.getItem("bookingDraft"))

            if (draft && draft.turfId == id && draft.slotIds) {

                const restored = apiSlots.filter(slot =>
                    draft.slotIds.includes(slot.slotId)
                )

                setSelectedSlots(restored)

                localStorage.removeItem("bookingDraft")
            }
            else {
                setSelectedSlots([])
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {

        const draft = JSON.parse(localStorage.getItem("bookingDraft"))

        if (draft && draft.turfId == id && draft.date) {

            const d = dayjs(draft.date)
            setDate(d)
            fetchSlots(d)
        }

    }, [id])


    const toggleSlot = (slot) => {

        if (slot.status !== "AVAILABLE") return

        setSelectedSlots(prev => {

            const exists = prev.some(s => s.slotId === slot.slotId)

            if (exists)
                return prev.filter(s => s.slotId !== slot.slotId)

            return [...prev, slot]
        })
    }


    const bookSlots = async () => {

        const token = localStorage.getItem("token")

        if (!token) {

            const draft = {
                turfId: id,
                date: date,
                slotIds: selectedSlots.map(s => s.slotId)
            }

            localStorage.setItem("bookingDraft", JSON.stringify(draft))

            navigate("/login", {
                state: { from: `/turf/${id}` }
            })

            return
        }

        if (selectedSlots.length === 0) {
            alert("Select slots")
            return
        }

        try {

            await api.post("/api/turfSlot/book", {
                turfId: Number(id),
                slotIds: selectedSlots.map(s => s.slotId),
                bookingDate: dayjs(date).format("YYYY-MM-DD")
            })
            console.log(selectedSlots, bookSlots)

            alert("Booking Successful 🔥")
            navigate("/dashboard")

            fetchSlots(date)

        } catch {

            alert("Booking Failed")
        }
    }


    if (!turf)
        return <div className="text-center py-20">Loading...</div>


    return (
        <div className="min-h-screen bg-gradient-to-b from-[#021a16] to-[#031a16] text-white">

            {/* HERO */}
            {/* HERO */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                <img
                    src={turf.imageUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"}
                    alt={turf.name}
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021a16] via-black/40 to-transparent" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl px-5">
                    <span className="px-4 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-400 text-sm font-semibold">
                        {SPORT_EMOJI[turf.sportType]} {turf.sportType}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mt-3">{turf.name}</h1>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* INFO CARD */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

                            <div className="flex flex-wrap gap-8">

                                <div>
                                    <p className="text-xs text-gray-400">LOCATION</p>
                                    <p className="font-semibold mt-1">📍 {turf.location}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">HOURS</p>
                                    <p className="font-semibold mt-1">
                                        🕐 {turf.startTime} - {turf.endTime}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">PRICE</p>
                                    <p className="text-green-400 font-bold text-lg mt-1">
                                        ₹{turf.pricePerHour}/hr
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-3 mt-6 border-t border-white/10 pt-4">
                                <Star className="text-yellow-400" />
                                <span className="text-xl font-black">
                                    {turf.rating?.toFixed(1) || "0"}
                                </span>
                                {/* <span className="text-gray-400 text-sm">
                                    ({turf.totalReviews || 0} reviews)
                                </span> */}
                            </div>

                        </div>


                        {/* SLOT CARD */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

                            <h3 className="text-xl font-black mb-4">Book a Slot</h3>

                            {/* WHITE DATE PICKER */}
                            <div className="bg-white rounded-xl w-fit">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={date}
                                        minDate={dayjs()}
                                        onChange={(v) => {
                                            setDate(v)
                                            fetchSlots(v)
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>

                            {/* SLOT RANGE */}
                            {slots.length > 0 && (
                                <p className="text-xs text-gray-400 mt-4">
                                    Slots available from {slots[0].startTime} to {slots[slots.length - 1].endTime}
                                </p>
                            )}

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-5">

                                {slots.map(slot => {

                                    const isSelected = selectedSlots.some(s => s.slotId === slot.slotId)
                                    const isBooked = slot.status !== "AVAILABLE"

                                    return (
                                        <button
                                            key={slot.slotId}
                                            onClick={() => toggleSlot(slot)}
                                            disabled={isBooked}
                                            className={`
py-3 rounded-xl text-sm font-semibold transition border
${isBooked
                                                    ? "bg-white/10 text-gray-500 cursor-not-allowed"
                                                    : isSelected
                                                        ? "bg-green-500 text-white scale-105 shadow-lg"
                                                        : "bg-white/5 border-white/10 hover:bg-green-500/20"}
`}
                                        >
                                            {slot.startTime}
                                        </button>
                                    )

                                })}

                            </div>

                            <p className="text-xs text-gray-400 mt-3">
                                Select consecutive time slots. Each slot = 1 hour.
                            </p>

                        </div>


                        {/* REVIEWS */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mt-8">

                            <h3 className="text-xl font-bold mb-4">
                                Reviews
                            </h3>

                            {turf.reviews.length === 0 ? (

                                <p className="text-gray-400 text-sm">
                                    No reviews yet. Be the first to review!
                                </p>

                            ) : (

                                <div className="space-y-4">

                                    {turf.reviews.map((r, index) => (
                                        <div
                                            key={index}
                                            className="border-b border-white/10 pb-3"
                                        >

                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-sm">
                                                    {r.userName || "Player"}
                                                </p>

                                                <p className="text-yellow-400 text-sm font-bold">
                                                    ⭐ {r.rating}
                                                </p>
                                            </div>

                                            <p className="text-gray-400 text-sm">
                                                {r.comment}
                                            </p>

                                        </div>
                                    ))}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* SIDEBAR */}
                    <div className="hidden lg:block">

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-24">

                            <h3 className="text-lg font-black mb-4">Quick Info</h3>

                            <div className="space-y-3 text-sm">

                                <div className="text-gray-400">📍 {turf.location}</div>
                                <div className="text-gray-400">🕐 {turf.startTime} - {turf.endTime}</div>

                                <div className="flex items-center gap-2">
                                    💰
                                    <span className="text-green-400 font-bold text-lg">
                                        ₹{turf.pricePerHour}
                                    </span>
                                    <span className="text-gray-400">/hour</span>
                                </div>

                                <div className="text-gray-400">
                                    ⭐ {turf.rating?.toFixed(1)}
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>


            {/* FLOAT BOOK BAR (SHORT COMPACT) */}
            {selectedSlots.length > 0 && (

                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] md:w-[520px] bg-[#021a16]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-2xl z-50">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-400 text-xs">
                                Slots
                            </p>

                            <p className="font-semibold text-sm">
                                {selectedSlots[0].startTime} - {selectedSlots[selectedSlots.length - 1].endTime}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-400 text-xs">
                                Hours
                            </p>

                            <p className="font-semibold text-sm">
                                {selectedSlots.length}h
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-400 text-xs">
                                Total
                            </p>

                            <p className="font-bold text-green-400 text-lg">
                                ₹{totalPrice}
                            </p>

                        </div>

                        <button
                            onClick={bookSlots}
                            className="ml-4 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-xl font-semibold transition"
                        >
                            Book Now →
                        </button>

                    </div>

                </div>

            )}        </div>
    )
}