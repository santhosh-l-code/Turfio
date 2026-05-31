import { useEffect, useState } from "react"
import api from "../services/api"
import { MapPin, Star, Trash2, Pencil } from "lucide-react"

const SPORT_EMOJI = {
    FOOTBALL: "⚽",
    CRICKET: "🏏",
    BADMINTON: "🏸",
    TENNIS: "🎾",
    BASKETBALL: "🏀",
    VOLLEYBALL: "🏐"
}

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition"

const allSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00",
    "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00",
    "21:00", "22:00"
]

// ⭐ TurfForm is OUTSIDE OwnerTurfs — fixes the focus bug
function TurfForm({ isEdit, form, setForm, imagePreview, handleImageChange, setImageFile, setImagePreview, toggleSlot, saving, uploading, onCancel, onSubmit }) {
    return (
        <div className="space-y-4">

            {/* Image Upload */}
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                    Turf Image
                </label>
                <label className="
                    flex items-center justify-center
                    w-full h-36 rounded-xl cursor-pointer
                    bg-white/5 border border-dashed border-white/20
                    hover:border-green-500/50 hover:bg-white/[0.07]
                    overflow-hidden transition-all group
                ">
                    {imagePreview || form.imageUrl ? (
                        <img
                            src={imagePreview || form.imageUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-gray-300 transition">
                            <span className="text-3xl">📷</span>
                            <span className="text-xs">Click to upload (max 5MB)</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
                {(imagePreview || form.imageUrl) && (
                    <button
                        onClick={() => {
                            setImageFile(null)
                            setImagePreview("")
                            setForm(prev => ({ ...prev, imageUrl: "" }))
                        }}
                        className="mt-1.5 text-xs text-red-400 hover:text-red-300 transition"
                    >
                        ✕ Remove image
                    </button>
                )}
            </div>

            {/* Row 1 — Name + Sport */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Turf Name *</label>
                    <input
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Green Arena"
                        className={inputCls}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Sport *</label>
                    <div className="relative">
                        <select
                            value={form.sportType}
                            onChange={e => setForm(prev => ({ ...prev, sportType: e.target.value }))}
                            className={`${inputCls} appearance-none pr-8`}
                        >
                            <option className="text-black" value="FOOTBALL">Football</option>
                            <option className="text-black" value="CRICKET">Cricket</option>
                            <option className="text-black" value="BADMINTON">Badminton</option>
                            <option className="text-black" value="TENNIS">Tennis</option>
                            <option className="text-black" value="BASKETBALL">Basketball</option>
                            <option className="text-black" value="VOLLEYBALL">Volleyball</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                    </div>
                </div>
            </div>

            {/* Row 2 — Location */}
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Location *</label>
                <input
                    value={form.location}
                    onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Koramangala, Bangalore"
                    className={inputCls}
                />
            </div>

            {/* Row 3 — Price */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Price/hr (₹) *</label>
                    <input
                        type="number"
                        value={form.pricePerHour}
                        onChange={e => setForm(prev => ({ ...prev, pricePerHour: e.target.value }))}
                        placeholder="700"
                        className={inputCls}
                    />
                </div>
            </div>

            {/* Slots */}
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Available Slots *</label>
                <p className="text-xs text-gray-600 mb-3">Each slot = 1 hour. Select all that apply.</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {allSlots.map(time => {
                        const selected = (form.slotStartTimes || []).includes(time)
                        return (
                            <div
                                key={time}
                                onClick={() => toggleSlot(time)}
                                className={`p-2 text-center text-xs rounded-xl cursor-pointer font-medium transition-all
                                    ${selected
                                        ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                                        : "bg-white/5 border border-white/10 text-gray-400 hover:border-green-500/40 hover:text-gray-200"
                                    }`}
                            >
                                {time}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={saving || uploading}
                    className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white text-sm font-bold shadow-lg shadow-green-500/20 disabled:opacity-50 transition-all"
                >
                    {uploading ? "Uploading image..." : saving ? "Saving..." : isEdit ? "Update Turf" : "Add Turf"}
                </button>
            </div>

        </div>
    )
}

export default function OwnerTurfs() {

    const [turfs, setTurfs] = useState([])
    const [editing, setEditing] = useState(null)
    const [showCreate, setShowCreate] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [uploading, setUploading] = useState(false)

    const [form, setForm] = useState({
        name: "",
        location: "",
        pricePerHour: "",
        sportType: "CRICKET",
        slotStartTimes: [],
        imageUrl: ""
    })

    useEffect(() => { fetchTurfs() }, [])

    const fetchTurfs = async () => {
        try {
            const res = await api.get("/api/turf/owner")
            setTurfs(res.data)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setForm({
            name: "",
            location: "",
            pricePerHour: "",
            sportType: "CRICKET",
            slotStartTimes: [],
            imageUrl: ""
        })
        setImageFile(null)
        setImagePreview("")
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be under 5MB")
            return
        }
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const uploadImage = async () => {
        if (!imageFile) return null
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", imageFile)
            const res = await api.post("/api/turf/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data.imageUrl
        } catch (err) {
            alert("Image upload failed")
            return null
        } finally {
            setUploading(false)
        }
    }

    const createTurf = async () => {
        setSaving(true)
        try {
            const imageUrl = imageFile ? await uploadImage() : ""
            await api.post("/api/turf/create", { ...form, imageUrl: imageUrl || "" })
            setShowCreate(false)
            resetForm()
            fetchTurfs()
        } catch (err) {
            console.log(err)
            alert("Create failed")
        } finally {
            setSaving(false)
        }
    }

    const openEdit = (turf) => {
        setForm({
            name: turf.name,
            location: turf.location,
            pricePerHour: turf.pricePerHour,
            sportType: turf.sportType,
            slotStartTimes: turf.slots
                ? turf.slots.map(s => s.startTime.slice(0, 5))
                : [],
            imageUrl: turf.imageUrl || ""
        })
        setImageFile(null)
        setImagePreview("")
        setEditing(turf.id)
    }

    const updateTurf = async () => {
        setSaving(true)
        try {
            const imageUrl = imageFile ? await uploadImage() : form.imageUrl
            await api.put(`/api/turf/update/${editing}`, { ...form, imageUrl: imageUrl || "" })
            setEditing(null)
            resetForm()
            fetchTurfs()
        } catch (err) {
            console.log(err)
            alert("Update failed")
        } finally {
            setSaving(false)
        }
    }

    const deleteTurf = async (id) => {

        const confirmDelete = confirm(
            "⚠️ Deleting this turf will remove all slots, reviews, and past bookings.\n\nAre you sure?"
        )

        if (!confirmDelete) return

        setDeletingId(id)

        try {

            const res = await api.delete(`/api/turf/delete/${id}`)

            alert(res.data || "Turf deleted successfully")

            fetchTurfs()

        } catch (err) {

            console.log("DELETE ERROR:", err)

            const msg = err?.response?.data

            if (msg) {

                if (msg.toLowerCase().includes("upcoming")) {
                    alert("❌ Cannot delete turf with upcoming bookings")
                }
                else if (msg.toLowerCase().includes("unauthorized")) {
                    alert("❌ You are not allowed to delete this turf")
                }
                else {
                    alert(msg)
                }

            } else {
                alert("Something went wrong while deleting")
            }

        } finally {
            setDeletingId(null)
        }
    }

    const toggleSlot = (time) => {
        setForm(prev => {
            const exists = prev.slotStartTimes.includes(time)
            return {
                ...prev,
                slotStartTimes: exists
                    ? prev.slotStartTimes.filter(t => t !== time)
                    : [...prev.slotStartTimes, time]
            }
        })
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: "radial-gradient(ellipse at top, #0d2818 0%, #080d0b 40%, #050807 100%)" }}>
                <div className="text-5xl animate-spin">⚽</div>
            </div>
        )

    // shared props passed down to TurfForm
    const formProps = {
        form, setForm,
        imagePreview, handleImageChange,
        setImageFile, setImagePreview,
        toggleSlot, saving, uploading
    }

    return (
        <div
            className="min-h-screen text-white pt-20"
            style={{ background: "radial-gradient(ellipse at top, #0d2818 0%, #080d0b 40%, #050807 100%)" }}
        >
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
                    backgroundSize: "60px 60px"
                }}
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                            My{" "}
                            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                                Turfs
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            {turfs.length} turf{turfs.length !== 1 ? "s" : ""} listed
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowCreate(true) }}
                        className="bg-green-500 hover:bg-green-400 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-500/25 transition-all hover:-translate-y-0.5"
                    >
                        + Add Turf
                    </button>
                </div>

                {/* EMPTY STATE */}
                {turfs.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.03] border border-white/[0.06] rounded-3xl backdrop-blur-xl">
                        <span className="text-6xl">🏟️</span>
                        <p className="text-xl font-bold text-gray-400 mt-4">No turfs yet</p>
                        <button
                            onClick={() => { resetForm(); setShowCreate(true) }}
                            className="mt-6 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-sm transition shadow-lg shadow-green-500/20"
                        >
                            Add Your First Turf
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {turfs.map(t => (
                            <div
                                key={t.id}
                                className="
                                    bg-white/[0.03] border border-white/[0.06]
                                    hover:border-green-500/20 hover:bg-white/[0.05]
                                    rounded-3xl p-5
                                    flex flex-col sm:flex-row gap-4
                                    backdrop-blur-xl shadow-xl shadow-black/30
                                    transition-all duration-200
                                "
                            >
                                {/* ⭐ Real image or emoji fallback */}
                                <div className="sm:w-24 h-20 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                    {t.imageUrl ? (
                                        <img
                                            src={t.imageUrl}
                                            alt={t.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-green-800/60 flex items-center justify-center text-4xl">
                                            {SPORT_EMOJI[t.sportType] || "🏟️"}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{t.name}</h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                <MapPin size={13} /> {t.location}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(t)}
                                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-400 hover:text-white hover:border-green-500/30 transition-all flex items-center gap-1.5"
                                            >
                                                <Pencil size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => deleteTurf(t.id)}
                                                disabled={deletingId === t.id}
                                                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                            >
                                                <Trash2 size={14} />
                                                {deletingId === t.id ? "..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>🏆 {t.sportType}</span>
                                        <span>💰 ₹{t.pricePerHour}/hr</span>
                                        <span className="flex items-center gap-1 text-yellow-400">
                                            <Star size={13} /> {t.rating?.toFixed(1) || "0.0"}
                                        </span>
                                        <span className="text-gray-600">
                                            {t.slots?.length || 0} slots
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {editing && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#080d0b] border border-green-500/20 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl shadow-black/60 my-4">
                        <h2 className="text-2xl font-black mb-5 text-white">Edit Turf</h2>
                        <TurfForm
                            {...formProps}
                            isEdit={true}
                            onCancel={() => { setEditing(null); resetForm() }}
                            onSubmit={updateTurf}
                        />
                    </div>
                </div>
            )}

            {/* CREATE MODAL */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#080d0b] border border-green-500/20 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl shadow-black/60 my-4">
                        <h2 className="text-2xl font-black mb-5 text-white">Add New Turf</h2>
                        <TurfForm
                            {...formProps}
                            isEdit={false}
                            onCancel={() => { setShowCreate(false); resetForm() }}
                            onSubmit={createTurf}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}