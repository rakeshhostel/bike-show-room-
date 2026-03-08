import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, ChevronDown, ChevronUp, IndianRupee } from "lucide-react";

interface OnRoadCalculatorProps {
    price: number;
}

// Pincode prefix → State info (road tax rate, state name)
const PINCODE_STATE_MAP: Record<string, { state: string; roadTax: number }> = {
    "11": { state: "Delhi", roadTax: 4 },
    "12": { state: "Haryana", roadTax: 5 },
    "13": { state: "Haryana", roadTax: 5 },
    "14": { state: "Punjab", roadTax: 3 },
    "15": { state: "Punjab", roadTax: 3 },
    "16": { state: "Punjab", roadTax: 3 },
    "17": { state: "Himachal Pradesh", roadTax: 3 },
    "18": { state: "Jammu & Kashmir", roadTax: 4 },
    "19": { state: "Jammu & Kashmir", roadTax: 4 },
    "20": { state: "Uttar Pradesh", roadTax: 9 },
    "21": { state: "Uttar Pradesh", roadTax: 9 },
    "22": { state: "Uttar Pradesh", roadTax: 9 },
    "23": { state: "Uttar Pradesh", roadTax: 9 },
    "24": { state: "Uttar Pradesh", roadTax: 9 },
    "25": { state: "Uttar Pradesh", roadTax: 9 },
    "26": { state: "Uttar Pradesh", roadTax: 9 },
    "27": { state: "Uttar Pradesh", roadTax: 9 },
    "28": { state: "Uttar Pradesh", roadTax: 9 },
    "30": { state: "Rajasthan", roadTax: 8 },
    "31": { state: "Rajasthan", roadTax: 8 },
    "32": { state: "Rajasthan", roadTax: 8 },
    "33": { state: "Rajasthan", roadTax: 8 },
    "34": { state: "Rajasthan", roadTax: 8 },
    "36": { state: "Gujarat", roadTax: 6 },
    "37": { state: "Gujarat", roadTax: 6 },
    "38": { state: "Gujarat", roadTax: 6 },
    "39": { state: "Gujarat", roadTax: 6 },
    "40": { state: "Maharashtra", roadTax: 7 },
    "41": { state: "Maharashtra", roadTax: 7 },
    "42": { state: "Maharashtra", roadTax: 7 },
    "43": { state: "Maharashtra", roadTax: 7 },
    "44": { state: "Maharashtra", roadTax: 7 },
    "45": { state: "Madhya Pradesh", roadTax: 7 },
    "46": { state: "Madhya Pradesh", roadTax: 7 },
    "47": { state: "Madhya Pradesh", roadTax: 7 },
    "48": { state: "Chhattisgarh", roadTax: 7 },
    "49": { state: "Chhattisgarh", roadTax: 7 },
    "50": { state: "Telangana", roadTax: 12 },
    "51": { state: "Andhra Pradesh", roadTax: 12 },
    "52": { state: "Andhra Pradesh", roadTax: 12 },
    "53": { state: "Andhra Pradesh", roadTax: 12 },
    "56": { state: "Karnataka", roadTax: 12 },
    "57": { state: "Karnataka", roadTax: 12 },
    "58": { state: "Goa", roadTax: 7 },
    "60": { state: "Tamil Nadu", roadTax: 8 },
    "61": { state: "Tamil Nadu", roadTax: 8 },
    "62": { state: "Tamil Nadu", roadTax: 8 },
    "63": { state: "Tamil Nadu", roadTax: 8 },
    "64": { state: "Tamil Nadu", roadTax: 8 },
    "67": { state: "Kerala", roadTax: 9 },
    "68": { state: "Kerala", roadTax: 9 },
    "69": { state: "Kerala", roadTax: 9 },
    "70": { state: "West Bengal", roadTax: 5 },
    "71": { state: "West Bengal", roadTax: 5 },
    "72": { state: "West Bengal", roadTax: 5 },
    "73": { state: "West Bengal", roadTax: 5 },
    "74": { state: "West Bengal", roadTax: 5 },
    "75": { state: "Odisha", roadTax: 4 },
    "76": { state: "Odisha", roadTax: 4 },
    "77": { state: "Odisha", roadTax: 4 },
    "78": { state: "Assam", roadTax: 5 },
    "79": { state: "North East India", roadTax: 4 },
    "80": { state: "Bihar", roadTax: 6 },
    "81": { state: "Bihar", roadTax: 6 },
    "82": { state: "Jharkhand", roadTax: 5 },
    "83": { state: "Jharkhand", roadTax: 5 },
    "84": { state: "Bihar", roadTax: 6 },
    "85": { state: "Bihar", roadTax: 6 },
};

