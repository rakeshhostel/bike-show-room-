import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useBikes } from "@/hooks/use-bikes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ArrowLeftRight, Check, Minus } from "lucide-react";
import type { Bike } from "@shared/schema";

function BikeSelector({
    label,
    selectedBike,
    bikes,
    onSelect,
    onClear,
    otherBikeId,
}: {
    label: string;
    selectedBike: Bike | null;
    bikes: Bike[];
    onSelect: (bike: Bike) => void;
    onClear: () => void;
    otherBikeId?: number;
}) {
    const [search, setSearch] = useState("");
    const filtered = bikes
        .filter((b) => b.id !== otherBikeId)
        .filter((b) =>
            `${b.name} ${b.brand}`.toLowerCase().includes(search.toLowerCase())
        );

    if (selectedBike) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            >
                <div className="relative aspect-[4/3] bg-muted/20">
                    <img
                        src={selectedBike.imageUrl}
                        alt={selectedBike.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' font-size='40' fill='%23cbd5e1' text-anchor='middle' dominant-baseline='middle'%3E🏍️%3C/text%3E%3C/svg%3E";
                        }}
                    />
                    <button
                        onClick={onClear}
                        className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 shadow hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <Badge className="absolute top-3 left-3">{selectedBike.brand}</Badge>
                </div>
                <div className="p-4">
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
                        {label}
                    </p>
                    <h3 className="text-lg font-bold font-display">{selectedBike.name}</h3>
                    <p className="text-xl font-bold text-primary mt-1">
                        ₹{(selectedBike.price / 100000).toFixed(1)}L
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-5">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {label}
            </p>
            <input
                className="w-full border border-border rounded-xl px-4 py-2.5 mb-3 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Search by name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filtered.slice(0, 20).map((bike) => (
                    <button
                        key={bike.id}
                        onClick={() => onSelect(bike)}
                        className="w-full flex items-center gap-3 text-left rounded-xl p-2.5 hover:bg-muted/60 transition-colors border border-transparent hover:border-border"
                    >
                        <img
                            src={bike.imageUrl}
                            alt={bike.name}
                            className="w-12 h-10 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='40'%3E%3Crect width='48' height='40' fill='%23f1f5f9'/%3E%3C/svg%3E";
                            }}
                        />
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">{bike.brand}</p>
                            <p className="font-semibold text-sm truncate">{bike.name}</p>
                            <p className="text-xs text-primary">₹{(bike.price / 100000).toFixed(1)}L</p>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground ml-auto flex-shrink-0" />
                    </button>
                ))}
                {filtered.length === 0 && (
                    <p className="text-center text-muted-foreground py-4 text-sm">No bikes found</p>
                )}
            </div>
        </div>
    );
}

const SPECS = [
    { key: "price", label: "Price (Ex-showroom)", format: (v: any) => v ? `₹${Number(v).toLocaleString("en-IN")}` : "N/A" },
    { key: "year", label: "Year", format: (v: any) => v || "N/A" },
    { key: "cc", label: "Engine (CC)", format: (v: any) => v ? `${v} cc` : "N/A" },
    { key: "power", label: "Max Power", format: (v: any) => v || "N/A" },
    { key: "torque", label: "Max Torque", format: (v: any) => v || "N/A" },
    { key: "mileage", label: "Mileage", format: (v: any) => v || "N/A" },
    { key: "topSpeed", label: "Top Speed", format: (v: any) => v || "N/A" },
    { key: "transmission", label: "Transmission", format: (v: any) => v || "N/A" },
    { key: "fuelType", label: "Fuel Type", format: (v: any) => v || "N/A" },
    { key: "abs", label: "ABS", format: (v: any) => v || "N/A" },
    { key: "weight", label: "Weight", format: (v: any) => v || "N/A" },
    { key: "tankCapacity", label: "Tank Capacity", format: (v: any) => v || "N/A" },
];

