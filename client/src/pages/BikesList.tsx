import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BikeCard } from "@/components/BikeCard";
import { useBikes } from "@/hooks/use-bikes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Filter, X, ChevronDown, SortAsc } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { BikeFilterParams } from "@shared/schema";

export default function BikesList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // State for filters
  const [filters, setFilters] = useState<BikeFilterParams>({
    search: searchParams.get("search") || undefined,
    brand: searchParams.get("brand") || undefined,
    category: searchParams.get("category") || undefined,
    sort: 'latest',
  });

  const [priceRange, setPriceRange] = useState([0, 2000000]); // Max 20L
  
  // Update filters when price range changes (debounced ideally, but direct here for simplicity)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    }));
  }, [priceRange]);

  const { data: bikes, isLoading, error } = useBikes(filters);

  // Filter Handlers
  const handleBrandChange = (brand: string, checked: boolean) => {
    // Note: For simplicity, this handles single brand select. 
    // Multi-select would require array logic in state + backend support.
    setFilters(prev => ({ ...prev, brand: checked ? brand : undefined }));
  };

  const handleClearFilters = () => {
    setFilters({ sort: 'latest' });
    setPriceRange([0, 2000000]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground hover:text-primary">
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["price", "brand", "category"]} className="w-full">
        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 py-4">
              <Slider
                value={priceRange}
                min={0}
                max={2000000}
                step={10000}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm">
                <span>₹{(priceRange[0]/100000).toFixed(1)}L</span>
                <span>₹{(priceRange[1]/100000).toFixed(1)}L</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand Filter */}
        <AccordionItem value="brand">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {["Royal Enfield", "BMW", "KTM", "Ducati", "Kawasaki", "Harley-Davidson", "Triumph"].map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox 
                    id={brand} 
                    checked={filters.brand === brand}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label htmlFor={brand} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {["Trending", "Popular", "Electric", "Upcoming", "Standard"].map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={cat} 
                    checked={filters.category === cat}
                    onCheckedChange={(checked) => setFilters(prev => ({...prev, category: checked ? cat : undefined}))}
                  />
                  <Label htmlFor={cat} className="text-sm font-medium leading-none">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container-width py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6 shadow-sm">
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-3xl font-display font-bold">
                {filters.category ? `${filters.category} Bikes` : "All Premium Bikes"}
                <span className="text-lg font-normal text-muted-foreground ml-2">
                  ({bikes?.length || 0} results)
                </span>
              </h1>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden flex-1">
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filter Bikes</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select 
                  value={filters.sort} 
                  onValueChange={(val: any) => setFilters(prev => ({...prev, sort: val}))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[400px] bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : bikes?.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No bikes found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bikes?.map((bike) => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
