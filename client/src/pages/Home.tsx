import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BikeCard } from "@/components/BikeCard";
import { useBikes } from "@/hooks/use-bikes";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

// Images
import heroBg from "/images/hero-superbike.png"; 

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: trendingBikes, isLoading: isTrendingLoading } = useBikes({ category: "Trending" });
  const { data: popularBikes, isLoading: isPopularLoading } = useBikes({ category: "Popular" });

  const brands = [
    { name: "Royal Enfield", logo: "https://www.bikewale.com/m/brandlogos/royal-enfield.png" },
    { name: "BMW", logo: "https://www.bikewale.com/m/brandlogos/bmw.png" },
    { name: "KTM", logo: "https://www.bikewale.com/m/brandlogos/ktm.png" },
    { name: "Ducati", logo: "https://www.bikewale.com/m/brandlogos/ducati.png" },
    { name: "Kawasaki", logo: "https://www.bikewale.com/m/brandlogos/kawasaki.png" },
    { name: "Harley-Davidson", logo: "https://www.bikewale.com/m/brandlogos/harley-davidson.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

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
        <div className="absolute inset-0 bg-[url('https://pixabay.com/get/gda7f0028a96de672b46dc8ef442e328b6623d7bab2c73f5b07ab88382fb3d8eba829c5892d8d0036880fa300f40180e5ddc12af902725a52b5f74c8375d5a20c_1280.jpg')] bg-cover bg-center opacity-20 fixed-bg" />
        <div className="container-width relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/50 text-xs font-bold uppercase tracking-wider mb-4">
              Limited Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Get 0% Interest on <br /> Select Superbikes
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Drive home your dream bike today with our exclusive financing partners. 
              Limited time offer for premium models.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Check Eligibility
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                View Models
              </Button>
            </div>
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