export default function Compare() {
    const { data: bikes = [], isLoading } = useBikes({});
    const [bike1, setBike1] = useState<Bike | null>(null);
    const [bike2, setBike2] = useState<Bike | null>(null);

    const canCompare = bike1 && bike2;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary/10 via-background to-background py-14 border-b border-border">
                    <div className="container-width text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-3 mb-4"
                        >
                            <ArrowLeftRight className="h-8 w-8 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-display font-bold">Compare Bikes</h1>
                        </motion.div>
                        <p className="text-muted-foreground text-lg">
                            Select two bikes to compare their specifications side by side.
                        </p>
                    </div>
                </div>

                <div className="container-width py-10">
                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-72 bg-muted animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Selectors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <BikeSelector
                                    label="Bike 1"
                                    selectedBike={bike1}
                                    bikes={bikes}
                                    onSelect={setBike1}
                                    onClear={() => setBike1(null)}
                                    otherBikeId={bike2?.id}
                                />
                                <BikeSelector
                                    label="Bike 2"
                                    selectedBike={bike2}
                                    bikes={bikes}
                                    onSelect={setBike2}
                                    onClear={() => setBike2(null)}
                                    otherBikeId={bike1?.id}
                                />
                            </div>

                            {/* Comparison Table */}
                            <AnimatePresence>
                                {canCompare && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 30 }}
                                        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                                    >
                                        <div className="bg-primary/5 border-b border-border p-5 flex items-center gap-2">
                                            <ArrowLeftRight className="h-5 w-5 text-primary" />
                                            <h2 className="text-xl font-bold font-display">Specification Comparison</h2>
                                        </div>

                                        {/* Header Row */}
                                        <div className="grid grid-cols-3 border-b border-border bg-muted/30">
                                            <div className="p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                                                Specification
                                            </div>
                                            <div className="p-4 border-l border-border text-center">
                                                <p className="text-xs text-primary font-semibold uppercase">{bike1!.brand}</p>
                                                <p className="font-bold">{bike1!.name}</p>
                                            </div>
                                            <div className="p-4 border-l border-border text-center">
                                                <p className="text-xs text-primary font-semibold uppercase">{bike2!.brand}</p>
                                                <p className="font-bold">{bike2!.name}</p>
                                            </div>
                                        </div>

                                        {/* Spec Rows */}
                                        {SPECS.map(({ key, label, format }, i) => {
                                            const v1 = (bike1 as any)[key];
                                            const v2 = (bike2 as any)[key];
                                            const isNumericKey = key === "price" || key === "cc" || key === "year";
                                            const betterSide =
                                                isNumericKey && v1 && v2
                                                    ? key === "price"
                                                        ? Number(v1) < Number(v2) ? 1 : Number(v2) < Number(v1) ? 2 : 0
                                                        : Number(v1) > Number(v2) ? 1 : Number(v2) > Number(v1) ? 2 : 0
                                                    : 0;

                                            return (
                                                <div
                                                    key={key}
                                                    className={`grid grid-cols-3 border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                                                >
                                                    <div className="p-4 text-sm font-medium text-muted-foreground">{label}</div>
                                                    <div className={`p-4 border-l border-border text-center text-sm font-semibold ${betterSide === 1 ? "text-green-600" : ""}`}>
                                                        {betterSide === 1 && <Check className="h-3 w-3 text-green-500 inline mr-1" />}
                                                        {format(v1)}
                                                    </div>
                                                    <div className={`p-4 border-l border-border text-center text-sm font-semibold ${betterSide === 2 ? "text-green-600" : ""}`}>
                                                        {betterSide === 2 && <Check className="h-3 w-3 text-green-500 inline mr-1" />}
                                                        {format(v2)}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Footer CTAs */}
                                        <div className="grid grid-cols-3 border-t border-border bg-muted/20 p-4 gap-4">
                                            <div />
                                            <div className="text-center">
                                                <Link href={`/bikes/${bike1!.id}`}>
                                                    <Button className="w-full" size="sm">View {bike1!.name}</Button>
                                                </Link>
                                            </div>
                                            <div className="text-center">
                                                <Link href={`/bikes/${bike2!.id}`}>
                                                    <Button className="w-full" size="sm">View {bike2!.name}</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!canCompare && (
                                <div className="text-center text-muted-foreground py-10 border-2 border-dashed border-border rounded-2xl">
                                    <ArrowLeftRight className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p className="text-lg font-medium">Select two bikes above to compare</p>
                                    <p className="text-sm mt-1">See specs side-by-side to make the best choice!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
