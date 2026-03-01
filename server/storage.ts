import { users, type User, type UpsertUser, bikes, reviews, type Bike, type InsertBike, type BikeFilterParams, type Review, type InsertReview } from "@shared/schema";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth";

export interface IStorage extends IAuthStorage {
  // Bike operations
  getBikes(filters?: BikeFilterParams): Promise<Bike[]>;
  getBike(id: number): Promise<Bike | undefined>;
  createBike(bike: InsertBike): Promise<Bike>;
  updateBike(id: number, bike: Partial<InsertBike>): Promise<Bike | undefined>;
  // Review operations
  getReviews(bikeId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bikes: Map<number, Bike>;
  private reviews: Map<number, Review[]>;
  private currentBikeId: number;
  private currentReviewId: number;

  constructor() {
    this.users = new Map();
    this.bikes = new Map();
    this.reviews = new Map();
    this.currentBikeId = 1;
    this.currentReviewId = 1;

    // Pre-populate bikes
    const bikesToSeed: InsertBike[] = [
      // ─── Trending ───
      {
        name: "Yamaha R15 V4",
        price: 182000,
        year: 2024,
        cc: 155,
        mileage: "45 kmpl",
        transmission: "6 Speed",
        power: "18.4 PS",
        torque: "14.2 Nm",
        topSpeed: "140 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "142 kg",
        tankCapacity: "11 L",
        rating: "4.5",
        imageUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/r_series_all/r15v4/color/metallic-black.webp",
        brand: "Yamaha",
        category: "Trending",
        description: "The Yamaha R15 V4 is a sports bike available in 5 variants and 5 colours. It is powered by a 155cc BS6 engine with aggressive aerodynamics.",
        availableColors: ["Racing Blue", "Metallic Red", "Dark Knight"],
      },
      {
        name: "KTM Duke 390",
        price: 311000,
        year: 2024,
        cc: 399,
        mileage: "28 kmpl",
        transmission: "6 Speed",
        power: "46 PS",
        torque: "39 Nm",
        topSpeed: "167 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel with Supermoto Mode",
        weight: "168 kg",
        tankCapacity: "15 L",
        rating: "4.6",
        imageUrl: "https://cdn-echom.nitrocdn.com/WJcaZvQAZfcUukrCNMKBbKboCIBujVey/assets/images/optimized/rev-516a873/wp-content/uploads/2017/12/Gray-KTM-390-Duke-2020.png",
        brand: "KTM",
        category: "Trending",
        description: "The KTM 390 Duke is a naked streetfighter that offers thrilling performance and sharp handling for the ultimate urban experience.",
        availableColors: ["Electronic Orange", "Atlantic Blue"],
      },
      {
        name: "Royal Enfield Meteor 350",
        price: 215000,
        year: 2024,
        cc: 349,
        mileage: "36 kmpl",
        transmission: "5 Speed",
        power: "20.2 PS",
        torque: "27 Nm",
        topSpeed: "120 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "191 kg",
        tankCapacity: "15 L",
        rating: "4.6",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Royal-Enfield/METEOR-350/Royal-Enfield-METEOR-350-43484.jpg",
        brand: "Royal Enfield",
        category: "Trending",
        description: "The Royal Enfield Meteor 350 is a relaxed cruiser motorcycle with a comfortable riding position and star-gazing heritage.",
        availableColors: ["Fireball", "Stellar", "Supernova"],
      },
      {
        name: "Royal Enfield Himalayan 450",
        price: 289000,
        year: 2024,
        cc: 452,
        mileage: "30 kmpl",
        transmission: "6 Speed",
        power: "40.2 PS",
        torque: "40 Nm",
        topSpeed: "150 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel (Switchable)",
        weight: "196 kg",
        tankCapacity: "17 L",
        rating: "4.8",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Royal-Enfield/Himalayan-450/Royal-Enfield-Himalayan-450-47208.jpg",
        brand: "Royal Enfield",
        category: "Trending",
        description: "The all-new Himalayan 450 is built for long-distance adventure touring with a liquid-cooled engine and modern electronics suite.",
        availableColors: ["Slate Himalayan Salt", "Granite Himalayan Peaks", "Hanle Black"],
      },
      {
        name: "Royal Enfield Hunter 350",
        price: 155000,
        year: 2024,
        cc: 349,
        mileage: "36 kmpl",
        transmission: "5 Speed",
        power: "20.2 PS",
        torque: "27 Nm",
        topSpeed: "114 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "181 kg",
        tankCapacity: "13 L",
        rating: "4.6",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Royal-Enfield/HUNTER-350/Royal-Enfield-HUNTER-350-45236.jpg",
        brand: "Royal Enfield",
        category: "Trending",
        description: "The Hunter 350 is Royal Enfield's urban roadster — compact, agile, and packed with personality for city riding.",
        availableColors: ["Dapper Ash", "Dapper Grey", "Rebel Blue", "Rebel Red"],
      },
      {
        name: "BMW G 310 R",
        price: 295000,
        year: 2024,
        cc: 313,
        mileage: "32 kmpl",
        transmission: "6 Speed",
        power: "34 PS",
        torque: "28 Nm",
        topSpeed: "163 kmph",
        fuelType: "Petrol",
        abs: "Single Channel",
        weight: "158.5 kg",
        tankCapacity: "11 L",
        rating: "4.5",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/BMW/G-310-R/BMW-G-310-R-27880.jpg",
        brand: "BMW",
        category: "Trending",
        description: "The BMW G 310 R is the perfect entry into the world of BMW Motorrad. Urban agility meets robust performance.",
        availableColors: ["Racing Red", "Cosmic Black", "San Marino Blue"],
      },

      // ─── Popular ───
      {
        name: "Royal Enfield Classic 350",
        price: 193000,
        year: 2024,
        cc: 349,
        mileage: "35 kmpl",
        transmission: "5 Speed",
        power: "20.2 PS",
        torque: "27 Nm",
        topSpeed: "114 kmph",
        fuelType: "Petrol",
        abs: "Single/Dual Channel",
        weight: "195 kg",
        tankCapacity: "13 L",
        rating: "4.7",
        imageUrl: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/new-classic-350/studio-shots/360/stealth-black/stealth-black-000.png",
        brand: "Royal Enfield",
        category: "Popular",
        description: "The Classic 350 is Royal Enfield's best-selling model, known for its retro styling and iconic thumping exhaust note.",
        availableColors: ["Redditch Red", "Halcyon Green", "Signals Marsh Grey"],
      },
      {
        name: "TVS Apache RR 310",
        price: 272000,
        year: 2024,
        cc: 312,
        mileage: "30 kmpl",
        transmission: "6 Speed",
        power: "34 PS",
        torque: "27.3 Nm",
        topSpeed: "160 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "174 kg",
        tankCapacity: "11 L",
        rating: "4.6",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/TVS/Apache-RR-310/TVS-Apache-RR-310-9278.jpg",
        brand: "TVS",
        category: "Popular",
        description: "TVS Apache RR 310 is a flagship sports bike with aerodynamic design and premium features tuned for performance.",
        availableColors: ["Racing Red", "Titanium Black"],
      },
      {
        name: "Harley-Davidson Iron 883",
        price: 1249000,
        year: 2024,
        cc: 883,
        mileage: "18 kmpl",
        transmission: "5 Speed",
        power: "50 PS",
        torque: "68 Nm",
        topSpeed: "170 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "252 kg",
        tankCapacity: "12.5 L",
        rating: "4.7",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Harley-Davidson/Iron-883/Harley-Davidson-Iron-883-22196.jpg",
        brand: "Harley-Davidson",
        category: "Popular",
        description: "The Harley-Davidson Iron 883 is a Dark Custom motorcycle embodying raw, stripped-down Sportster style.",
        availableColors: ["Vivid Black", "Billiard Teal", "Industrial Yellow"],
      },
      {
        name: "Hero Splendor Plus",
        price: 79000,
        year: 2024,
        cc: 97,
        mileage: "65 kmpl",
        transmission: "4 Speed",
        power: "8.02 PS",
        torque: "8.05 Nm",
        topSpeed: "95 kmph",
        fuelType: "Petrol",
        abs: "CBS",
        weight: "112 kg",
        tankCapacity: "9.8 L",
        rating: "4.5",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Hero/Splendor-Plus/Hero-Splendor-Plus-32597.jpg",
        brand: "Hero",
        category: "Popular",
        description: "Hero Splendor Plus is India's most beloved commuter motorcycle, trusted by millions for efficiency and reliability.",
        availableColors: ["Heavy Grey", "Sports Red", "Black Sports Red"],
      },
      {
        name: "Honda Activa 6G",
        price: 75000,
        year: 2024,
        cc: 109,
        mileage: "60 kmpl",
        transmission: "Automatic (CVT)",
        power: "7.68 PS",
        torque: "8.79 Nm",
        topSpeed: "90 kmph",
        fuelType: "Petrol",
        abs: "CBS",
        weight: "107 kg",
        tankCapacity: "5.3 L",
        rating: "4.5",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/scooter/Honda/Activa-6G/Honda-Activa-6G-36044.jpg",
        brand: "Honda",
        category: "Popular",
        description: "Honda Activa 6G is India's No.1 selling scooter with enhanced fuel efficiency and ACG Silent Starter.",
        availableColors: ["Pearl Precious White", "Matte Mature Silver", "Matte Axis Grey Metallic"],
      },

      // ─── Standard ───
      {
        name: "Kawasaki Ninja 300",
        price: 343000,
        year: 2024,
        cc: 296,
        mileage: "30 kmpl",
        transmission: "6 Speed",
        power: "39 PS",
        torque: "26.1 Nm",
        topSpeed: "160 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "179 kg",
        tankCapacity: "17 L",
        rating: "4.4",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZgCjAE02P6zsj1wbdb_nhfBFv8xBOIlqo2A&s",
        brand: "Kawasaki",
        category: "Standard",
        description: "The Ninja 300 is the most affordable twin-cylinder sports bike from Kawasaki in India — a gateway to performance riding.",
        availableColors: ["Lime Green", "Candy Lime Green", "Ebony"],
      },
      {
        name: "Bajaj Pulsar NS200",
        price: 142000,
        year: 2024,
        cc: 199,
        mileage: "35 kmpl",
        transmission: "6 Speed",
        power: "24.5 PS",
        torque: "18.74 Nm",
        topSpeed: "136 kmph",
        fuelType: "Petrol",
        abs: "Single Channel",
        weight: "156 kg",
        tankCapacity: "12 L",
        rating: "4.4",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Bajaj/Pulsar-NS200/Bajaj-Pulsar-NS200-13777.jpg",
        brand: "Bajaj",
        category: "Standard",
        description: "The Bajaj Pulsar NS200 is a naked streetfighter with aggressive styling and strong performance for everyday riders.",
        availableColors: ["Pewter Grey", "Caribbean Blue", "Charcoal Black"],
      },

      // ─── Premium ───
      {
        name: "Honda CBR 650R",
        price: 935000,
        year: 2024,
        cc: 649,
        mileage: "20 kmpl",
        transmission: "6 Speed",
        power: "87 PS",
        torque: "57.5 Nm",
        topSpeed: "220 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "211 kg",
        tankCapacity: "15.4 L",
        rating: "4.8",
        imageUrl: "https://cdn3.shopvii.com/929/729/image__24_.png",
        brand: "Honda",
        category: "Premium",
        description: "The CBR650R is a middleweight sports bike with an inline-four engine delivering thrilling highway performance.",
        availableColors: ["Grand Prix Red", "Matte Gunpowder Black Metallic"],
      },
      {
        name: "BMW S 1000 RR",
        price: 2090000,
        year: 2024,
        cc: 999,
        mileage: "13 kmpl",
        transmission: "6 Speed",
        power: "210 PS",
        torque: "113 Nm",
        topSpeed: "299 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel (Race ABS)",
        weight: "197 kg",
        tankCapacity: "16.5 L",
        rating: "4.9",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/BMW/S-1000-RR/BMW-S-1000-RR-14490.jpg",
        brand: "BMW",
        category: "Premium",
        description: "The BMW S 1000 RR superbike delivers a maximum output of 210 hp with cutting-edge electronics for road and track.",
        availableColors: ["M Motorsport", "Light White / Racing Blue", "Hockenheim Silver"],
      },
      {
        name: "Ducati Panigale V4",
        price: 2650000,
        year: 2024,
        cc: 1103,
        mileage: "12 kmpl",
        transmission: "6 Speed",
        power: "215.5 PS",
        torque: "123.6 Nm",
        topSpeed: "299 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel (Bosch Cornering ABS)",
        weight: "195 kg",
        tankCapacity: "16 L",
        rating: "4.9",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Ducati/Panigale-V4/Ducati-Panigale-V4-28279.jpg",
        brand: "Ducati",
        category: "Premium",
        description: "The Ducati Panigale V4 is the pinnacle of Italian engineering — racing heritage meets road-going perfection.",
        availableColors: ["Ducati Red", "Winter Test Livery", "Speciale"],
      },
      {
        name: "Kawasaki Ninja ZX-10R",
        price: 1599000,
        year: 2024,
        cc: 998,
        mileage: "14 kmpl",
        transmission: "6 Speed",
        power: "203 PS",
        torque: "114.9 Nm",
        topSpeed: "299 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel (KIBS)",
        weight: "207 kg",
        tankCapacity: "17 L",
        rating: "4.9",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Kawasaki/Ninja-ZX-10R/Kawasaki-Ninja-ZX-10R-4494.jpg",
        brand: "Kawasaki",
        category: "Premium",
        description: "The Kawasaki Ninja ZX-10R is a litre-class superbike with race-winning DNA built on MotoGP technology.",
        availableColors: ["Lime Green / Ebony", "Pearl Blizzard White / Gold"],
      },

      // ─── Electric ───
      {
        name: "Ather 450X",
        price: 138000,
        year: 2024,
        cc: 0,
        mileage: "111 km/charge",
        transmission: "Automatic",
        power: "6.4 kW",
        torque: "26 Nm",
        topSpeed: "90 kmph",
        fuelType: "Electric",
        abs: "CBS",
        weight: "111.6 kg",
        tankCapacity: "N/A",
        rating: "4.4",
        imageUrl: "https://5.imimg.com/data5/SELLER/Default/2024/9/450344797/FR/BK/AL/16402/ather-450x-electric-scooter-500x500.png",
        brand: "Ather",
        category: "Electric",
        description: "Ather 450X is a premium electric scooter known for its performance and smart connected features via Ather app.",
        availableColors: ["Space Grey", "Mint Green", "White"],
      },
      {
        name: "Ultraviolette F77",
        price: 380000,
        year: 2024,
        cc: 0,
        mileage: "307 km/charge",
        transmission: "Automatic",
        power: "30 kW",
        torque: "100 Nm",
        topSpeed: "152 kmph",
        fuelType: "Electric",
        abs: "Dual Channel",
        weight: "207 kg",
        tankCapacity: "N/A",
        rating: "4.7",
        imageUrl: "https://www.lerepairedesmotards.com/img/actu/2025/nouveaute/roadster-electrique-ultraviolette-f77-superstreet-profil_hd.jpg",
        brand: "Ultraviolette",
        category: "Electric",
        description: "India's first high-performance electric motorcycle — futuristic design meets track-worthy power delivery.",
        availableColors: ["Airstrike", "Shadow", "Laser"],
      },

      // ─── Upcoming ───
      {
        name: "KTM RC 390 (2025)",
        price: 338000,
        year: 2025,
        cc: 399,
        mileage: "25 kmpl",
        transmission: "6 Speed",
        power: "46 PS",
        torque: "39 Nm",
        topSpeed: "179 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel with Supermoto Mode",
        weight: "172 kg",
        tankCapacity: "13.7 L",
        rating: "4.7",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/KTM/RC-390/KTM-RC-390-7266.jpg",
        brand: "KTM",
        category: "Upcoming",
        description: "The all-new 2025 KTM RC 390 features a Trellis frame, new electronics suite, and sharper aerodynamics. India launch imminent.",
        availableColors: ["Orange / Black", "White / Black"],
      },
      {
        name: "Royal Enfield Guerrilla 450",
        price: 229000,
        year: 2025,
        cc: 452,
        mileage: "35 kmpl",
        transmission: "6 Speed",
        power: "40.02 PS",
        torque: "40 Nm",
        topSpeed: "155 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel (Switchable)",
        weight: "185 kg",
        tankCapacity: "13 L",
        rating: "4.8",
        imageUrl: "https://www.zigwheels.com/imgd/gallery/motorcycle/Royal-Enfield/Guerrilla-450/Royal-Enfield-Guerrilla-450-48521.jpg",
        brand: "Royal Enfield",
        category: "Upcoming",
        description: "Guerrilla 450 is a retro-modern roadster with a liquid-cooled 452cc engine. Launching in 2025 with modern electronics.",
        availableColors: ["Aluminium", "Dune Orange", "Molten Purple"],
      },
    ];

    bikesToSeed.forEach(bike => this.createBike(bike));
  }

  async getUser(id) {
    return this.users.get(id);
  }

  async upsertUser(user) {
    const id = user.id;
    const existingUser = this.users.get(id);
    const updatedUser = {
      ...user,
      id,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getBikes(filters) {
    let bikes = Array.from(this.bikes.values());
    if (filters) {
      if (filters.brand) bikes = bikes.filter(b => b.brand === filters.brand);
      if (filters.minPrice) bikes = bikes.filter(b => b.price >= filters.minPrice);
      if (filters.maxPrice) bikes = bikes.filter(b => b.price <= filters.maxPrice);
      if (filters.minCC) bikes = bikes.filter(b => b.cc >= filters.minCC);
      if (filters.maxCC) bikes = bikes.filter(b => b.cc <= filters.maxCC);
      if (filters.category) bikes = bikes.filter(b => b.category === filters.category);
      if (filters.search) {
        const s = filters.search.toLowerCase();
        bikes = bikes.filter(b => b.name.toLowerCase().includes(s) || b.brand.toLowerCase().includes(s));
      }
      if (filters.sort === 'price_asc') bikes.sort((a, b) => a.price - b.price);
      else if (filters.sort === 'price_desc') bikes.sort((a, b) => b.price - a.price);
      else if (filters.sort === 'latest') bikes.sort((a, b) => b.year - a.year);
    }
    return bikes;
  }

  async getBike(id) { return this.bikes.get(id); }

  async createBike(insertBike) {
    const id = this.currentBikeId++;
    const bike = {
      ...insertBike,
      id,
      mileage: insertBike.mileage ?? null,
      transmission: insertBike.transmission ?? null,
      power: insertBike.power ?? null,
      torque: insertBike.torque ?? null,
      topSpeed: insertBike.topSpeed ?? null,
      fuelType: insertBike.fuelType ?? null,
      abs: insertBike.abs ?? null,
      weight: insertBike.weight ?? null,
      tankCapacity: insertBike.tankCapacity ?? null,
      rating: insertBike.rating ?? null,
      description: insertBike.description ?? null,
      availableColors: insertBike.availableColors ?? null,
    };
    this.bikes.set(id, bike);
    return bike;
  }

  async updateBike(id, bikeUpdate) {
    const existing = this.bikes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...bikeUpdate };
    this.bikes.set(id, updated);
    return updated;
  }

  async getReviews(bikeId) {
    return (this.reviews.get(bikeId) || []).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createReview(insertReview) {
    const id = this.currentReviewId++;
    const review = { ...insertReview, id, createdAt: new Date() };
    const existing = this.reviews.get(insertReview.bikeId) || [];
    this.reviews.set(insertReview.bikeId, [...existing, review]);
    return review;
  }
}

export const storage = new MemStorage();
