import { Link } from "wouter";
import { Bike } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Fuel, Gauge, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

interface BikeCardProps {
  bike: Bike;
}

export function BikeCard({ bike }: BikeCardProps) {
  const { user } = useAuth();

  // Format price to Indian Rupee
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumSignificantDigits: 3
  }).format(bike.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
          <img
            src={bike.imageUrl}
            alt={bike.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:text-red-500 transition-colors shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                if (!user) window.location.href = "/api/login";
                // Add favorite logic here
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          {bike.category === 'Trending' && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-none">
              Trending
            </Badge>
          )}
        </div>

        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">{bike.brand}</p>
              <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {bike.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="block font-bold text-lg">{formattedPrice}</span>
              <span className="text-xs text-muted-foreground">Ex-showroom</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 py-3 border-t border-dashed border-border">
            <div className="flex flex-col items-center text-center">
              <Gauge className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs font-medium">{bike.cc} cc</span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-border px-2">
              <Zap className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs font-medium">{bike.power || 'N/A'}</span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-border">
              <Fuel className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs font-medium">{bike.mileage || 'N/A'}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 gap-3">
          <Link href={`/bikes/${bike.id}`} className="w-full">
            <Button className="w-full bg-foreground hover:bg-primary text-white transition-colors duration-300">
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary"
            onClick={() => {
              const text = `Hi, I'm interested in the ${bike.name}. Can you provide more details?`;
              window.open(`https://wa.me/919390389606?text=${encodeURIComponent(text)}`, '_blank');
            }}
          >
            Enquire
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
