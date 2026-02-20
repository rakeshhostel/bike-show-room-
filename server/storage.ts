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
      {
        name: "Yamaha R15 V4 ",
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
        description: "The Yamaha R15 V4 is a sports bike available in 5 variants and 5 colours. It is powered by a 155cc BS6 engine.",
        availableColors: ["Racing Blue", "Metallic Red", "Dark Knight"],
      },
      {
        name: "Royal Enfield Classic  350",
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
        description: "The Classic 350 is Royal Enfield's best-selling model, known for its retro styling and thumping exhaust note.",
        availableColors: ["Redditch Red", "Halcyon Green", "Signals Marsh Grey"],
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
        description: "The KTM 390 Duke is a naked streetfighter that offers thrilling performance and sharp handling.",
        availableColors: ["Electronic Orange", "Atlantic Blue"],
      },
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
        description: "The Ninja 300 is the most affordable twin-cylinder sports bike from Kawasaki in India.",
        availableColors: ["Lime Green", "Candy Lime Green", "Ebony"],
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
        imageUrl: "https://imgd.aeplcdn.com/1056x594/n/pcv9qfb_1828109.jpg?q=80",
        brand: "TVS",
        category: "Popular",
        description: "TVS Apache RR 310 is a flagship sports bike with aerodynamic design and premium features.",
        availableColors: ["Racing Red", "Titanium Black"],
      },
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
        description: "The CBR650R is a middleweight sports bike with an inline-four engine.",
        availableColors: ["Grand Prix Red", "Matte Gunpowder Black Metallic"],
      },
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
        description: "Ather 450X is a premium electric scooter known for its performance and smart features.",
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
        description: "India's first high-performance electric motorcycle with futuristic design.",
        availableColors: ["Airstrike", "Shadow", "Laser"],
      }
    ];

    bikesToSeed.forEach(bike => this.createBike(bike));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const id = user.id as string;
    const existingUser = this.users.get(id);
    const updatedUser: User = {
      ...user,
      id: id,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    } as User;
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getBikes(filters?: BikeFilterParams): Promise<Bike[]> {
    let bikes = Array.from(this.bikes.values());

    if (filters) {
      if (filters.brand) {
        bikes = bikes.filter(bike => bike.brand === filters.brand);
      }
      if (filters.minPrice) {
        bikes = bikes.filter(bike => bike.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        bikes = bikes.filter(bike => bike.price <= filters.maxPrice!);
      }
      if (filters.minCC) {
        bikes = bikes.filter(bike => bike.cc >= filters.minCC!);
      }
      if (filters.maxCC) {
        bikes = bikes.filter(bike => bike.cc <= filters.maxCC!);
      }
      if (filters.category) {
        bikes = bikes.filter(bike => bike.category === filters.category);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        bikes = bikes.filter(bike => bike.name.toLowerCase().includes(searchLower));
      }

      if (filters.sort) {
        if (filters.sort === 'price_asc') {
          bikes.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'price_desc') {
          bikes.sort((a, b) => b.price - a.price);
        } else if (filters.sort === 'latest') {
          bikes.sort((a, b) => b.year - a.year);
        }
      }
    }

    return bikes;
  }

  async getBike(id: number): Promise<Bike | undefined> {
    return this.bikes.get(id);
  }

  async createBike(insertBike: InsertBike): Promise<Bike> {
    const id = this.currentBikeId++;
    const bike: Bike = {
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
      availableColors: (insertBike.availableColors as string[]) ?? null
    };
    this.bikes.set(id, bike);
    return bike;
  }

  async updateBike(id: number, bikeUpdate: Partial<InsertBike>): Promise<Bike | undefined> {
    const existingBike = this.bikes.get(id);
    if (!existingBike) return undefined;

    // Create a new object with the updates, ensuring type safety
    // iterating over generic object keys to apply updates
    const updatedBike = { ...existingBike };

    // Explicitly update fields that are in the update object
    Object.assign(updatedBike, bikeUpdate);

    this.bikes.set(id, updatedBike);
    return updatedBike;
  }

  async getReviews(bikeId: number): Promise<Review[]> {
    return this.reviews.get(bikeId)?.sort((a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    ) || [];
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date()
    };

    const existingReviews = this.reviews.get(insertReview.bikeId) || [];
    this.reviews.set(insertReview.bikeId, [...existingReviews, review]);

    return review;
  }
}

export const storage = new MemStorage();
