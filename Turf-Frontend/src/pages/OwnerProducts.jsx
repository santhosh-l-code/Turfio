import { useEffect, useState } from "react"
import api from "../services/api"

const SPORTS = ["FOOTBALL", "CRICKET", "BADMINTON", "TENNIS", "BASKETBALL", "VOLLEYBALL"]

const sportEmojis = {
    FOOTBALL: "⚽", CRICKET: "🏏", BADMINTON: "🏸", TENNIS: "🎾", BASKETBALL: "🏀", VOLLEYBALL: "🏐",
}

const emptyForm = {
    name: "",
    description: "",
    price: 499,
    sportType: "FOOTBALL",
    stock: 10
}

export default function OwnerProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState("")

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await api.get("/api/product/owner")
            setProducts(res.data)
        } catch {
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const openAdd = () => {
        setForm(emptyForm)
        setEditingProduct(null)
        setImageUrl("")
        setImage(null)
        setShowForm(true)
    }

    const openEdit = (p) => {
        setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            sportType: p.sportType,
            stock: p.stock
        })
        setEditingProduct(p)
        setImageUrl(p.imageUrl || "")
        setShowForm(true)
    }

    const uploadImage = async () => {
        if (!image) return alert("Select an image first")
        const fd = new FormData()
        fd.append("file", image)
        try {
            const res = await api.post("/api/product/upload-image", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            setImageUrl(res.data.imageUrl)
        } catch {
            alert("Upload failed")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = { ...form, imageUrl }
            if (editingProduct) {
                const res = await api.put(`/api/product/update/${editingProduct.id}`, payload)
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data : p))
            } else {
                const res = await api.post("/api/product/add", payload)
                setProducts(prev => [...prev, res.data])
            }
            setShowForm(false)
        } catch (err) {
            alert("Failed to save product")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return
        setDeletingId(id)
        try {
            await api.delete(`/api/product/delete/${id}`)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch {
            alert("Delete failed")
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-5xl animate-spin">⚽</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-[#05110f] text-white">
            {/* HEADER */}
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black">
                        My <span className="text-green-400">Products</span>
                    </h1>
                    <p className="text-gray-400 mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={openAdd}
                    className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold text-sm shadow-lg shadow-green-600/20 hover:bg-green-500 transition-all"
                >
                    + Add Product
                </button>
            </div>

            {/* PRODUCT GRID */}
            <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <span className="text-6xl">🛒</span>
                        <p className="text-xl font-bold text-gray-400 mt-4">No products yet</p>
                    </div>
                ) : (
                    products.map(product => (
                        <div key={product.id} className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-green-500/30 transition-all group">
                            {/* IMAGE SECTION */}
                            <div className="h-32 bg-white/5 flex items-center justify-center relative">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <span className="text-5xl">{sportEmojis[product.sportType] || "🏆"}</span>
                                )}
                                <div className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${product.stock > 10 ? "bg-green-500/20 text-green-400" :
                                    product.stock > 0 ? "bg-yellow-500/20 text-yellow-400" :
                                        "bg-red-500/20 text-red-400"
                                    }`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                </div>
                            </div>

                            {/* CONTENT SECTION */}
                            <div className="p-5">
                                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">{product.sportType}</p>
                                <h4 className="font-bold text-lg leading-tight">{product.name}</h4>
                                <p className="text-xs text-gray-400 mt-2 line-clamp-2 h-8">{product.description}</p>

                                <div className="mt-5 flex justify-between items-center">
                                    <span className="text-xl font-black text-white">₹{product.price}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEdit(product)}
                                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs transition-colors"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            disabled={deletingId === product.id}
                                            className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
                                        >
                                            {deletingId === product.id ? "..." : "🗑️"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="rounded-3xl p-8 w-full max-w-md bg-[#0b1f1c] border border-green-500/20 shadow-2xl">
                        <h3 className="text-2xl font-black mb-6">
                            {editingProduct ? "Edit Product" : "Add Product"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Product Name</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl mt-1 focus:border-green-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl mt-1 h-20 resize-none outline-none focus:border-green-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Price</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl mt-1 outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Sport</label>
                                    <select
                                        value={form.sportType}
                                        onChange={e => setForm(f => ({ ...f, sportType: e.target.value }))}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl mt-1 outline-none focus:border-green-500"
                                    >
                                        {SPORTS.map(s => <option key={s} className="bg-[#0b1f1c]">{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Stock</label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl mt-1 outline-none focus:border-green-500"
                                    />
                                </div>
                            </div>

                            {/* IMAGE UPLOAD SECTION */}
                            <div className="bg-white/5 p-4 rounded-2xl border border-dashed border-white/20 mt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <input
                                        type="file"
                                        onChange={e => setImage(e.target.files[0])}
                                        className="text-xs text-gray-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500 cursor-pointer"
                                    />
                                    <button
                                        type="button"
                                        onClick={uploadImage}
                                        className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors"
                                    >
                                        Upload
                                    </button>
                                </div>
                                {imageUrl && (
                                    <div className="mt-3 relative h-16 w-16">
                                        <img src={imageUrl} className="h-full w-full object-cover rounded-lg border border-white/20" />
                                        <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-[#0b1f1c]"></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : editingProduct ? "Update" : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}