function getStateInfo(pincode: string): { state: string; roadTax: number } | null {
    if (pincode.length < 2) return null;
    const prefix = pincode.slice(0, 2);
    return PINCODE_STATE_MAP[prefix] || null;
}

function fmt(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function OnRoadCalculator({ price }: OnRoadCalculatorProps) {
    const [pincode, setPincode] = useState("");
    const [showBreakdown, setShowBreakdown] = useState(false);

    const stateInfo = getStateInfo(pincode);

    // Calculate charges
    const roadTaxAmt = stateInfo ? Math.round(price * stateInfo.roadTax / 100) : 0;
    const insurance = Math.round(price * 0.025 + 1200); // ~2.5% of price + ₹1200 3rd party
    const regFee = 500; // Standard registration fee
    const handling = 2000; // Handling/logistics

    const onRoadPrice = price + roadTaxAmt + insurance + regFee + handling;

    const rows = [
        { label: "Ex-Showroom Price", amount: price, highlight: false },
        { label: `Road Tax (${stateInfo?.roadTax ?? 0}% – ${stateInfo?.state ?? "—"})`, amount: roadTaxAmt, highlight: false },
        { label: "1st Year Insurance (Comprehensive)", amount: insurance, highlight: false },
        { label: "Registration Charges", amount: regFee, highlight: false },
        { label: "Handling & Logistics", amount: handling, highlight: false },
    ];

    return (
        <Card className="bg-slate-50 border-border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    On-Road Price Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

                {/* Pincode Input */}
                <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Enter Your Pincode</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="e.g. 508207"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                            className="pr-10 text-base font-medium tracking-widest"
                        />
                        <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {pincode.length >= 2 && !stateInfo && (
                        <p className="text-xs text-red-500">Invalid pincode. Please try again.</p>
                    )}
                    {stateInfo && (
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            ✅ State detected: {stateInfo.state} — Road Tax: {stateInfo.roadTax}%
                        </p>
                    )}
                </div>

                {/* Result Card */}
                {stateInfo ? (
                    <>
                        <div className="bg-primary/10 rounded-xl p-4 text-center">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                                On-Road Price in {stateInfo.state}
                            </span>
                            <span className="text-3xl font-display font-bold text-primary">{fmt(onRoadPrice)}</span>
                        </div>

                        {/* Breakdown Toggle */}
                        <button
                            onClick={() => setShowBreakdown(!showBreakdown)}
                            className="w-full flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors px-1"
                        >
                            <span>{showBreakdown ? "Hide" : "View"} Price Breakdown</span>
                            {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {showBreakdown && (
                            <div className="space-y-2 border border-border rounded-xl overflow-hidden text-sm">
                                {rows.map(({ label, amount }) => (
                                    <div key={label} className="flex justify-between items-center px-4 py-2.5 odd:bg-muted/30">
                                        <span className="text-muted-foreground">{label}</span>
                                        <span className="font-semibold">{fmt(amount)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center px-4 py-3 bg-primary/10 font-bold text-primary">
                                    <span>Total On-Road Price</span>
                                    <span>{fmt(onRoadPrice)}</span>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                        <IndianRupee className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        Enter your pincode above to calculate the on-road price in your state
                    </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                    * Prices are indicative. Actual charges may vary by dealer.
                </p>
            </CardContent>
        </Card>
    );
}
