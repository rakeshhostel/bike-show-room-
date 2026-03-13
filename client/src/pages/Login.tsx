import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import logoImg from "/images/logo.png";

function GoogleLogo() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.5 13 17.8 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9C43.7 37.3 46.5 31.4 46.5 24.5z" />
            <path fill="#FBBC05" d="M10.5 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A23.8 23.8 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8-6z" />
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.6-5.9c-2 1.4-4.6 2.2-7.6 2.2-6.2 0-11.5-3.5-13.5-8.5l-7.9 6.1C6.5 42.5 14.6 48 24 48z" />
        </svg>
    );
}

const BIKE_BRANDS = [
    { name: "Yamaha", logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Yamaha_Logo.svg" },
    { name: "KTM", logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/KTM-Logo.svg" },
    { name: "Royal Enfield", logo: "https://upload.wikimedia.org/wikipedia/commons/3/38/Royal_Enfield_logo.svg" },
    { name: "Honda", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg" },
    { name: "Kawasaki", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Kawasaki_motorcycle_logo.svg" },
    { name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
    { name: "Ducati", logo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Ducati_red_logo.svg" },
    { name: "TVS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/TVS_Motor_Company_logo.svg" },
    { name: "Hero", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Hero_MotoCorp_Logo.svg" },
    { name: "Bajaj", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Bajaj_Auto_Logo.svg" },
];

function BrandTicker() {
    const doubled = [...BIKE_BRANDS, ...BIKE_BRANDS];
    return (
        <div className="overflow-hidden w-full" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
            <motion.div className="flex gap-10 items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                style={{ width: "max-content" }}
            >
                {doubled.map((brand, i) => (
                    <div key={i} className="flex items-center gap-2 flex-shrink-0 opacity-30 hover:opacity-70 transition-opacity duration-300">
                        <img src={brand.logo} alt={brand.name} className="h-6 w-auto object-contain"
                            style={{ filter: "brightness(0) invert(1)" }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <span className="text-xs font-bold tracking-widest text-white uppercase whitespace-nowrap">{brand.name}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

// Brand colors updated for a cool, sleek, premium tech aesthetic
const BG_BASE = "#020617"; // Ultra dark slate/navy
const BG_GLOW = "#0f172a"; // Deep cool slate
const ACCENT_CYAN = "#06b6d4"; // Electric cyan
const ACCENT_BLUE = "#3b82f6"; // Brilliant sapphire blue

function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Rich gradient base */}
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${BG_BASE} 0%, ${BG_GLOW} 50%, #000000 100%)` }} />

            {/* Massive soft glowing orbs */}
            <motion.div className="absolute"
                style={{ top: "-10%", left: "-10%", width: "80%", height: "80%", background: `radial-gradient(ellipse, rgba(6,182,212,0.15) 0%, transparent 60%)`, borderRadius: "50%" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div className="absolute"
                style={{ bottom: "-20%", right: "-10%", width: "70%", height: "70%", background: `radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 60%)`, borderRadius: "50%" }}
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div className="absolute"
                style={{ top: "40%", right: "20%", width: "50%", height: "50%", background: `radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 60%)`, borderRadius: "50%" }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Glowing Grid overlay */}
            <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
                maskImage: "radial-gradient(ellipse at center, black, transparent 80%)"
            }} />

            {/* Beautiful floating sparks */}
            {[...Array(15)].map((_, i) => (
                <motion.div key={i} className="absolute rounded-full"
                    style={{
                        width: i % 2 === 0 ? 3 : 4, height: i % 2 === 0 ? 3 : 4,
                        background: i % 3 === 0 ? ACCENT_CYAN : i % 3 === 1 ? ACCENT_BLUE : "#e0f2fe",
                        boxShadow: `0 0 12px ${i % 3 === 0 ? ACCENT_CYAN : i % 3 === 1 ? ACCENT_BLUE : "#e0f2fe"}`,
                        left: `${5 + (i * 7)}%`, top: `${10 + (i % 6) * 15}%`,
                    }}
                    animate={{ y: [0, -80, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                />
            ))}
        </div>
    );
}

function InputField({ icon, type, placeholder, value, onChange, required, rightElement }: {
    icon: React.ReactNode; type: string; placeholder: string; value: string;
    onChange: (v: string) => void; required?: boolean; rightElement?: React.ReactNode;
}) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="relative group">
            {focused && <div className="absolute inset-0 rounded-xl blur-lg opacity-40 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${ACCENT_CYAN}, ${ACCENT_BLUE})` }} />}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 transition-colors duration-500"
                style={{ color: focused ? ACCENT_CYAN : "rgba(255,255,255,0.4)" }}>{icon}</div>
            <input
                type={type} placeholder={placeholder} value={value}
                onChange={e => onChange(e.target.value)} required={required}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                className="relative z-10 w-full py-4 pl-12 pr-12 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
                style={{
                    background: focused ? "rgba(10,15,30,0.8)" : "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(12px)",
                    border: focused ? `1px solid rgba(6,182,212,0.6)` : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: focused ? `0 0 0 4px rgba(6,182,212,0.15)` : "none",
                    fontFamily: "Outfit, sans-serif",
                }}
            />
            {rightElement && <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">{rightElement}</div>}
        </div>
    );
}

export default function Login() {
    const [tab, setTab] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const { login, register, isLoggingIn, isRegistering, user } = useAuth();
    const { toast } = useToast();
    const [, navigate] = useLocation();

    useEffect(() => { if (user) navigate("/"); }, [user]);
    const isLoading = isLoggingIn || isRegistering;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (tab === "login") {
                await login({ email, password });
                toast({ title: "Welcome back! 🏍️", description: "You're now logged in." });
            } else {
                await register({ name, email, password });
                toast({ title: "Account created! 🎉", description: "Welcome to Rakesh Premium Bikes." });
            }
            navigate("/");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ fontFamily: "Outfit, sans-serif", backgroundColor: BG_BASE }}>
            <AnimatedBackground />

            {/* Scrolling brand ticker - top */}
            <div className="relative z-10 pt-5 pb-3"><BrandTicker /></div>

            {/* Main centered content */}
            <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[440px]"
                >
                    {/* ── Actual Brand Logo ── */}
                    <div className="text-center mb-8">
                        <a href="/" className="inline-flex flex-col items-center gap-2 group">
                            <div className="relative">
                                {/* Intense Cyan/Blue glow behind logo */}
                                <div className="absolute inset-0 blur-3xl opacity-50 scale-110"
                                    style={{ background: `radial-gradient(ellipse, ${ACCENT_CYAN} 0%, transparent 60%)` }} />
                                <motion.img
                                    src={logoImg}
                                    alt="Rakesh Premium Bikes"
                                    className="relative h-28 w-auto object-contain"
                                    style={{ filter: `drop-shadow(0 0 25px rgba(6,182,212,0.6))` }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 280 }}
                                />
                            </div>
                            {/* Tagline with cyan/blue gradient accent lines */}
                            <div className="flex items-center gap-4 mt-3">
                                <div className="h-[2px] w-12 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_CYAN})` }} />
                                <span className="text-sm tracking-wide font-medium text-white/90" style={{ textShadow: "0 0 10px rgba(6,182,212,0.4)" }}>Your electric dream awaits ✨</span>
                                <div className="h-[2px] w-12 rounded-full" style={{ background: `linear-gradient(90deg, ${ACCENT_BLUE}, transparent)` }} />
                            </div>
                        </a>
                    </div>

                    {/* ── Premium Glassmorphism Card ── */}
                    <div className="relative rounded-[2.5rem] overflow-hidden"
                        style={{
                            background: "linear-gradient(160deg, rgba(15,23,42,0.6) 0%, rgba(2,6,23,0.8) 100%)",
                            backdropFilter: "blur(40px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 40px 100px rgba(0,0,0,0.9), inset 0 2px 20px rgba(255,255,255,0.05)",
                        }}
                    >
                        {/* Top animated shimmer border */}
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_CYAN} 30%, ${ACCENT_BLUE} 50%, ${ACCENT_CYAN} 70%, transparent)` }} />

                        <div className="px-8 py-10">
                            {/* Tabs */}
                            <div className="flex rounded-2xl p-1.5 mb-8"
                                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.04)", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)" }}>
                                {(["login", "register"] as const).map((t) => (
                                    <button key={t} onClick={() => setTab(t)}
                                        className="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10"
                                        style={{ color: tab === t ? "white" : "rgba(255,255,255,0.4)" }}
                                    >
                                        {tab === t && (
                                            <motion.div layoutId="tab-bg"
                                                className="absolute inset-0 rounded-xl"
                                                style={{ background: `linear-gradient(135deg, ${ACCENT_CYAN}, ${ACCENT_BLUE})`, boxShadow: `0 4px 20px rgba(6,182,212,0.4)` }}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                            />
                                        )}
                                        <span className="relative z-10 tracking-wide">{t === "login" ? "Sign In" : "Create Account"}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Google Button */}
                            <motion.a href="/api/auth/google"
                                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-sm mb-6 relative overflow-hidden group"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))" }} />
                                <GoogleLogo />
                                <span className="relative z-10 tracking-wide">Continue with Google</span>
                            </motion.a>

                            {/* Divider */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15))" }} />
                                <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white/40">or</span>
                                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.15), transparent)" }} />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {tab === "register" && (
                                        <motion.div key="name-field"
                                            initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: "auto", scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <InputField icon={<User className="w-[18px] h-[18px]" />} type="text" placeholder="Full Name" value={name} onChange={setName} required />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <InputField icon={<Mail className="w-[18px] h-[18px]" />} type="email" placeholder="Email address" value={email} onChange={setEmail} required />

                                <InputField
                                    icon={<Lock className="w-[18px] h-[18px]" />}
                                    type={showPass ? "text" : "password"}
                                    placeholder={tab === "register" ? "Create a strong password" : "Password"}
                                    value={password} onChange={setPassword} required
                                    rightElement={
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="text-white/40 hover:text-white transition-colors" style={{ padding: '8px' }}>
                                            {showPass ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                        </button>
                                    }
                                />

                                {/* Glowing Submit Button */}
                                <motion.button type="submit" disabled={isLoading}
                                    whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 relative overflow-hidden mt-4 shadow-xl"
                                    style={{
                                        background: isLoading ? "rgba(6,182,212,0.3)" : `linear-gradient(135deg, ${ACCENT_CYAN} 0%, ${ACCENT_BLUE} 100%)`,
                                        boxShadow: isLoading ? "none" : `0 10px 40px rgba(6,182,212,0.4), inset 0 2px 0 rgba(255,255,255,0.3)`,
                                        fontSize: "0.95rem",
                                        letterSpacing: "0.03em"
                                    }}
                                >
                                    {/* Glass shine effect */}
                                    {!isLoading && (
                                        <motion.div className="absolute inset-0 pointer-events-none"
                                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)", x: "-100%" }}
                                            animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                                        />
                                    )}
                                    {isLoading ? (
                                        <span className="flex items-center gap-3 relative z-10">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            {tab === "login" ? "Signing In..." : "Creating Account..."}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 relative z-10">
                                            {tab === "login" ? "Sign In" : "Create Account"} <ArrowRight className="w-[18px] h-[18px]" />
                                        </span>
                                    )}
                                </motion.button>
                            </form>

                            {/* Switch tab */}
                            <p className="text-center text-[13px] mt-8 text-white/50 tracking-wide">
                                {tab === "login" ? "New to Rakesh Bikes? " : "Already have an account? "}
                                <button onClick={() => setTab(tab === "login" ? "register" : "login")}
                                    className="font-bold hover:text-white transition-colors ml-1" style={{ color: ACCENT_CYAN }}>
                                    {tab === "login" ? "Create an account" : "Sign in now"}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Back to home */}
                    <p className="text-center mt-6">
                        <a href="/" className="text-[13px] font-medium text-white/30 hover:text-white/80 transition-colors flex items-center justify-center gap-1">
                            <ArrowRight className="w-3 h-3 rotate-180" /> Back to Home
                        </a>
                    </p>
                </motion.div>
            </div>

            {/* Scrolling brand ticker - bottom */}
            <div className="relative z-10 pb-5 pt-3"><BrandTicker /></div>
        </div>
    );
}
