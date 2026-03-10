import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BikeCard } from "@/components/BikeCard";
import { useBikes } from "@/hooks/use-bikes";
import { useSlowLoading } from "@/hooks/use-slow-loading";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

// Images
import heroBg from "/images/hero-superbike.png";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: trendingBikes, isLoading: isTrendingLoading, error: trendingError } = useBikes({ category: "Trending" });
  const { data: popularBikes, isLoading: isPopularLoading, error: popularError } = useBikes({ category: "Popular" });
  const isSlowLoading = useSlowLoading(isTrendingLoading || isPopularLoading);

  const brands = [
    { name: "Royal Enfield", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsQDRulkCzlr79ijhXZ1pNvZfZnirKZTlpIg&s" },
    { name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/3840px-BMW.svg.png" },
    { name: "KTM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/KTM-Logo.svg/3840px-KTM-Logo.svg.png" },
    { name: "Ducati", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSle7K6Mv2VsssJmACIzLIYfcNAr9zSKrfSMA&s" },
    { name: "Kawasaki", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBqepXLTpSdYz6i15T3F19COivoePjXwOuYw&s" },
    { name: "Harley-Davidson", logo: "https://assets.simpleviewinc.com/simpleview/image/upload/crm/milwaukee/Harley-Davidson-Logo.wine_23D88B21-B75E-7261-82A1A1A1B60460E9-23d88773056231e_23d8992b-ecf8-9d6b-4e5eab77bef635c5.png" },
    { name: "Honda", logo: "https://i.pinimg.com/736x/da/9c/a5/da9ca5610b6a94b59294e9cc37657cb1.jpg" },
    { name: "Yamaha", logo: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/yamaha-logo-design-template-2a186d04b863b074df7c64226ab79f4b_screen.jpg?ts=1714269679" },
    { name: "TVS", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR80vY-kPcH2XiDizZ-gJ0sZ6Szz6IOYnWvRg&s" },
    { name: "Hero", logo: "https://www.logo.wine/a/logo/Hero_MotoCorp/Hero_MotoCorp-Logo.wine.svg" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Cold-start warm-up banner */}
      {isSlowLoading && (
        <div className="w-full bg-amber-500/10 border-b border-amber-500/30 text-amber-700 dark:text-amber-400 px-4 py-2 text-sm text-center flex items-center justify-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Server is waking up on Render's free tier — this may take up to 60 seconds. Please wait…
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <img
            src={heroBg}
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content */}
        <div className="container-width relative z-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Ride Your <br />
              <span className="text-primary">Dream Machine</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 font-light">
              Explore the finest collection of premium superbikes.
              Performance, luxury, and thrill awaits.
            </p>

            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 flex gap-2 max-w-lg">
              <Input
                placeholder="Search by brand or model..."
                className="bg-transparent border-none text-white placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Link href={`/bikes?search=${search}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold">
                  <Search className="mr-2 h-5 w-5" /> Find Bike
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span>Verified Dealers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Best Prices</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container-width">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {brands.map((brand) => (
              <Link key={brand.name} href={`/bikes?brand=${brand.name}`}>
                <img src={brand.logo} alt={brand.name} className="h-12 md:h-16 w-auto object-contain hover:scale-110 transition-transform cursor-pointer" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20">
        <div className="container-width">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Trending Now</h2>
              <p className="text-muted-foreground mt-2">The most sought-after machines this week</p>
            </div>
            <Link href="/bikes?category=Trending">
              <Button variant="outline" className="hidden sm:flex group">
                View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isTrendingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[380px] bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : trendingError ? (
            <p className="text-center text-muted-foreground py-10">Could not load trending bikes. Please try refreshing.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingBikes?.slice(0, 4).map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/bikes?category=Trending">
              <Button variant="outline" className="w-full">View All</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background with mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 fixed-bg" />

        <div className="container-width relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center py-1 px-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 text-xs font-bold uppercase tracking-wider">
                🔥 Special Deal
              </span>
              <span className="inline-flex items-center justify-center py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/50 text-xs font-bold uppercase tracking-wider">
                Featured Bike
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
              Ducati Panigale V4 S
            </h2>

            <div className="flex items-end gap-3 mb-6">
              <p className="text-3xl font-display font-bold text-primary">₹33,48,000</p>
              <p className="text-lg text-slate-400 line-through pb-1 decoration-red-500/50">₹35,00,000</p>
            </div>

            <p className="text-lg text-slate-300 mb-8 max-w-md font-light leading-relaxed">
              Experience the pinnacle of Italian engineering. <strong className="text-white font-medium">Free 1st year comprehensive insurance</strong> and zero handling charges on bookings this week.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/bikes?search=Ducati">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] border-transparent transition-all hover:scale-105">
                  View Offer Details
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all hover:scale-105">
                  Book Test Ride
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative w-full max-w-lg">
            {/* Glow effect behind the image */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
              alt="Featured Ducati Panigale"
              className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover aspect-[4/3] border border-white/10 group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Popular Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-width">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Popular Picks</h2>
              <p className="text-muted-foreground mt-2">Top rated bikes loved by riders</p>
            </div>
            <Link href="/bikes?category=Popular">
              <Button variant="outline" className="hidden sm:flex group">
                View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isPopularLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[380px] bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : popularError ? (
            <p className="text-center text-muted-foreground py-10">Could not load popular bikes. Please try refreshing.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularBikes?.slice(0, 4).map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
