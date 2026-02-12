import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useBike } from "@/hooks/use-bikes";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EMICalculator } from "@/components/EMICalculator";
import { 
  Fuel, 
  Gauge, 
  Zap, 
  Weight, 
  Timer, 
  Check, 
  Share2, 
  Heart, 
  MessageCircle,
  Phone
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function BikeDetail() {
  const [match, params] = useRoute("/bikes/:id");
  const id = parseInt(params?.id || "0");
  const { data: bike, isLoading, error } = useBike(id);
  const { user } = useAuth();
  const { toast } = useToast();

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
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Bike details link copied to clipboard.",
    });
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumSignificantDigits: 3
  }).format(bike.price);

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
            
            {/* Left Column: Image & Gallery */}
            <div className="lg:col-span-8 space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-white aspect-[16/10]"
              >
                <img 
                  src={bike.imageUrl} 
                  alt={bike.name} 
                  className="w-full h-full object-cover object-center"
                />
                {bike.category === 'Trending' && (
                  <Badge className="absolute top-4 left-4 text-base py-1 px-3 bg-primary text-primary-foreground border-none">
                    Trending
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full shadow-md bg-white/90 hover:text-red-500"
                    onClick={() => {
                      if (!user) window.location.href = "/api/login";
                      // Add favorite
                    }}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Description */}
              <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                <h2 className="text-2xl font-bold font-display mb-4">About {bike.name}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {bike.description || `Experience the thrill of the ${bike.name}. Designed for performance and comfort, this machine features a powerful ${bike.cc}cc engine and cutting-edge technology.`}
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
            </div>

            {/* Right Column: Price & Actions */}
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
                    <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                        const message = `Hello Rakesh,
I am interested in this bike:

Bike Name: ${bike.name}
Price: ${formattedPrice}
Manufactured Year: ${bike.year}

Please share full details and availability.`;
                        window.open(`https://wa.me/919390389606?text=${encodeURIComponent(message)}`, '_blank');
                    }}>
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Get WhatsApp Offer
                    </Button>
                    <Button variant="outline" className="w-full h-12 text-lg border-primary text-primary hover:bg-primary/5">
                      <Phone className="mr-2 h-5 w-5" />
                      Request Call Back
                    </Button>
                  </div>
                </div>

                {/* Available Colors */}
                {bike.availableColors && (bike.availableColors as string[]).length > 0 && (
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                    <h3 className="font-bold mb-4">Available Colors</h3>
                    <div className="flex gap-3">
                      {(bike.availableColors as string[]).map((color) => (
                        <div key={color} className="group relative">
                          <div 
                            className="w-10 h-10 rounded-full border border-border shadow-sm cursor-pointer hover:scale-110 transition-transform" 
                            style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
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

                {/* EMI Calculator */}
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
