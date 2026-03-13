import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
    Shield, Plus, Trash2, Tag, CheckCircle, XCircle,
    LogOut, Bike, ChevronDown, ChevronUp, Eye, EyeOff,
    LayoutDashboard, PackageX, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Trending", "Popular", "Standard", "Premium", "Electric", "Upcoming"];
const BRANDS = ["Royal Enfield", "KTM", "Yamaha", "Honda", "Kawasaki", "BMW", "Ducati", "Harley-Davidson", "TVS", "Hero", "Bajaj", "Ather", "Ultraviolette", "Other"];

const emptyForm = {
    name: "", brand: BRANDS[0], category: CATEGORIES[0],
    price: "", year: new Date().getFullYear().toString(),
    cc: "", imageUrl: "", description: "",
    mileage: "", transmission: "6 Speed", power: "", torque: "",
    topSpeed: "", fuelType: "Petrol", abs: "Dual Channel",
    weight: "", tankCapacity: "", rating: "4.5", availableColors: "",
};

export default function Admin() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Check admin session
    useEffect(() => {
        fetch("/api/admin/me", { credentials: "include" })
            .then(r => r.ok ? r.json() : null)
            .then(d => setIsAdmin(!!d?.isAdmin))
            .catch(() => setIsAdmin(false));
    }, []);

    // Fetch all bikes
    const { data: bikesData = [], isLoading } = useQuery({
        queryKey: ["/api/admin/bikes"],
        queryFn: async () => {
            const res = await fetch("/api/admin/bikes", { credentials: "include" });
            if (!res.ok) {
                if (res.status === 401) setIsAdmin(false);
                const err = await res.json();
                throw new Error(err.message || "Failed to fetch bikes");
            }
            return res.json();
        },
        enabled: isAdmin === true,
    });

    const bikes = Array.isArray(bikesData) ? bikesData : [];

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
            return res.json();
        },
        onSuccess: () => {
            setIsAdmin(true);
            queryClient.invalidateQueries({ queryKey: ["/api/admin/bikes"] });
            toast({ title: "Welcome, Admin! 🛡️" });
        },
        onError: (e: any) => toast({ title: "Login failed", description: e.message, variant: "destructive" }),
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: () => fetch("/api/admin/logout", { method: "POST", credentials: "include" }),
        onSuccess: () => { setIsAdmin(false); toast({ title: "Logged out" }); },
    });

    // Add bike mutation
    const addBikeMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/admin/bikes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/bikes"] });
            queryClient.invalidateQueries({ queryKey: ["/api/bikes"] });
            setForm(emptyForm);
            setShowAddForm(false);
            toast({ title: "Bike added! 🏍️" });
        },
        onError: (e: any) => toast({ title: "Failed to add bike", description: e.message, variant: "destructive" }),
    });

    // Delete bike mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/admin/bikes/${id}`, { method: "DELETE", credentials: "include" });
            if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/bikes"] });
            queryClient.invalidateQueries({ queryKey: ["/api/bikes"] });
            setDeleteConfirm(null);
            toast({ title: "Bike removed ✓" });
        },
        onError: (e: any) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
    });

    // Toggle sold mutation
    const soldMutation = useMutation({
        mutationFn: async ({ id, sold }: { id: number; sold: boolean }) => {
            const res = await fetch(`/api/admin/bikes/${id}/sold`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ sold }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/bikes"] });
            queryClient.invalidateQueries({ queryKey: ["/api/bikes"] });
            toast({ title: "Status updated ✓" });
        },
        onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
    });

    const totalBikes = bikes.length;
    const soldBikes = bikes.filter((b: any) => b.sold).length;
    const availableBikes = totalBikes - soldBikes;

    // ─── LOADING ───
    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ─── LOGIN SCREEN ───
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
                <div className="absolute top-0 left-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
                            <Shield className="w-9 h-9 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                        <p className="text-gray-400 text-sm mt-1">Rakesh Premium Bikes</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                                <input
                                    type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                                    placeholder="rrakesh20235@gmail.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                                <input
                                    type={showPass ? "text" : "password"} value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    placeholder="Admin password"
                                    onKeyDown={e => e.key === "Enter" && loginMutation.mutate()}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 bottom-3 text-gray-400 hover:text-white">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <Button
                                onClick={() => loginMutation.mutate()}
                                disabled={loginMutation.isPending}
                                className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30"
                            >
                                {loginMutation.isPending ? "Logging in..." : "Login as Admin"}
                            </Button>
                        </div>
                        <p className="text-center mt-4">
                            <a href="/" className="text-gray-500 text-sm hover:text-gray-300">← Back to Site</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─── ADMIN DASHBOARD ───
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="bg-gray-900 border-b border-white/10 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white">Admin Portal</span>
                            <span className="text-gray-400 text-xs ml-2">Rakesh Premium Bikes</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="/" target="_blank" className="text-gray-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
                            <Eye className="w-4 h-4" /> View Site
                        </a>
                        <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()}
                            className="text-gray-400 hover:text-white gap-2">
                            <LogOut className="w-4 h-4" /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Total Bikes", value: totalBikes, icon: Bike, color: "blue" },
                        { label: "Available", value: availableBikes, icon: CheckCircle, color: "green" },
                        { label: "Sold", value: soldBikes, icon: PackageX, color: "orange" },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-gray-900 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color === "blue" ? "bg-blue-500/20" : color === "green" ? "bg-green-500/20" : "bg-orange-500/20"
                                }`}>
                                <Icon className={`w-6 h-6 ${color === "blue" ? "text-blue-400" : color === "green" ? "text-green-400" : "text-orange-400"
                                    }`} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{value}</p>
                                <p className="text-gray-400 text-sm">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Bike Section */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <Plus className="w-5 h-5 text-orange-400" />
                            </div>
                            <span className="font-semibold text-lg">Add New Bike</span>
                        </div>
                        {showAddForm ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>

                    <AnimatePresence>
                        {showAddForm && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-6 border-t border-white/10 pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Required Fields */}
                                        {[
                                            { label: "Bike Name *", key: "name", placeholder: "e.g. Royal Enfield Classic 350" },
                                            { label: "Image URL *", key: "imageUrl", placeholder: "https://..." },
                                            { label: "Price (₹) *", key: "price", placeholder: "e.g. 195000", type: "number" },
                                            { label: "Year *", key: "year", placeholder: "e.g. 2024", type: "number" },
                                            { label: "Engine CC *", key: "cc", placeholder: "e.g. 349", type: "number" },
                                        ].map(({ label, key, placeholder, type }) => (
                                            <div key={key}>
                                                <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                                                <input
                                                    type={type || "text"} placeholder={placeholder}
                                                    value={(form as any)[key]}
                                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                                    className="w-full bg-gray-800 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-all"
                                                />
                                            </div>
                                        ))}

                                        {/* Brand dropdown */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1.5">Brand *</label>
                                            <select value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                                                className="w-full bg-gray-800 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-orange-500/60 transition-all">
                                                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>

                                        {/* Category dropdown */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1.5">Category *</label>
                                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                                className="w-full bg-gray-800 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-orange-500/60 transition-all">
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        {/* Optional Fields */}
                                        {[
                                            { label: "Mileage", key: "mileage", placeholder: "e.g. 35 kmpl" },
                                            { label: "Transmission", key: "transmission", placeholder: "e.g. 6 Speed" },
                                            { label: "Power", key: "power", placeholder: "e.g. 20.2 PS" },
                                            { label: "Torque", key: "torque", placeholder: "e.g. 27 Nm" },
                                            { label: "Top Speed", key: "topSpeed", placeholder: "e.g. 120 kmph" },
                                            { label: "Fuel Type", key: "fuelType", placeholder: "e.g. Petrol" },
                                            { label: "ABS", key: "abs", placeholder: "e.g. Dual Channel" },
                                            { label: "Weight", key: "weight", placeholder: "e.g. 191 kg" },
                                            { label: "Tank Capacity", key: "tankCapacity", placeholder: "e.g. 15 L" },
                                            { label: "Rating (0-5)", key: "rating", placeholder: "e.g. 4.5" },
                                        ].map(({ label, key, placeholder }) => (
                                            <div key={key}>
                                                <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                                                <input
                                                    type="text" placeholder={placeholder}
                                                    value={(form as any)[key]}
                                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                                    className="w-full bg-gray-800 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-all"
                                                />
                                            </div>
                                        ))}

                                        {/* Colors */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1.5">Available Colors (comma-separated)</label>
                                            <input
                                                type="text" placeholder="e.g. Red, Black, Blue"
                                                value={form.availableColors}
                                                onChange={e => setForm(f => ({ ...f, availableColors: e.target.value }))}
                                                className="w-full bg-gray-800 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Description - full width */}
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400 mb-1.5">Description</label>
                                        <textarea
                                            rows={3} placeholder="Describe the bike..."
                                            value={form.description}
                                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            className="w-full bg-gray-800 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 resize-none focus:outline-none focus:border-orange-500/60 transition-all"
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    {form.imageUrl && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                                            <img src={form.imageUrl} alt="preview"
                                                className="h-32 w-auto rounded-xl border border-white/10 object-contain bg-gray-800"
                                                onError={e => (e.currentTarget.style.display = "none")}
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-6">
                                        <Button
                                            onClick={() => addBikeMutation.mutate()}
                                            disabled={addBikeMutation.isPending || !form.name || !form.imageUrl || !form.price}
                                            className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            {addBikeMutation.isPending ? "Adding..." : "Add Bike"}
                                        </Button>
                                        <Button variant="ghost" onClick={() => { setForm(emptyForm); setShowAddForm(false); }}
                                            className="text-gray-400 hover:text-white">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bikes Table */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                        <LayoutDashboard className="w-5 h-5 text-orange-400" />
                        <h2 className="font-semibold text-lg">All Bikes ({totalBikes})</h2>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center text-gray-400">Loading bikes...</div>
                    ) : bikes.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">No bikes yet. Add one above!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                                        <th className="text-left px-6 py-3 font-medium">Bike</th>
                                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Brand</th>
                                        <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Category</th>
                                        <th className="text-left px-4 py-3 font-medium">Price</th>
                                        <th className="text-left px-4 py-3 font-medium">Status</th>
                                        <th className="text-right px-6 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bikes.map((bike: any) => (
                                        <motion.tr
                                            key={bike.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-white/5 hover:bg-white/3 transition-colors"
                                        >
                                            {/* Bike name + image */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={bike.imageUrl} alt={bike.name}
                                                        className="w-14 h-10 rounded-lg object-cover bg-gray-800 flex-shrink-0"
                                                        onError={e => { e.currentTarget.src = ""; e.currentTarget.className = "w-14 h-10 rounded-lg bg-gray-700 flex-shrink-0"; }}
                                                    />
                                                    <div>
                                                        <p className="font-medium text-white leading-tight">{bike.name}</p>
                                                        <p className="text-gray-500 text-xs">{bike.year} · {bike.cc}cc</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-gray-300 hidden md:table-cell">{bike.brand}</td>
                                            <td className="px-4 py-4 hidden lg:table-cell">
                                                <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-md">{bike.category}</span>
                                            </td>
                                            <td className="px-4 py-4 text-gray-300">
                                                ₹{bike.price.toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-4 py-4">
                                                {bike.sold ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-full font-medium">
                                                        <XCircle className="w-3 h-3" /> Sold
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full font-medium">
                                                        <BadgeCheck className="w-3 h-3" /> Available
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Toggle Sold */}
                                                    <Button
                                                        size="sm" variant="ghost"
                                                        onClick={() => soldMutation.mutate({ id: bike.id, sold: !bike.sold })}
                                                        disabled={soldMutation.isPending}
                                                        className={`text-xs gap-1.5 ${bike.sold ? "text-green-400 hover:text-green-300 hover:bg-green-500/10" : "text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"}`}
                                                    >
                                                        <Tag className="w-3.5 h-3.5" />
                                                        {bike.sold ? "Mark Available" : "Mark Sold"}
                                                    </Button>

                                                    {/* Delete */}
                                                    {deleteConfirm === bike.id ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs text-gray-400">Sure?</span>
                                                            <Button size="sm" variant="ghost"
                                                                onClick={() => deleteMutation.mutate(bike.id)}
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                                                            >Yes</Button>
                                                            <Button size="sm" variant="ghost"
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="text-gray-400 text-xs"
                                                            >No</Button>
                                                        </div>
                                                    ) : (
                                                        <Button size="sm" variant="ghost"
                                                            onClick={() => setDeleteConfirm(bike.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
