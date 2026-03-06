import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBike } from "@/hooks/use-bikes";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EMICalculator } from "@/components/EMICalculator";
import { useState } from "react";
import {
  Fuel, Gauge, Zap, Weight, Timer, Check,
  Share2, Heart, MessageCircle, Phone, Star, Send, UserCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function BikeDetail() {
  const [, params] = useRoute("/bikes/:id");
  const id = parseInt(params?.id || "0");
  const { data: bike, isLoading, error } = useBike(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/bikes/${id}/reviews`],
    queryFn: () => fetch(`/api/bikes/${id}/reviews`).then(r => r.json()),
    enabled: !!id && !isNaN(id),
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/bikes/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment, guestName }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bikes/${id}/reviews`] });
      setRating(0); setComment(""); setGuestName("");
      toast({ title: "Review submitted! ⭐", description: "Thank you for your feedback." });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container-width py-12">
          <div className="h-[500px] bg-muted animate-pulse rounded-3xl mb-8" />
          <div className="h-20 bg-muted animate-pulse rounded-xl mb-4 w-1/3" />
          <div className="h-10 bg-muted animate-pulse rounded-xl mb-8 w-1/4" />
        </div>
      </div>
    );
  }

  if (error || !bike) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold mb-4">Bike not found</h2>
          <Link href="/bikes"><Button>Back to Bikes</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    const text = `Check out this bike: ${bike?.name} at ₹${bike ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(bike.price) : ''} – ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumSignificantDigits: 3,
  }).format(bike.price);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border py-3">
          <div className="container-width text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/bikes" className="hover:text-primary">Bikes</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{bike.name}</span>
          </div>
        </div>

        <div className="container-width pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left Column */}
            <div className="lg:col-span-8 space-y-8">

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-white aspect-[16/10]"
              >
                <img src={bike.imageUrl} alt={bike.name} className="w-full h-full object-cover object-center" />
                {bike.category === "Trending" && (
                  <Badge className="absolute top-4 left-4 text-base py-1 px-3 bg-primary text-primary-foreground border-none">Trending</Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90 hover:text-red-500">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Description */}
              <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                <h2 className="text-2xl font-bold font-display mb-4">About {bike.name}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {bike.description || `Experience the thrill of the ${bike.name}. Designed for performance and comfort, this machine features a powerful ${bike.cc}cc engine.`}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Gauge, label: "Engine", value: `${bike.cc} cc` },
                  { icon: Zap, label: "Power", value: bike.power || "N/A" },
                  { icon: Timer, label: "Torque", value: bike.torque || "N/A" },
                  { icon: Fuel, label: "Mileage", value: bike.mileage || "N/A" },
                  { icon: Gauge, label: "Top Speed", value: bike.topSpeed || "N/A" },
                  { icon: Weight, label: "Weight", value: bike.weight || "N/A" },
                  { icon: Fuel, label: "Fuel Type", value: bike.fuelType || "Petrol" },
                  { icon: Check, label: "ABS", value: bike.abs || "Standard" },
                ].map((spec, i) => (
                  <div key={i} className="bg-muted/30 p-4 rounded-xl border border-border flex flex-col items-center text-center hover:bg-muted/50 transition-colors">
                    <spec.icon className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">{spec.label}</span>
                    <span className="font-semibold text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* ─── REVIEWS ─── */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-border">
                  <h2 className="text-2xl font-bold font-display">Customer Reviews</h2>
                  {avgRating && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`h-4 w-4 ${Number(avgRating) >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="font-semibold">{avgRating}</span>
                      <span className="text-muted-foreground text-sm">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                    </div>
                  )}
                </div>

                {/* Write Review Form */}
                <div className="p-6 md:p-8 border-b border-border bg-muted/20">
                  <h3 className="font-semibold text-lg mb-4">Write a Review</h3>

                  {!user && (
                    <div className="mb-4">
                      <label className="block text-sm text-muted-foreground mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm text-muted-foreground mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s} type="button"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(s)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star className={`h-8 w-8 transition-colors ${(hoverRating || rating) >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-muted-foreground mb-1">Comment</label>
                    <textarea
                      rows={3}
                      placeholder="Share your experience with this bike..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="w-full border border-border rounded-xl px-4 py-2.5 bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <Button
                    onClick={() => reviewMutation.mutate()}
                    disabled={!rating || comment.length < 5 || reviewMutation.isPending || (!user && !guestName.trim())}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </Button>

                  {!user && (
                    <p className="text-sm text-muted-foreground mt-3">
                      <Link href="/login" className="text-primary hover:underline font-medium">Login</Link>{" "}
                      to review with your account name
                    </p>
                  )}
                </div>

                {/* Reviews List */}
                <div className="divide-y divide-border">
                  {reviewsLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading reviews...</div>
                  ) : reviews.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No reviews yet. Be the first to review this bike! 🏍️
                    </div>
                  ) : (
                    reviews.map((review: any) => (
                      <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <UserCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-semibold">{review.reviewerName || "Anonymous"}</span>
                              <span className="text-xs text-muted-foreground">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                              </span>
                            </div>
                            <div className="flex mt-1 mb-2">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`h-4 w-4 ${review.rating >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
              {/* ─── END REVIEWS ─── */}

            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">

                {/* Price Card */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">{bike.brand}</p>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{bike.name}</h1>
                  <div className="mt-4 pb-6 border-b border-dashed border-border">
                    <span className="text-4xl font-bold text-foreground block">{formattedPrice}</span>
                    <span className="text-sm text-muted-foreground">Ex-showroom Price</span>
                  </div>
                  <div className="pt-6 space-y-3">
                    <Button
                      className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        const msg = `Hello Rakesh,\nI am interested in:\n\nBike: ${bike.name}\nPrice: ${formattedPrice}\nYear: ${bike.year}\n\nPlease share details.`;
                        window.open(`https://wa.me/919390389606?text=${encodeURIComponent(msg)}`, "_blank");
                      }}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Get WhatsApp Offer
                    </Button>
                    <Button variant="outline" className="w-full h-12 text-lg border-primary text-primary hover:bg-primary/5">
                      <Phone className="mr-2 h-5 w-5" />
                      Request Call Back
                    </Button>
                  </div>
                </div>

                {/* Colors */}
                {bike.availableColors && (bike.availableColors as string[]).length > 0 && (
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                    <h3 className="font-bold mb-4">Available Colors</h3>
                    <div className="flex gap-3 flex-wrap">
                      {(bike.availableColors as string[]).map(color => (
                        <div key={color} className="group relative">
                          <div
                            className="w-10 h-10 rounded-full border border-border shadow-sm cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color.toLowerCase().replace(/ /g, "") }}
                            title={color}
                          />
                          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-opacity">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <EMICalculator price={bike.price} />

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
