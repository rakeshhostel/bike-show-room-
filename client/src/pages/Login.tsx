import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
    const [tab, setTab] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const { login, register, isLoggingIn, isRegistering } = useAuth();
    const { toast } = useToast();
    const [, navigate] = useLocation();

    const isLoading = isLoggingIn || isRegistering;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (tab === "login") {
                await login({ email, password });
                toast({ title: "Welcome back! 🏍️", description: "You are now logged in." });
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-4"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <a href="/" className="inline-flex items-center gap-3 text-white">
                        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <Bike className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                            <div className="text-xl font-bold leading-tight">Rakesh Premium</div>
                            <div className="text-sm text-orange-400 font-medium">Bikes</div>
                        </div>
                    </a>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Tabs */}
                    <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
                        {(["login", "register"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === t
                                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {t === "login" ? "Login" : "Register"}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {tab === "register" && (
                                <motion.div
                                    key="name"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required={tab === "register"}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder={tab === "register" ? "Password (min 6 chars)" : "Password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-200 mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {tab === "login" ? "Logging in..." : "Creating account..."}
                                </span>
                            ) : (
                                tab === "login" ? "Login" : "Create Account"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setTab(tab === "login" ? "register" : "login")}
                            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                        >
                            {tab === "login" ? "Register" : "Login"}
                        </button>
                    </p>
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                    <a href="/" className="hover:text-gray-400 transition-colors">← Back to Home</a>
                </p>
            </motion.div>
        </div>
    );
}
